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

// The plans set these budgets (setup plan revision 9; writing plan revision
// 1, where the two shipped reference skills "should not grow" past their
// measured 156 and 136; growth plan revision 2, under 200 each).
const BUDGETS = [
  ['setup', 'install', 250],
  ['setup', 'check', 150],
  ['writing', 'sound-like-me', 150],
  ['writing', 'review-as', 150],
  ['writing', 'slop-check', 157],
  ['writing', 'say-it-simply', 137],
  ['growth', 'time-spent', 200],
  ['growth', 'prioritize', 200],
  ['growth', 'wins', 200],
  ['growth', 'give-me-feedback', 200],
  ['learning', 'teach-me', 200],
  ['learning', 'best-in-class', 200],
  ['learning', 'a-better-way', 200],
];

for (const [plugin, skill, budget] of BUDGETS) {
  check(`${plugin}:${skill} SKILL.md stays under its ${budget}-line budget`, () => {
    const file = path.join(ROOT, 'plugins', plugin, 'skills', skill, 'SKILL.md');
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

check('every marketplace entry matches its plugin.json on version and description', () => {
  const market = JSON.parse(fs.readFileSync(path.join(ROOT, '.claude-plugin', 'marketplace.json'), 'utf8'));
  for (const entry of market.plugins) {
    const own = JSON.parse(fs.readFileSync(
      path.join(ROOT, 'plugins', entry.name, '.claude-plugin', 'plugin.json'), 'utf8',
    ));
    assert.strictEqual(own.version, entry.version,
      `${entry.name}: plugin.json ${own.version} vs marketplace ${entry.version}`);
    assert.strictEqual(own.description, entry.description,
      `${entry.name}: descriptions differ between plugin.json and marketplace.json`);
  }
});

check('the three learning skills carry the identical nudge-lines block', () => {
  const blocks = ['teach-me', 'best-in-class', 'a-better-way'].map((skill) => {
    const file = fs.readFileSync(
      path.join(ROOT, 'plugins', 'learning', 'skills', skill, 'SKILL.md'), 'utf8',
    );
    const section = file.split('## The nudge lines')[1];
    assert.ok(section, `${skill}: no "## The nudge lines" section`);
    const block = (section.match(/```\n([\s\S]*?)```/) || [])[1];
    assert.ok(block, `${skill}: no nudge-lines block found`);
    return block;
  });
  assert.ok(blocks[0] === blocks[1] && blocks[1] === blocks[2],
    'the nudge-lines blocks differ between the three learning skills');
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
