#!/usr/bin/env python3
"""Build the Hugging Face dataset `modalhub/records` from the served modalhub records.

Reads GET /v1/records (paged), then every record's canonical .json and .md, and writes
hf/dist/: data/records.parquet (one row per served record), records.jsonl (same rows) and
README.md (the dataset card, from hf/README.template.md). With --upload it pushes hf/dist/
to the dataset repo; the token comes from HF_TOKEN or ~/.modalhub/hf.token and is never printed.

usage: python hf/build.py [--api https://api.modalhub.ai] [--repo modalhub/records] [--upload]
Needs Python 3.10+, pyarrow and (for --upload) huggingface_hub.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import pyarrow as pa
import pyarrow.parquet as pq

HERE = Path(__file__).resolve().parent
DIST = HERE / "dist"
UA = "modalhub-records-hf/1.0 (+https://huggingface.co/datasets/modalhub/records)"


def get(url: str, accept: str) -> bytes:
    """GET with the sync's retry rule: 429 and 5xx back off, everything else is final."""
    for attempt in range(1, 6):
        req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": accept})
        try:
            with urllib.request.urlopen(req, timeout=60) as res:
                return res.read()
        except urllib.error.HTTPError as err:
            if err.code == 429 or err.code >= 500:
                wait = int(err.headers.get("retry-after") or attempt * 5)
                time.sleep(wait)
                continue
            raise RuntimeError(f"GET {url}: HTTP {err.code}") from err
    raise RuntimeError(f"GET {url}: still rate limited after 5 attempts")


def list_records(api: str) -> list[dict]:
    items: list[dict] = []
    cursor = ""
    while True:
        url = f"{api}/v1/records?limit=100" + (f"&cursor={urllib.parse.quote(cursor)}" if cursor else "")
        page = json.loads(get(url, "application/json"))
        items.extend(page["items"])
        cursor = page.get("next_cursor") or ""
        if not cursor:
            return items


def fetch_full(item: dict) -> tuple[dict, str]:
    """The canonical JSON and the exact markdown the API serves for one record."""
    rec = json.loads(get(item["url"] + ".json", "application/json"))
    md = get(item["url"] + ".md", "text/markdown").decode("utf-8").replace("\r\n", "\n")
    return rec, md


def ref_id(ref) -> str | None:
    """A record / open-problem reference object -> its id (or short id), else None."""
    if not isinstance(ref, dict):
        return None
    return ref.get("id") or ref.get("short_id") or ref.get("url")


def flag_text(flag) -> str:
    if not isinstance(flag, dict):
        return str(flag)
    args = flag.get("args") or []
    return flag["code"] + (":" + ",".join(str(a) for a in args) if args else "")


def row(rec: dict, md: str) -> dict:
    conf = rec.get("confirmations") or {}
    fix = rec.get("fix") or {}
    risk = rec.get("risk") or {}
    with_ = rec.get("with") or {}
    return {
        "id": rec["id"],
        "slug": rec["slug"],
        "url": rec["url"],
        "tool": rec["tool"],
        "version": rec.get("version") or "",
        "os": rec.get("os") if isinstance(rec.get("os"), str) else None,
        "date": rec.get("date"),
        "symptom": rec["symptom"],
        "cause": rec.get("cause") or "",
        "fix_type": fix.get("type") or "",
        "fix_body": fix.get("body") or "",
        "repro": rec.get("repro") or "",
        "check": rec.get("check") or "",
        "command": rec.get("command") or "",
        "exit_code": rec.get("exit_code"),
        "notes": rec.get("notes") or "",
        "status": rec.get("status") or "",
        "risk_level": risk.get("level") or "",
        "risk_flags": [flag_text(f) for f in (risk.get("flags") or [])],
        "prefer_when": rec.get("prefer_when"),
        "alternative_to": ref_id(rec.get("alternative_to")),
        "alternatives": [
            {"id": a.get("id") or "", "slug": a.get("slug") or "", "prefer_when": a.get("prefer_when")}
            for a in (rec.get("alternatives") or [])
        ],
        "supersedes": ref_id(rec.get("supersedes")),
        "superseded_by": ref_id(rec.get("superseded_by")),
        "resolves": ref_id(rec.get("resolves")),
        "dead_ends": [
            {"attempt": d.get("attempt") or "", "why": d.get("why") or "", "reports": int(d.get("reports") or 0)}
            for d in (rec.get("dead_ends") or [])
        ],
        "worked": int(conf.get("worked") or 0),
        "didnt": int(conf.get("didnt") or 0),
        "agents": int(conf.get("agents") or 0),
        "last_confirmed": conf.get("last") if isinstance(conf.get("last"), str) and conf.get("last") != "never" else None,
        "by_version": [
            {"version": b.get("version") or "", "worked": int(b.get("worked") or 0), "didnt": int(b.get("didnt") or 0), "status": b.get("status") or ""}
            for b in (conf.get("by_version") or [])
        ],
        "by_with": [
            {"name": b.get("name") or "", "version": b.get("version") or "", "worked": int(b.get("worked") or 0), "didnt": int(b.get("didnt") or 0), "status": b.get("status") or ""}
            for b in (conf.get("by_with") or [])
        ],
        "env_with": [{"name": k, "version": str(v)} for k, v in sorted(with_.items())],
        "license": rec.get("license") or "CC0-1.0",
        "created_at": rec.get("created_at") or "",
        "updated_at": rec.get("updated_at") or "",
        "markdown": md,
    }


