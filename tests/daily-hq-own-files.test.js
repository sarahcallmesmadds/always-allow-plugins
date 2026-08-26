#!/usr/bin/env node
// Tests for plugins/daily-hq/scripts/verify-own.js against the fixture
// sets. Every broken fixture is a full valid file carrying exactly one
// defect, laid over the valid set, and each case asserts the exit code
// AND the message, because "it failed" can be satisfied by the wrong
// failure.
//
// Run: node tests/daily-hq-own-files.test.js

'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SCRIPT = path.join(ROOT, 'plugins', 'daily-hq', 'scripts', 'verify-own.js');
const VALID = path.join(__dirname, 'fixtures', 'daily-hq', 'valid');
const BROKEN = path.join(__dirname, 'fixtures', 'daily-hq', 'broken');

let total = 0;
let failed = 0;
const made = [];

function check(what, fn) {
  total += 1;
  try {
    fn();
    console.log(`  ok    ${what}`);
  } catch (error) {
    failed += 1;
    console.log(`  FAIL  ${what}\n        ${error.message}`);
  }
}

function run(args) {
  try {
    const stdout = execFileSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8' });
    return { code: 0, out: stdout };
  } catch (error) {
    return { code: error.status, out: (error.stdout || '') + (error.stderr || '') };
  }
}

function assemble(caseName) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'aa-own-'));
  made.push(dir);
  for (const f of fs.readdirSync(VALID)) {
    fs.copyFileSync(path.join(VALID, f), path.join(dir, f));
  }
  if (caseName) {
    const caseDir = path.join(BROKEN, caseName);
    for (const f of fs.readdirSync(caseDir)) {
      fs.copyFileSync(path.join(caseDir, f), path.join(dir, f));
    }
  }
  return dir;
}

// ---------------------------------------------------------------- the valid set

check('the valid set verifies with zero errors and zero warnings', () => {
  const { code, out } = run([assemble(null)]);
  assert.strictEqual(code, 0, `exit ${code}\n${out}`);
  assert.match(out, /^0 errors, 0 warnings/m, out);
});

check('an empty folder is three absences, not an error', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'aa-own-empty-'));
  made.push(dir);
  const { code, out } = run([dir]);
  assert.strictEqual(code, 0, `exit ${code}\n${out}`);
  for (const name of ['day-snapshot.md', 'brief-feedback.md', 'going-away-pool.md']) {
    assert.ok(out.includes(`${name}: absent`), `no absence line for ${name} in:\n${out}`);
  }
});

// ---------------------------------------------------------------- error cases

