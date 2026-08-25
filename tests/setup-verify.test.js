#!/usr/bin/env node
// Tests for plugins/setup/scripts/verify.js against the fixture sets.
//
// Run: node tests/setup-verify.test.js
//
// Every broken fixture is a full valid file carrying exactly one defect, laid
// over the valid set, so a passing check proves the verifier caught that
// defect and not some accident nearby. Each case asserts the exit code AND
// the message, because a fixture that only asserts "it failed" can be
// satisfied by the wrong failure.
//
// The clock is fixed via AA_VERIFY_TODAY so the fixtures' dates never age
// into staleness and quietly change what a check means.

'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SCRIPT = path.join(ROOT, 'plugins', 'setup', 'scripts', 'verify.js');
const VALID = path.join(__dirname, 'fixtures', 'valid');
const BROKEN = path.join(__dirname, 'fixtures', 'broken');
const TODAY = '2026-08-25';

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
  const env = { ...process.env, AA_VERIFY_TODAY: TODAY };
  try {
    const stdout = execFileSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8', env });
    return { code: 0, out: stdout };
  } catch (error) {
    return { code: error.status, out: (error.stdout || '') + (error.stderr || '') };
  }
}

// A fresh directory holding the valid set with a broken case's files laid over.
function assemble(caseName) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'aa-verify-'));
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

// ---------------------------------------------------------------- error cases

const ERROR_CASES = [
  ['duplicate-id', 'people.md: error:', 'duplicate id "p-priya-shah"'],
  ['bad-kind', 'sources.md: error:', 'kind "email" is malformed'],
  ['roster-violation', 'sources.md: error:', '"good-mornng" in required for is not on the skill roster'],
  ['voice-missing-confidence', 'voice.md: error:', 'confidence missing'],
  ['voice-retitled-heading', 'voice.md: error:', '"## Never" missing or retitled'],
  ['bare-handle', 'people.md: error:', 'carries no type'],
  ['bad-date', 'people.md: error:', 'dates are YYYY-MM-DD'],
  ['dangling-person', 'personas.md: error:', 'does not resolve to a people.md id'],
  ['bad-window', 'sources.md: error:', 'look back "seven days" is malformed'],
  ['missing-schema', 'priorities.md: error:', 'schema line missing'],
  ['unknown-schema-version', 'priorities.md: error:', 'schema version 2 unknown'],
  ['stray-id-line', 'people.md: error:', 'copied from IT ticket 483'],
  ['duplicate-field', 'sources.md: error:', 'field "kind" appears more than once'],
  ['header-order', 'priorities.md: error:', 'starts with "schema:" then "last confirmed:"'],
  ['scalar-list', 'people.md: error:', 'must be a bracketed inline list or indented dash items'],
  ['malformed-inline-list', 'sources.md: error:', 'malformed inline list'],
  ['blank-account', 'sources.md: error:', 'required field "account" is blank'],
  ['calendar-no-lookahead', 'sources.md: error:', 'calendar source needs look ahead'],
  ['prefer-orphan-line', 'voice.md: error:', 'not a from:/to: pair'],
  ['duplicate-voice-heading', 'voice.md: error:', '"## Never" appears 2 times'],
  ['blank-pushes-back', 'personas.md: error:', 'required field "pushes back on" is blank'],
  ['scalar-with-dashes', 'sources.md: error:', '"account" takes a single value, not dash items'],
  ['leading-blank', 'priorities.md: error:', 'starts with "schema:" then "last confirmed:"'],
  ['unindented-prefer-to', 'voice.md: error:', 'has no to: line'],
  ['unrecognised-line', 'priorities.md: error:', 'line not recognised as a field or an indented dash item'],
  ['scalar-inline-list', 'sources.md: error:', '"account" takes a single value, not an inline list'],
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
  const { code, out } = run([assemble('unknown-field')]);
  assert.strictEqual(code, 0, `exit ${code}\n${out}`);
  const lines = out.split('\n').filter((l) => l.includes('unknown field "exlude"'));
  assert.strictEqual(lines.length, 1, `expected exactly one report, got ${lines.length}:\n${out}`);
  assert.ok(lines[0].startsWith('priorities.md: warning:'), lines[0]);
});