SCHEMA = pa.schema(
    [
        ("id", pa.string()),
        ("slug", pa.string()),
        ("url", pa.string()),
        ("tool", pa.string()),
        ("version", pa.string()),
        ("os", pa.string()),
        ("date", pa.string()),
        ("symptom", pa.string()),
        ("cause", pa.string()),
        ("fix_type", pa.string()),
        ("fix_body", pa.string()),
        ("repro", pa.string()),
        ("check", pa.string()),
        ("command", pa.string()),
        ("exit_code", pa.int64()),
        ("notes", pa.string()),
        ("status", pa.string()),
        ("risk_level", pa.string()),
        ("risk_flags", pa.list_(pa.string())),
        ("prefer_when", pa.string()),
        ("alternative_to", pa.string()),
        ("alternatives", pa.list_(pa.struct([("id", pa.string()), ("slug", pa.string()), ("prefer_when", pa.string())]))),
        ("supersedes", pa.string()),
        ("superseded_by", pa.string()),
        ("resolves", pa.string()),
        ("dead_ends", pa.list_(pa.struct([("attempt", pa.string()), ("why", pa.string()), ("reports", pa.int64())]))),
        ("worked", pa.int64()),
        ("didnt", pa.int64()),
        ("agents", pa.int64()),
        ("last_confirmed", pa.string()),
        ("by_version", pa.list_(pa.struct([("version", pa.string()), ("worked", pa.int64()), ("didnt", pa.int64()), ("status", pa.string())]))),
        ("by_with", pa.list_(pa.struct([("name", pa.string()), ("version", pa.string()), ("worked", pa.int64()), ("didnt", pa.int64()), ("status", pa.string())]))),
        ("env_with", pa.list_(pa.struct([("name", pa.string()), ("version", pa.string())]))),
        ("license", pa.string()),
        ("created_at", pa.string()),
        ("updated_at", pa.string()),
        ("markdown", pa.string()),
    ]
)


def build(api: str, generated_at: str) -> list[dict]:
    items = list_records(api)
    print(f"{len(items)} served records", flush=True)
    with ThreadPoolExecutor(max_workers=4) as pool:
        full = list(pool.map(fetch_full, items))
    rows = sorted((row(rec, md) for rec, md in full), key=lambda r: (r["created_at"], r["id"]))

    (DIST / "data").mkdir(parents=True, exist_ok=True)
    table = pa.Table.from_pylist(rows, schema=SCHEMA)
    pq.write_table(table, DIST / "data" / "records.parquet", compression="zstd")
    with open(DIST / "records.jsonl", "w", encoding="utf-8", newline="\n") as out:
        for r in rows:
            out.write(json.dumps(r, ensure_ascii=False, sort_keys=True) + "\n")

    template = (HERE / "README.template.md").read_text(encoding="utf-8")
    card = (
        template.replace("{{count}}", str(len(rows)))
        .replace("{{tools}}", str(len({r["tool"] for r in rows})))
        .replace("{{confirmed}}", str(sum(1 for r in rows if r["status"] == "confirmed")))
        .replace("{{generated_at}}", generated_at)
        .replace("{{api}}", api)
    )
    (DIST / "README.md").write_text(card, encoding="utf-8", newline="\n")
    print(f"wrote {DIST / 'data' / 'records.parquet'} ({table.nbytes} B in memory), records.jsonl, README.md", flush=True)
    return rows


def token() -> str:
    tok = os.environ.get("HF_TOKEN", "").strip()
    if tok:
        return tok
    path = Path.home() / ".modalhub" / "hf.token"
    if path.is_file():
        tok = path.read_text(encoding="utf-8").strip()
        if tok:
            return tok
    raise SystemExit("--upload needs HF_TOKEN (or ~/.modalhub/hf.token); nothing uploaded")


def upload(repo: str, count: int, generated_at: str) -> None:
    from huggingface_hub import HfApi

    api = HfApi(token=token())
    api.create_repo(repo_id=repo, repo_type="dataset", private=False, exist_ok=True)
    info = api.upload_folder(
        folder_path=str(DIST),
        repo_id=repo,
        repo_type="dataset",
        commit_message=f"sync: {count} records as of {generated_at[:10]}",
    )
    print(f"uploaded to https://huggingface.co/datasets/{repo} ({getattr(info, 'oid', info)})", flush=True)


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--api", default="https://api.modalhub.ai")
    ap.add_argument("--repo", default="modalhub/records")
    ap.add_argument("--upload", action="store_true", help="push hf/dist to the dataset repo")
    args = ap.parse_args()
    api = args.api.rstrip("/")
    if args.upload:
        token()  # fail before the two-minute build when the token is missing
    generated_at = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    rows = build(api, generated_at)
    if args.upload:
        upload(args.repo, len(rows), generated_at)


if __name__ == "__main__":
    main()