const ERROR_CASES = [
  ['snapshot-missing-marker', 'day-snapshot.md: error:', 'complete-write marker missing'],
  ['snapshot-marker-mismatch', 'day-snapshot.md: error:', 'complete-write marker names "r-20260825-0800", run is "r-20260825-0730"'],
  ['snapshot-count-drift', 'day-snapshot.md: error:', 'items says 4, the file holds 3 entries'],
  ['snapshot-bare-id', 'day-snapshot.md: error:', 'id "evt-4471" is not [source id]/[item id]'],
  ['snapshot-source-mismatch', 'day-snapshot.md: error:', 'source "s-personal-calendar" does not match the id prefix "s-work-calendar"'],
  ['snapshot-missing-timezone', 'day-snapshot.md: error:', 'required header field "timezone" missing'],
  ['snapshot-bad-time', 'day-snapshot.md: error:', 'start "2026-08-25 14:00" on "s-work-calendar/evt-4471" is malformed; a real YYYY-MM-DD or YYYY-MM-DDTHH:MM'],
  ['snapshot-impossible-time', 'day-snapshot.md: error:', 'start "2026-02-30T14:00" on "s-work-calendar/evt-4471" is malformed; a real YYYY-MM-DD or YYYY-MM-DDTHH:MM'],
  ['snapshot-bad-timezone', 'day-snapshot.md: error:', 'timezone "Eastern" is not a recognised IANA name'],
  ['snapshot-dangling-participant', 'day-snapshot.md: error:', 'participants entry "p-marcus-webbb" on "s-work-calendar/evt-4471" does not resolve to a people.md id'],
  ['snapshot-unknown-source', 'day-snapshot.md: error:', 'source "s-ghost-calendar" on "s-ghost-calendar/evt-4520" is not in sources.md'],
  ['snapshot-duplicate-header', 'day-snapshot.md: error:', 'field "schema" appears more than once in the header'],
  ['snapshot-bad-run', 'day-snapshot.md: error:', 'run "r-7" is not r-YYYYMMDD-HHMM with a real date and time'],
  ['snapshot-impossible-run', 'day-snapshot.md: error:', 'run "r-20260230-2960" is not r-YYYYMMDD-HHMM with a real date and time'],
  ['pool-list-owner', 'going-away-pool.md: error:', '"owner" on "s-work-mail/msg-18823" takes a single value, not a list'],
  ['snapshot-noncalendar-source', 'day-snapshot.md: error:', 'source "s-work-mail" on "s-work-mail/evt-4520" is not a calendar source; the snapshot holds calendar events'],
  ['pool-window-inverted', 'going-away-pool.md: error:', 'window start 2026-09-05 is after window end 2026-09-04'],
  ['snapshot-end-before-start', 'day-snapshot.md: error:', 'end "2026-08-25T13:00" on "s-work-calendar/evt-4471" is before its start'],
  ['snapshot-mixed-inverted', 'day-snapshot.md: error:', 'start "2026-08-25T09:30" and end "2026-08-24" on "s-work-calendar/evt-4533" mix all-day and timed forms'],
  ['snapshot-mixed-precision', 'day-snapshot.md: error:', 'start "2026-08-25T09:30" and end "2026-08-25" on "s-work-calendar/evt-4533" mix all-day and timed forms'],
  ['snapshot-unprefixed-source', 'day-snapshot.md: error:', 'id "work-calendar/evt-4471" does not begin with an s- source id'],
  ['snapshot-missing-run', 'day-snapshot.md: error:', 'required header field "run" missing'],
  ['pool-missing-window', 'going-away-pool.md: error:', 'required header field "window start" missing'],
  ['pool-dangling-owner', 'going-away-pool.md: error:', 'owner "p-nobody" on "s-work-mail/msg-18823" does not resolve to a people.md id'],
  ['snapshot-duplicate-id', 'day-snapshot.md: error:', 'duplicate id "s-work-calendar/evt-4471"'],
  ['snapshot-missing-schema', 'day-snapshot.md: error:', 'schema line missing'],
  ['snapshot-unknown-schema', 'day-snapshot.md: error:', 'schema version 2 unknown'],
  ['snapshot-bad-participant', 'day-snapshot.md: error:', 'participants entry "priya" on "s-work-calendar/evt-4471" is not a p- id'],
  ['snapshot-scalar-participants', 'day-snapshot.md: error:', 'participants on "s-work-calendar/evt-4471" must be a bracketed inline list or indented dash items'],
  ['feedback-bad-scope', 'brief-feedback.md: error:', 'scope "thread" on "s-team-chat/th-99120" is malformed; item or series'],
  ['feedback-bad-counter', 'brief-feedback.md: error:', 'unmatched runs "-1" on "s-team-chat/th-99120" is not a whole number of zero or more'],
  ['feedback-bad-reported', 'brief-feedback.md: error:', 'reported "yes" on "s-team-chat/th-99120" is malformed; true or false'],
  ['feedback-missing-added', 'brief-feedback.md: error:', 'required field "added" missing on "s-team-chat/th-99120"'],
  ['pool-bad-owner', 'going-away-pool.md: error:', 'owner "priya" on "s-work-mail/msg-18823" is neither a p- id nor "unresolved"'],
  ['pool-blank-title', 'going-away-pool.md: error:', 'required field "title" is blank on "s-work-mail/msg-18823"'],
  ['pool-content-after-marker', 'going-away-pool.md: error:', 'content after the complete-write marker'],
];

for (const [caseName, filePrefix, message] of ERROR_CASES) {
  check(`${caseName} fails with the right message on the right file`, () => {
    const { code, out } = run([assemble(caseName)]);
    assert.strictEqual(code, 1, `exit ${code}\n${out}`);
    const line = out.split('\n').find((l) => l.startsWith(filePrefix) && l.includes(message));
    assert.ok(line, `no "${filePrefix} ... ${message}" line in:\n${out}`);
  });
}

