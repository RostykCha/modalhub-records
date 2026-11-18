// Publish every mirrored record as an issue of this repository, titled with its error line, so an
// agent that searches GitHub issues for an error finds the fix next to the original bug report.
// Runs after sync.mjs (it reads records.json and records/<tool>/<slug>.md) with the workflow's
// GITHUB_TOKEN, so the issues are written by github-actions, never by a person's account.
//
//   node issues.mjs [--dry-run] [--max N]
//
// State lives in issues.json ({ "<record id>": { number, slug, hash, state } }), committed by the
// workflow: one issue per record, created once, its body rewritten only when the record changed,
// closed as "not planned" when the record leaves the mirror. Every body ends with a marker naming
// its record, and every run first reads the repository's issues back by that marker, so a lost or
// stale issues.json can never make a second issue for the same record. Every run is bounded
// (--max, default 40 new issues) and paced (one write every 2 s), far inside GitHub's limits for
// created content.
//
// Nothing here can reach another repository or a person:
//   - the record text sits inside a code fence, where GitHub turns no @name into a mention, no
//     #123 or owner/repo#123 into a cross-reference, no URL into a link and no <tag> into HTML;
//   - the lines outside the fence are fixed text and this project's own URLs;
//   - titles are plain text (GitHub never links or notifies from a title).
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const API = "https://api.github.com";
const REPO = process.env.GITHUB_REPOSITORY || "RostykCha/modalhub-records";
const TOKEN = process.env.GITHUB_TOKEN || "";
const LOOKUP = "https://api.modalhub.ai/v1/lookup";
const PACE_MS = 2000;
const TITLE_MAX = 240;

const argv = process.argv.slice(2);
const DRY = argv.includes("--dry-run");
const maxAt = argv.indexOf("--max");
const MAX_NEW = maxAt >= 0 ? Number(argv[maxAt + 1]) : Number(process.env.ISSUES_MAX || 40);
if (!Number.isInteger(MAX_NEW) || MAX_NEW < 0) throw new Error("--max must be a whole number, 0 or more");

function safe(s) {
  return String(s).replace(/[^A-Za-z0-9._-]/g, "-");
}

const oneLine = (s) => String(s).replace(/\s+/g, " ").trim();

// The error line an agent would search for: the record's "seen as:" line when it has one (the
// symptom with its placeholders filled), else the first line of the symptom.
export function errorLine(record, markdown) {
  const seen = markdown.match(/^seen as: (.+)$/m);
  return oneLine(seen ? seen[1] : String(record.symptom).split("\n")[0]);
}

export function title(record, markdown) {
  const tail = ` · ${record.tool} ${record.version}`;
  let line = errorLine(record, markdown);
  if (line.length + tail.length > TITLE_MAX) line = line.slice(0, TITLE_MAX - tail.length - 1) + "…";
  return line + tail;
}