check('an unknown key in header and entry warns exactly once, file-wide', () => {
  const { code, out } = run([assemble('unknown-field-header')]);
  assert.strictEqual(code, 0, `exit ${code}\n${out}`);
  const lines = out.split('\n').filter((l) => l.includes('unknown field "exported_by"'));
  assert.strictEqual(lines.length, 1, `expected exactly one report, got ${lines.length}:\n${out}`);
  assert.ok(lines[0].startsWith('priorities.md: warning:'), lines[0]);
});

check('schema inside an entry is reported as an unknown field there', () => {
  const { code, out } = run([assemble('schema-in-entry')]);
  assert.strictEqual(code, 0, `exit ${code}\n${out}`);
  assert.ok(out.includes('people.md: warning: unknown field "schema"'), out);
});

check('an empty file with a malformed header is malformed, not semantically empty', () => {
  const { code, out } = run([assemble('empty-malformed')]);
  assert.strictEqual(code, 1, `exit ${code}\n${out}`);
  assert.ok(out.includes('people.md: error:'), out);
  const empty = out.split('\n').find((l) => l.startsWith('people.md:') && l.includes('semantically empty'));
  assert.ok(!empty, `malformed empty file still called semantically empty:\n${out}`);
});

check('a well-formed empty file is semantically empty, valid, and says so', () => {
  const { code, out } = run([assemble('empty-valid')]);
  assert.strictEqual(code, 0, `exit ${code}\n${out}`);
  const line = out.split('\n').find((l) => l.startsWith('personas.md: warning:') && l.includes('semantically empty'));
  assert.ok(line, `no semantically-empty warning in:\n${out}`);
});

check('a sentence merely mentioning the hand-edit instruction does not satisfy it', () => {
  const { code, out } = run([assemble('voice-buried-instruction')]);
  assert.strictEqual(code, 0, `exit ${code}\n${out}`);
  const line = out.split('\n').find((l) => l.startsWith('voice.md: warning:')
    && l.includes('hand-edit instruction'));
  assert.ok(line, `no hand-edit instruction warning in:\n${out}`);
});

check('a voice file missing the hand-edit instruction warns and does not fail the set', () => {
  const { code, out } = run([assemble('voice-no-instruction')]);
  assert.strictEqual(code, 0, `exit ${code}\n${out}`);
  const line = out.split('\n').find((l) => l.startsWith('voice.md: warning:')
    && l.includes('hand-edit instruction'));
  assert.ok(line, `no hand-edit instruction warning in:\n${out}`);
});

check('a stale entry warns naming the entry and does not fail the set', () => {
  const { code, out } = run([assemble('stale-entry')]);
  assert.strictEqual(code, 0, `exit ${code}\n${out}`);
  const line = out.split('\n').find((l) => l.startsWith('people.md: warning:')
    && l.includes('p-priya-shah') && l.includes('stale'));
  assert.ok(line, `no stale warning naming p-priya-shah in:\n${out}`);
});

// -------------------------------------------------------------- missing files

check('a missing file is an error naming the file', () => {
  const dir = assemble(null);
  fs.unlinkSync(path.join(dir, 'sources.md'));
  const { code, out } = run([dir]);
  assert.strictEqual(code, 1, `exit ${code}\n${out}`);
  assert.ok(out.includes('sources.md: error: missing'), out);
});

// ------------------------------------------------------------------- the CLI

check('an unknown option is refused before the directory is even looked at', () => {
  const { code, out } = run(['--fix', path.join(os.tmpdir(), 'aa-verify-never-made')]);
  assert.strictEqual(code, 2, `exit ${code}\n${out}`);
  assert.ok(out.includes('unknown option'), out);
  assert.ok(!out.includes('is not a directory'), `directory was checked before the option was refused:\n${out}`);
});

check('no argument is refused with usage', () => {
  const { code, out } = run([]);
  assert.strictEqual(code, 2, `exit ${code}\n${out}`);
  assert.ok(out.includes('Usage'), out);
});

check('a directory that does not exist is refused', () => {
  const { code } = run([path.join(os.tmpdir(), 'aa-verify-never-made')]);
  assert.strictEqual(code, 2);
});

// ------------------------------------------------------------------- cleanup

for (const dir of made) {
  fs.rmSync(dir, { recursive: true, force: true });
}

console.log(failed === 0
  ? `setup-verify: all ${total} checks passed`
  : `setup-verify: ${failed} of ${total} checks FAILED`);
process.exit(failed === 0 ? 0 : 1);
