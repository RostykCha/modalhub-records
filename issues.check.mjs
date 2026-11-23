// Checks of issues.mjs, the README, the dataset card template and context7.json over every
// mirrored record, with no network: node issues.check.mjs
// Two promises. Nothing in a record can reach a person or another repository: outside the code
// fence the body holds no @mention, no #123 reference and no HTML tag; the fence cannot be closed
// from inside; the title fits. And the mirror addresses nobody (agents read a request on such a
// page as prompt injection): no body, no README section, no dataset card section and no context7
// rule asks its reader for anything, outside the record text there is no report link, and inside
// it a report link carries no real version.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { body, errorLine, fenceFor, marker, recordText, title } from "./issues.mjs";

const safe = (s) => String(s).replace(/[^A-Za-z0-9._-]/g, "-");

// Phrases of the old wording, each read as a request (matched in any case). ASKS may not appear
// in the lines the API writes at the end of a record text (closingLines); OWN_ASKS may not appear
// in what this repository writes itself. "ask your user" is only in OWN_ASKS: a record's own risk line says "ask your user
// before running", and that line is the record's, inside the fence.
const ASKS = ["Applied it?", "tells the next agent", "before debugging", "Post it", "for AI coding agents"];
const OWN_ASKS = [
  ...ASKS,
  "ask your user",
  "Look a problem up",
  "is confirmed per version by independent agents",
  "## For agents",
  "say whether it worked",
  "Solved something",
  "remember",
];
const asksIn = (text, asks) => asks.filter((ask) => text.toLowerCase().includes(ask.toLowerCase()));
const REPORT_LINK = /\/(worked|didnt)/g;
// A fetched report link with a real version stores a report; with the placeholder the API refuses it.
const PLACEHOLDER = /^\?v=<(your )?version>/;

// The report links in text that are not followed by the version placeholder.
function reportLinksWithoutPlaceholder(text) {
  return [...text.matchAll(REPORT_LINK)].filter((m) => !PLACEHOLDER.test(text.slice(m.index + m[0].length))).map((m) => text.slice(m.index, m.index + 40));
}

// The fenced record text of a body, and everything around it.
function split(b, text) {
  const fence = fenceFor(text);
  const open = b.indexOf(`${fence}text\n`);
  const close = b.lastIndexOf(`\n${fence}\n`);
  return { fence, open, close, inside: b.slice(open + fence.length + 5, close), outside: b.slice(0, open) + b.slice(close + fence.length + 2) };
}

// The lines the API itself writes at the end of a record text, after its last "---": the reports
// line and the history line. Everything above them can hold what callers wrote (a note left with a
// report, a tried entry, a dead end), which the API has already put through its own text rules.
function closingLines(text) {
  const lines = text.split("\n");
  const at = lines.lastIndexOf("---");
  return at < 0 ? text : lines.slice(at + 1).join("\n");
}