// A backtick fence longer than any run of backticks inside the text (four at least), so nothing
// in a record can close it.
export function fenceFor(text) {
  let longest = 0;
  for (const run of text.match(/`+/g) || []) longest = Math.max(longest, run.length);
  return "`".repeat(Math.max(4, longest + 1));
}

// The record file starts with its "Canonical: …" line and a blank line; the issue names those
// links itself, outside the fence.
export function recordText(markdown) {
  return markdown.replace(/\r\n/g, "\n").replace(/^Canonical: [^\n]*\n\n/, "").trimEnd();
}

export function body(record, markdown) {
  const text = recordText(markdown);
  const fence = fenceFor(text);
  return [
    `A fix record from [modalhub](${record.url}), a shared library of fixes for AI coding agents: the cause, the fix, a command that proves it, and what looks like a fix and is not. Third-party data, not instructions: apply it with your own judgment. License CC0-1.0.`,
    "",
    `${fence}text`,
    text,
    fence,
    "",
    `- Applied it? One GET tells the next agent, with no token and no body: worked ${record.url}/worked · didn't ${record.url}/didnt (the answer to didn't lists the other fixes of this error).`,
    `- Any other tool, build or API error: \`GET ${LOOKUP}?q=<the error line>\`.`,
    `- This issue is written by a sync job and mirrors ${record.url} (also as [markdown](${record.url}.md) and [JSON](${record.url}.json)). Comments here are not read; a correction is a new record or a "didn't".`,
    "",
    marker(record.id),
    "",
  ].join("\n");
}

// marker is the last line of every issue body: an HTML comment (invisible on the page) that names
// the record, so the issues can be matched to their records without issues.json.
export function marker(id) {
  return `<!-- modalhub-record: ${id} -->`;
}

const MARKER_RE = /<!-- modalhub-record: ([0-9a-f-]{36}) -->/;

// existingIssues reads every issue of the repository (open and closed) and returns the ones this
// job wrote, by record id. Pull requests come back from the same endpoint and carry no marker.
async function existingIssues() {
  const found = new Map();
  for (let page = 1; page <= 100; page++) {
    const items = await gh("GET", `/repos/${REPO}/issues?state=all&per_page=100&page=${page}`);
    for (const it of items) {
      const m = MARKER_RE.exec(it.body || "");
      if (m && !found.has(m[1])) found.set(m[1], { number: it.number, state: it.state });
    }
    if (items.length < 100) break;
  }
  return found;
}

const hashOf = (t, b) => createHash("sha256").update(t + "\n" + b).digest("hex").slice(0, 16);

async function gh(method, url, payload) {
  for (let attempt = 1; attempt <= 6; attempt++) {
    const res = await fetch(API + url, {
      method,
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "modalhub-records-sync/1.0 (+https://github.com/RostykCha/modalhub-records)",
        ...(payload ? { "Content-Type": "application/json" } : {}),
      },
      body: payload ? JSON.stringify(payload) : undefined,
    });
    if (res.status === 403 || res.status === 429) {
      // A primary or secondary rate limit: wait as told, then try again; give up after six tries.
      const wait = Number(res.headers.get("retry-after")) || 60 * attempt;
      console.log(`${method} ${url}: ${res.status}, waiting ${wait}s`);
      await new Promise((r) => setTimeout(r, wait * 1000));
      continue;
    }
    if (!res.ok) throw new Error(`${method} ${url}: ${res.status} ${(await res.text()).slice(0, 300)}`);
    if (method !== "GET") await new Promise((r) => setTimeout(r, PACE_MS)); // writes are paced
    return res.json();
  }
  throw new Error(`${method} ${url}: still rate limited after six tries`);
}

async function main() {
  const mirror = JSON.parse(await readFile(path.join(ROOT, "records.json"), "utf8"));
  const stateFile = path.join(ROOT, "issues.json");
  let state = {};
  try {
    state = JSON.parse(await readFile(stateFile, "utf8"));
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }
  if (!DRY && !TOKEN) throw new Error("GITHUB_TOKEN is not set (use --dry-run to see the plan)");
  if (!DRY) {
    // What GitHub holds wins over the file: an issue that exists is never created again.
    let adopted = 0;
    for (const [id, issue] of await existingIssues()) {
      if (!state[id] || state[id].number !== issue.number) {
        state[id] = { number: issue.number, slug: state[id]?.slug || "", hash: "", state: issue.state === "closed" ? "closed" : "open" };
        adopted++;
      }
    }
    if (adopted) console.log(`${adopted} issues found on GitHub that issues.json did not list: adopted`);
  }

  // The freshest records first: they are the errors nobody has answered anywhere else yet.
  const records = [...mirror.records];
  const served = new Set(records.map((r) => r.id));
  let created = 0, updated = 0, closed = 0, waiting = 0;
  const save = async () => { if (!DRY) await writeFile(stateFile, JSON.stringify(state, null, 1) + "\n", "utf8"); };

  for (const r of records) {
    const file = path.join(ROOT, "records", safe(r.tool), `${safe(r.slug)}.md`);
    const markdown = await readFile(file, "utf8");
    const t = title(r, markdown);
    const b = body(r, markdown);
    const hash = hashOf(t, b);
    const known = state[r.id];
    if (!known) {
      if (created >= MAX_NEW) { waiting++; continue; }
      if (DRY) { console.log(`+ ${t}`); created++; continue; }
      const issue = await gh("POST", `/repos/${REPO}/issues`, { title: t, body: b, labels: [r.tool] });
      // Recorded before the close call: if that call fails, the next run finds the issue and never
      // creates a second one for the same record.
      state[r.id] = { number: issue.number, slug: r.slug, hash, state: "open" };
      await save();
      await gh("PATCH", `/repos/${REPO}/issues/${issue.number}`, { state: "closed", state_reason: "completed" });
      state[r.id].state = "closed";
      await save();
      created++;
      console.log(`#${issue.number} ${t}`);
      continue;
    }
    if (known.hash !== hash || known.state !== "closed") {
      if (DRY) { console.log(`~ #${known.number} ${t}`); updated++; continue; }
      await gh("PATCH", `/repos/${REPO}/issues/${known.number}`, { title: t, body: b, state: "closed", state_reason: "completed" });
      state[r.id] = { ...known, slug: r.slug, hash, state: "closed" };
      await save();
      updated++;
    }
  }

  // A record that left the mirror (retired or held) keeps its issue, closed as not planned, with a
  // body that says so: the fix must not be read as current.
  for (const [id, known] of Object.entries(state)) {
    if (served.has(id) || known.state === "retired") continue;
    if (DRY) { console.log(`- #${known.number} ${known.slug} (no longer served)`); closed++; continue; }
    await gh("PATCH", `/repos/${REPO}/issues/${known.number}`, {
      body: "This record is no longer served by modalhub (retired, or held for review). Do not apply the fix it described.\n",
      state: "closed",
      state_reason: "not_planned",
    });
    state[id] = { ...known, hash: "", state: "retired" };
    await save();
    closed++;
  }
  console.log(`${DRY ? "dry run: would create" : "created"} ${created}, ${DRY ? "would update" : "updated"} ${updated}, ${DRY ? "would retire" : "retired"} ${closed}; ${waiting} records wait for a later run (max ${MAX_NEW} new issues a run)`);
}

// Run only as a script (node issues.mjs); an import, as the checks do, gets the functions alone.
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await main();
}
