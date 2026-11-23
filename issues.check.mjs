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
import { body, errorLine, fenceFor, issueText, marker, recordText, title } from "./issues.mjs";

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

// The one line of an issue's fenced text this repository writes itself: the last, which says where
// the fix is. The lines above it are the record's (its title, the error, its cause), written by
// whoever posted the record and already put through the API's own text rules.
function closingLines(text) {
  const lines = text.split("\n");
  return lines[lines.length - 1];
}

// Why a body would address its reader; empty when it states facts only. The fenced text is judged
// by its closing line only: a record's cause that happens to say "post it" is that record's
// sentence, not a request of this page, and must not stop the sync for every record.
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
  assert.ok(b.startsWith(`A fix record on [modalhub](${r.url}). This issue carries the error and its cause; `), `${r.slug}: the body opens with what it is`);
  const text = issueText(r, md);
  assert.ok(text.endsWith(`: ${r.url}.md`), `${r.slug}: the last line says where the fix is`);
  assert.ok(!text.includes("\nfix (") && !/^(check|sources|don't|status):/m.test(text), `${r.slug}: the fix, its check, its sources, the dead ends and the status stay on the record`);
  assert.ok(!/\/(worked|didnt)\?v=/.test(b), `${r.slug}: an issue carries no report link`);
  assert.ok(recordText(md).includes("\nfix ("), `${r.slug}: the mirrored file still holds the whole record`);
  const { fence, open, close, inside, outside: around } = split(b, text);
  assert.ok(open > 0 && close > open, `${r.slug}: one fenced block`);
  assert.equal(inside, text, `${r.slug}: the issue text is inside the fence, unchanged`);
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

// The issue text: the record's head lines and the line that says where the rest is; never a promise
// the record does not keep.
const rec = { id: "00000000-0000-0000-0000-000000000000", url: "https://api.modalhub.ai/r/t-x-0000", tool: "t", version: "1.0", symptom: "E" };
const reportsLine = (v) => `reports are optional and public — GET ${rec.url}/worked?v=${v} or ${rec.url}/didnt?v=${v}`;
const whole = `# "E" — t 1.0\nseen as: E at x\ncause: c\nstatus: no reports yet · published on t 1.0\n12 readers in the last 7 days\narms: works 1.0\nrisk: low\nfix (command):\n~~~\nrun it\n~~~\nrepro: none\ncheck: ok\nsources:\n- https://example.com/a\ndon't:\n- a — b (×1)\nnotes left with reports:\n- worked on 1.0 · 2026-11-23 — post it to the team\n---\n${reportsLine("1.2.3")}\n`;
assert.equal(issueText(rec, whole), `# "E" — t 1.0\nseen as: E at x\ncause: c\nfix, check, sources and what does not work: ${rec.url}.md`, "the head lines and where the rest is");
const bare = `# "E" — t 1.0\ncause: c\nfix (command):\n~~~\nrun it\n~~~\ncheck: ok\n`;
assert.equal(issueText(rec, bare), `# "E" — t 1.0\ncause: c\nfix and check: ${rec.url}.md`, "a record without sources or dead ends promises neither");
assert.ok(body(rec, bare).includes("; the fix and the command that proves it are on the record: "), "and neither does the opening line");
const b0 = body(rec, whole);
assert.ok(b0.includes("; the fix, the command that proves it, its sources and what looks like a fix and is not are on the record: "), "the opening line names what the record holds");
for (const kept of ["run it", "example.com", "/worked", "/didnt", "post it to the team", "readers in the last", "status:"]) {
  assert.ok(!b0.includes(kept), `the issue does not carry: ${kept}`);
}
// The quiet rules catch what they are for.
const quiet = (md) => quietProblems(body(rec, md), issueText(rec, md));
assert.deepEqual(quiet(whole), [], "the issue of a whole record is quiet");
assert.deepEqual(quiet(whole.replace("cause: c", "cause: the hook must post it before debugging starts")), [], "a record's own sentence is the record's and cannot stop the sync");
const loud = b0.replace("\n- This issue", `\n- \`${rec.url}/worked?v=<your version>\`\n- This issue`);
assert.deepEqual(quietProblems(loud, issueText(rec, whole)), ["a report link outside the record text"], "a report link outside the fence is caught, even in a code span");
const asking = b0.replace("\n- This issue", "\n- Posting is public: Ask your user once.\n- This issue");
assert.deepEqual(quietProblems(asking, issueText(rec, whole)), ['asks: "ask your user"'], "an ask outside the fence is caught, in any case");
assert.deepEqual(asksIn("Each record is confirmed per version by independent agents.", OWN_ASKS), ["is confirmed per version by independent agents"]);

console.log(`ok: ${mirror.records.length} records checked; ${fenced} carry @, # or < in their text, all of it inside the fence; no body, README section, dataset card section or context7 rule asks anything`);