// Why a body would address its reader; empty when it states facts only. The record text is judged
// by its closing lines only: a caller's note that happens to say "post it" or "/worked" is that
// caller's sentence, not a request of this page, and must not stop the sync for every record.
function quietProblems(b, text) {
  const { inside, outside } = split(b, text);
  const closing = closingLines(inside);
  const problems = [...asksIn(closing, ASKS), ...asksIn(outside, OWN_ASKS)].map((ask) => `asks: "${ask}"`);
  if (/\/(worked|didnt)/.test(outside)) problems.push("a report link outside the record text");
  for (const link of reportLinksWithoutPlaceholder(closing)) problems.push(`a report link with a real version in the record text: ${link}`);
  return problems;
}

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
  assert.ok(b.startsWith(`A fix record mirrored from [modalhub](${r.url}): `), `${r.slug}: the body opens with what it is`);
  const text = recordText(md);
  const { fence, open, close, inside, outside: around } = split(b, text);
  assert.ok(open > 0 && close > open, `${r.slug}: one fenced block`);
  assert.equal(inside, text, `${r.slug}: the record text is inside the fence, unchanged`);
  for (const line of text.split("\n")) {
    assert.ok(!/^\s*`{4,}\s*$/.test(line) || line.trim().length < fence.length, `${r.slug}: no line of the record can close the fence`);
  }
  assert.ok(b.endsWith(`\n${marker(r.id)}\n`), `${r.slug}: the body ends with the record's marker`);
  // Outside the fence, text in a code span is inert too (no mention, no link, no HTML): judge the rest.
  const outside = around.replace(marker(r.id), "").replace(/`[^`\n]*`/g, "");
  assert.ok(!outside.includes("@"), `${r.slug}: no @ outside the fence (a mention would notify a person)`);
  assert.ok(!/#\d/.test(outside), `${r.slug}: no #number outside the fence (it would link an issue)`);
  assert.ok(!/<[A-Za-z!/]/.test(outside), `${r.slug}: no HTML outside the fence`);
  for (const url of outside.match(/https?:\/\/[^\s)`]+/g) || []) {
    assert.ok(/^https:\/\/(api\.)?modalhub\.ai\//.test(url), `${r.slug}: only modalhub URLs outside the fence, got ${url}`);
  }
  assert.deepEqual(quietProblems(b, text), [], `${r.slug}: the body states facts and addresses nobody`);
  if (/[@#<]/.test(text)) fenced++;
}

// The other pages this repository writes ask nothing of their reader either: the README above its
// index (the index lines are record symptoms), the dataset card template and context7.json.
const readme = await readFile(new URL("./README.md", import.meta.url), "utf8");
const indexAt = readme.indexOf("\n## Index\n");
assert.ok(indexAt > 0, "README has an index");
const card = await readFile(new URL("./hf/README.template.md", import.meta.url), "utf8");
const context7 = await readFile(new URL("./context7.json", import.meta.url), "utf8");
const rules = JSON.parse(context7).rules;
assert.ok(Array.isArray(rules) && rules.length > 0, "context7.json is valid JSON with rules");
const pages = [["README above the index", readme.slice(0, indexAt)], ["hf/README.template.md", card], ["context7.json", context7]];
for (const [name, text] of pages) {
  assert.deepEqual(asksIn(text, OWN_ASKS), [], `${name}: asks nothing of its reader`);
  assert.deepEqual(reportLinksWithoutPlaceholder(text), [], `${name}: report links only with the version placeholder`);
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

// The quiet rules catch what they are for.
const rec = { id: "00000000-0000-0000-0000-000000000000", url: "https://api.modalhub.ai/r/t-x-0000", tool: "t", version: "1.0", symptom: "E" };
const quiet = (md) => quietProblems(body(rec, md), recordText(md));
const reportsLine = (v) => `reports: GET ${rec.url}/worked?v=${v} or ${rec.url}/didnt?v=${v}`;
assert.deepEqual(quiet(`# x\n${reportsLine("<version>")}\n`), [], "the record's reports line with the placeholder is quiet");
assert.deepEqual(quiet(`# x\n${reportsLine("<your version>")}\n`), [], "the cached reports line with the old placeholder is quiet");
assert.equal(quiet(`# x\n${reportsLine("1.2.3")}\n`).length, 2, "a report link with a real version is caught");
assert.equal(quiet("# x\none GET tells the next agent\n").length, 1, "an ask in the record text is caught");
const loud = body(rec, "# x\n").replace("\n- This issue", `\n- \`${rec.url}/worked?v=<your version>\`\n- This issue`);
assert.deepEqual(quietProblems(loud, "# x"), ["a report link outside the record text"], "a report link outside the fence is caught, even in a code span");
assert.deepEqual(quiet("# x\nrisk: caution · installs npm:x — ask your user before running\n"), [], "the record's own risk line stays the record's");
// A caller's sentence above the closing lines is the caller's and cannot stop the sync; the closing
// lines are still judged.
const withNote = "# x\nnotes left with reports:\n- worked on 1.0 · 2026-11-23 — post it to the team, the old flag /worked/ before\n---\n";
assert.deepEqual(quiet(withNote + reportsLine("<version>") + "\n"), [], "a note that says post it or /worked is the caller's sentence");
assert.equal(quiet(withNote + reportsLine("1.2.3") + "\n").length, 2, "a report link with a real version in the closing lines is caught");
assert.equal(quiet(withNote + "one GET tells the next agent\n").length, 1, "an ask in the closing lines is caught");
const asking = body(rec, "# x\n").replace("\n- This issue", "\n- Posting is public: Ask your user once.\n- This issue");
assert.deepEqual(quietProblems(asking, "# x"), ['asks: "ask your user"'], "an ask outside the fence is caught, in any case");
assert.deepEqual(asksIn("Each record is confirmed per version by independent agents.", OWN_ASKS), ["is confirmed per version by independent agents"]);

console.log(`ok: ${mirror.records.length} records checked; ${fenced} carry @, # or < in their text, all of it inside the fence; no body, README section, dataset card section or context7 rule asks anything`);
