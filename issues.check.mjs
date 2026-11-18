// Checks of issues.mjs over every mirrored record, with no network: node issues.check.mjs
// The promise of the issues job is that nothing in a record can reach a person or another
// repository. So for every record: outside the code fence the body holds no @mention, no #123
// reference and no HTML tag; the fence cannot be closed from inside; the title fits.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { body, errorLine, fenceFor, marker, recordText, title } from "./issues.mjs";

const safe = (s) => String(s).replace(/[^A-Za-z0-9._-]/g, "-");
const mirror = JSON.parse(await readFile(new URL("./records.json", import.meta.url), "utf8"));
assert.ok(mirror.records.length > 0, "records.json holds records");

let fenced = 0;
for (const r of mirror.records) {
  const md = await readFile(new URL(`./records/${safe(r.tool)}/${safe(r.slug)}.md`, import.meta.url), "utf8");
  const t = title(r, md);
  assert.ok(t.length <= 256, `${r.slug}: title fits GitHub's 256 characters`);
  assert.ok(t.endsWith(` · ${r.tool} ${r.version}`), `${r.slug}: title ends with the tool and version`);
  assert.ok(!/[\r\n]/.test(t), `${r.slug}: title is one line`);
  assert.ok(errorLine(r, md).length > 0, `${r.slug}: an error line`);

  const b = body(r, md);
  assert.ok(b.length < 60000, `${r.slug}: body under GitHub's 65,536 characters`);
  const text = recordText(md);
  const fence = fenceFor(text);
  const open = b.indexOf(`${fence}text\n`);
  const close = b.lastIndexOf(`\n${fence}\n`);
  assert.ok(open > 0 && close > open, `${r.slug}: one fenced block`);
  assert.equal(b.slice(open + fence.length + 5, close), text, `${r.slug}: the record text is inside the fence, unchanged`);
  for (const line of text.split("\n")) {
    assert.ok(!/^\s*`{4,}\s*$/.test(line) || line.trim().length < fence.length, `${r.slug}: no line of the record can close the fence`);
  }
  assert.ok(b.endsWith(`\n${marker(r.id)}\n`), `${r.slug}: the body ends with the record's marker`);
  const outside = (b.slice(0, open) + b.slice(close + fence.length + 2)).replace(marker(r.id), "");
  assert.ok(!outside.includes("@"), `${r.slug}: no @ outside the fence (a mention would notify a person)`);
  assert.ok(!/#\d/.test(outside), `${r.slug}: no #number outside the fence (it would link an issue)`);
  assert.ok(!/<[A-Za-z!/]/.test(outside.replace(/<the error line>/g, "")), `${r.slug}: no HTML outside the fence`);
  for (const url of outside.match(/https?:\/\/[^\s)`]+/g) || []) {
    assert.ok(/^https:\/\/(api\.)?modalhub\.ai\//.test(url), `${r.slug}: only modalhub URLs outside the fence, got ${url}`);
  }
  if (/[@#<]/.test(text)) fenced++;
}

// The fence grows past any run of backticks a record could carry.
assert.equal(fenceFor("plain"), "````");
assert.equal(fenceFor("a ```` b"), "`````");
assert.equal(fenceFor("``````"), "```````");
// A record without "seen as:" is titled with the first line of its symptom, cut to fit.
const long = { symptom: "E".repeat(400) + "\nsecond line", tool: "t", version: "1.0" };
assert.equal(title(long, "# x\ncause: y\n").length, 240);
assert.ok(title(long, "# x\n").includes("… · t 1.0"));
assert.equal(errorLine({ symptom: "Error <path> failed" }, "seen as: Error /app/x.js failed\n"), "Error /app/x.js failed");

console.log(`ok: ${mirror.records.length} records checked; ${fenced} carry @, # or < in their text, all of it inside the fence`);