// -------------------------------------------------------------- warning cases

check('an unknown field in two entries warns exactly once and does not fail the set', () => {
  const { code, out } = run([assemble('snapshot-unknown-field')]);
  assert.strictEqual(code, 0, `exit ${code}\n${out}`);
  const lines = out.split('\n').filter((l) => l.includes('unknown field "wether"'));
  assert.strictEqual(lines.length, 1, `expected exactly one report, got ${lines.length}:\n${out}`);
  assert.ok(lines[0].startsWith('day-snapshot.md: warning:'), lines[0]);
});

check('without people.md and sources.md the id checks fall back to form only, said', () => {
  const dir = assemble(null);
  fs.unlinkSync(path.join(dir, 'people.md'));
  fs.unlinkSync(path.join(dir, 'sources.md'));
  const file = path.join(dir, 'going-away-pool.md');
  fs.writeFileSync(file, fs.readFileSync(file, 'utf8')
    .replace('owner: p-priya-shah', 'owner: p-nobody'));
  const { code, out } = run([dir]);
  assert.strictEqual(code, 0, `exit ${code}\n${out}`);
  assert.ok(out.includes('people.md: absent; participant and owner ids checked for form only'), out);
  assert.ok(out.includes('sources.md: absent; entry source ids checked for form only'), out);
});

check('an unknown list-valued field warns as unknown and never malforms the file', () => {
  const { code, out } = run([assemble('snapshot-unknown-list-field')]);
  assert.strictEqual(code, 0, `exit ${code}\n${out}`);
  const lines = out.split('\n').filter((l) => l.includes('unknown field "tags"'));
  assert.strictEqual(lines.length, 1, `expected exactly one report, got ${lines.length}:\n${out}`);
  assert.ok(!out.includes('takes a single value'), `an unknown list was malformed:\n${out}`);
});

check('an unknown dashed-list header field warns as unknown and never malforms the file', () => {
  const { code, out } = run([assemble('snapshot-unknown-header-list')]);
  assert.strictEqual(code, 0, `exit ${code}\n${out}`);
  const lines = out.split('\n').filter((l) => l.includes('unknown field "labels"'));
  assert.strictEqual(lines.length, 1, `expected exactly one report, got ${lines.length}:\n${out}`);
  assert.ok(!out.includes('dash item outside a list'), `a header dash list was rejected:\n${out}`);
});

check('a note: field is never reported as unknown', () => {
  const dir = assemble(null);
  const file = path.join(dir, 'going-away-pool.md');
  fs.writeFileSync(file, fs.readFileSync(file, 'utf8')
    .replace('last-checked: 2026-08-25', 'last-checked: 2026-08-25\nnote: kept for the Thursday call'));
  const { code, out } = run([dir]);
  assert.strictEqual(code, 0, `exit ${code}\n${out}`);
  assert.ok(!out.includes('unknown field "note"'), out);
});

// ------------------------------------------------------------------- the CLI

check('an unknown option is refused', () => {
  const { code, out } = run(['--fix', path.join(os.tmpdir(), 'aa-own-never-made')]);
  assert.strictEqual(code, 2, `exit ${code}\n${out}`);
  assert.ok(out.includes('unknown option'), out);
});

check('no argument is refused with usage', () => {
  const { code, out } = run([]);
  assert.strictEqual(code, 2, `exit ${code}\n${out}`);
  assert.ok(out.includes('Usage'), out);
});

check('a directory that does not exist is refused', () => {
  const { code } = run([path.join(os.tmpdir(), 'aa-own-never-made')]);
  assert.strictEqual(code, 2);
});

// ------------------------------------------------------------------- cleanup

for (const dir of made) {
  fs.rmSync(dir, { recursive: true, force: true });
}

console.log(failed === 0
  ? `daily-hq-own-files: all ${total} checks passed`
  : `daily-hq-own-files: ${failed} of ${total} checks FAILED`);
process.exit(failed === 0 ? 0 : 1);
