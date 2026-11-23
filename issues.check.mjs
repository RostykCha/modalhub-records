// Checks of issues.mjs and the README over every mirrored record, with no network:
// node issues.check.mjs
// Two promises. Nothing in a record can reach a person or another repository: outside the code
// fence the body holds no @mention, no #123 reference and no HTML tag; the fence cannot be closed
// from inside; the title fits. And the mirror addresses nobody (agents read a request on such a
// page as prompt injection): no body and no README section asks its reader for anything, outside
// the record text there is no report link, and inside it a report link carries no real version.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { body, errorLine, fenceFor, marker, recordText, title } from "./issues.mjs";

const safe = (s) => String(s).replace(/[^A-Za-z0-9._-]/g, "-");

// Phrases of the old wording; each one was read as a request.
const ASKS = ["Applied it?", "tells the next agent", "before debugging", "Post it", "for AI coding agents"];
const README_ASKS = [...ASKS, "## For agents", "say whether it worked", "Solved something", "remember"];
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

// Why a body would address its reader; empty when it states facts only.
function quietProblems(b, text) {
  const { inside, outside } = split(b, text);
  const problems = ASKS.filter((ask) => b.includes(ask)).map((ask) => `asks: "${ask}"`);
  if (/\/(worked|didnt)/.test(outside)) problems.push("a report link outside the record text");
  for (const link of reportLinksWithoutPlaceholder(inside)) problems.push(`a report link with a real version in the record text: ${link}`);
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

// The README above its index asks nothing of its reader either.
const readme = await readFile(new URL("./README.md", import.meta.url), "utf8");
const indexAt = readme.indexOf("\n## Index\n");
assert.ok(indexAt > 0, "README has an index");
const readmeHead = readme.slice(0, indexAt);
for (const ask of README_ASKS) assert.ok(!readmeHead.includes(ask), `README: no "${ask}" above the index`);
assert.deepEqual(reportLinksWithoutPlaceholder(readmeHead), [], "README: report links only with the version placeholder");

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

console.log(`ok: ${mirror.records.length} records checked; ${fenced} carry @, # or < in their text, all of it inside the fence; no body and no README section asks anything`);
