#!/usr/bin/env node
// Consistency checks for the setup plugin: the things that live in two
// places and drift apart silently.
//
// Run: node tests/setup-consistency.test.js

'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SETUP = path.join(ROOT, 'plugins', 'setup');
const CONTRACT = path.join(SETUP, 'skills', 'install', 'references', 'file-schemas.md');
const VERIFY = path.join(SETUP, 'scripts', 'verify.js');

let total = 0;
let failed = 0;

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

// The plan set these budgets (PLAN-always-allow-setup-plugin.md revision 9):
// install under 250 lines, check under 150.
const BUDGETS = [
  ['install', 250],
  ['check', 150],
];

for (const [skill, budget] of BUDGETS) {
  check(`${skill} SKILL.md stays under its ${budget}-line budget`, () => {
    const file = path.join(SETUP, 'skills', skill, 'SKILL.md');
    const lines = fs.readFileSync(file, 'utf8').split('\n').length;
    assert.ok(lines < budget, `${lines} lines, budget ${budget}`);
  });
}

check('the roster in verify.js matches the roster in the contract', () => {
  const contract = fs.readFileSync(CONTRACT, 'utf8');
  const rosterSection = contract.split('## The skill roster')[1].split('\n---')[0];
  // The roster is the backticked ids in that section. `good-mornng` appears
  // there too, as the section's own example of a typo, and is not an id.
  const fromContract = new Set(
    (rosterSection.match(/`([a-z-]+)`/g) || []).map((s) => s.replace(/`/g, '')),
  );
  fromContract.delete('good-mornng');

  const source = fs.readFileSync(VERIFY, 'utf8');
  const arr = source.match(/const ROSTER = \[([\s\S]*?)\];/);
  assert.ok(arr, 'no ROSTER array found in verify.js');
  const fromScript = new Set(
    (arr[1].match(/'([a-z-]+)'/g) || []).map((s) => s.replace(/'/g, '')),
  );

  const missing = [...fromContract].filter((s) => !fromScript.has(s));
  const extra = [...fromScript].filter((s) => !fromContract.has(s));
  assert.ok(missing.length === 0 && extra.length === 0,
    `contract-but-not-script: [${missing}] script-but-not-contract: [${extra}]`);
});

check('check points at the same contract file install carries', () => {
  const skill = fs.readFileSync(path.join(SETUP, 'skills', 'check', 'SKILL.md'), 'utf8');
  assert.ok(skill.includes('../install/references/file-schemas.md'), 'check does not name the contract path');
  assert.ok(fs.existsSync(CONTRACT), 'the contract file is gone');
});

console.log(failed === 0
  ? `setup-consistency: all ${total} checks passed`
  : `setup-consistency: ${failed} of ${total} checks FAILED`);
process.exit(failed === 0 ? 0 : 1);
