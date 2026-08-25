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

check('the valid set verifies with zero errors', () => {
  const { code, out } = run([assemble(null)]);
  assert.strictEqual(code, 0, `exit ${code}\n${out}`);
  assert.match(out, /^0 errors/m, out);
});

check('note: fields are never reported as unknown', () => {
  const { out } = run([assemble(null)]);
  assert.ok(!out.includes('unknown field "note"'), out);
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

check('an unknown field warns, is attributed, and does not fail the set', () => {
  const { code, out } = run([assemble('unknown-field')]);
  assert.strictEqual(code, 0, `exit ${code}\n${out}`);
  assert.ok(out.includes('priorities.md: warning: unknown field "exlude"'), out);
});

check('a stale entry warns and does not fail the set', () => {
  const { code, out } = run([assemble('stale-entry')]);
  assert.strictEqual(code, 0, `exit ${code}\n${out}`);
  assert.ok(out.includes('people.md: warning:') && out.includes('stale'), out);
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

check('an unknown option is refused before any input is read', () => {
  const { code, out } = run(['--fix', assemble(null)]);
  assert.strictEqual(code, 2, `exit ${code}\n${out}`);
  assert.ok(out.includes('unknown option'), out);
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
