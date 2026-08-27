#!/usr/bin/env node
// Consistency checks for the daily-hq plugin: the engine, the own-files
// contract, the verifier and the five skills all describe one machine,
// and these are the places they could drift apart silently.
//
// Run: node tests/daily-hq-consistency.test.js

'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PLUGIN = path.join(ROOT, 'plugins', 'daily-hq');
const CONTRACT = path.join(ROOT, 'plugins', 'setup', 'skills', 'install', 'references', 'file-schemas.md');
const ENGINE = path.join(PLUGIN, 'references', 'engine.md');
const OWN = path.join(PLUGIN, 'references', 'own-files.md');
const { FILES, COMMON_HEADER } = require(path.join(PLUGIN, 'scripts', 'verify-own.js'));

const SKILLS = ['good-morning', 'catch-me-up', 'loose-ends', 'inbox', 'going-away'];

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

const skillText = {};
for (const skill of SKILLS) {
  skillText[skill] = fs.readFileSync(path.join(PLUGIN, 'skills', skill, 'SKILL.md'), 'utf8');
}
const engine = fs.readFileSync(ENGINE, 'utf8');
const own = fs.readFileSync(OWN, 'utf8');
const contract = fs.readFileSync(CONTRACT, 'utf8');

check('every skill names the contract path, and the engine skills name the engine', () => {
  for (const skill of SKILLS) {
    assert.ok(skillText[skill].includes('../../../setup/skills/install/references/file-schemas.md'),
      `${skill} does not name the contract path`);
  }
  for (const skill of ['good-morning', 'catch-me-up', 'loose-ends', 'inbox', 'going-away']) {
    assert.ok(skillText[skill].includes('../../references/engine.md'),
      `${skill} does not name the engine reference`);
  }
  assert.ok(fs.existsSync(CONTRACT) && fs.existsSync(ENGINE) && fs.existsSync(OWN),
    'a referenced document is gone');
});

check("the engine and both briefs carry the contract's seven statuses, spelled exactly", () => {
  const section = contract.split('### The status a consumer reports per source')[1]
    .split('### The quiet-day rule')[0];
  const statuses = [...new Set((section.match(/^\| `([a-z-]+)` \|/gm) || [])
    .map((s) => s.replace(/[|` ]/g, '')))];
  assert.strictEqual(statuses.length, 7, `expected 7 statuses in the contract, found ${statuses.length}`);
  for (const status of statuses) {
    assert.ok(engine.includes(`\`${status}\``), `engine.md is missing \`${status}\``);
    for (const skill of ['good-morning', 'catch-me-up']) {
      assert.ok(skillText[skill].includes(`\`${status}\``),
        `${skill}'s fallback is missing \`${status}\``);
    }
  }
});

check('the four resolution states are in the engine and both brief fallbacks', () => {
  for (const state of ['open', 'answered', 'closed-by-you', 'unknown']) {
    assert.ok(engine.includes(`\`${state}\``), `engine.md is missing \`${state}\``);
    for (const skill of ['good-morning', 'catch-me-up']) {
      assert.ok(skillText[skill].includes(`\`${state}\``),
        `${skill} is missing \`${state}\``);
    }
  }
});

check('the precedence order is stated identically in the engine and both fallbacks', () => {
  // Token presence alone does not protect ordering, so pin the exact phrase.
  const phrase = '`closed-by-you`, then\n`answered`, then `open`';
  const oneLine = phrase.replace('\n', ' ');
  for (const [where, text] of [['engine.md', engine],
    ['good-morning', skillText['good-morning']],
    ['catch-me-up', skillText['catch-me-up']]]) {
    assert.ok(text.includes(phrase) || text.includes(oneLine)
      || text.replace(/\n/g, ' ').includes(oneLine),
    `${where} does not state the precedence closed-by-you, then answered, then open`);
  }
});

check('own-files.md and verify-own.js name the same files, headers and required fields', () => {
  for (const [name, rules] of Object.entries(FILES)) {
    const heading = `## \`${name}\``;
    assert.ok(own.includes(heading), `own-files.md has no section for ${name}`);
    // Split on the next backticked file heading, not on the bare ## lines
    // that appear inside the example code blocks.
    const section = own.split(heading)[1].split('\n## `')[0];
    const line = section.split('\n\n').find((b) => b.includes('**Required per entry:**'));
    assert.ok(line, `${name}: no "Required per entry" line in own-files.md`);
    const documented = (line.match(/`([a-z][a-z -]*)`/g) || [])
      .map((s) => s.replace(/`/g, ''))
      .filter((k) => k !== 'id');
    assert.deepStrictEqual(documented.sort(), [...rules.required].sort(),
      `${name}: own-files.md documents [${documented}] but the script requires [${rules.required}]`);
    // Check the header in both directions so neither side can drift alone.
    const headerLine = section.split('\n\n').find((b) => b.includes('**Header:**'));
    assert.ok(headerLine, `${name}: no "Header" line in own-files.md`);
    const documentedHeader = (headerLine.match(/`([a-z][a-z -]*)`/g) || [])
      .map((s) => s.replace(/`/g, ''))
      .filter((k) => k !== 'schema');
    // COMMON_HEADER is the script's own export, so a field dropped from
    // the verifier fails here against the documented list.
    const scriptHeader = [...COMMON_HEADER, ...rules.header];
    assert.deepStrictEqual(documentedHeader.sort(), scriptHeader.sort(),
      `${name}: own-files.md header documents [${documentedHeader}] but the script requires [${scriptHeader}]`);
  }
});

check('the complete-write marker is described identically in doc and script', () => {
  assert.ok(own.includes('`complete: '), 'own-files.md never shows the complete: marker');
  const script = fs.readFileSync(path.join(PLUGIN, 'scripts', 'verify-own.js'), 'utf8');
  assert.ok(script.includes("'^complete: '") || script.includes('/^complete: /'),
    'verify-own.js does not parse a complete: marker');
});

check("every hard-stop file in the contract's table is named by that skill", () => {
  const section = contract.split('## Which skill stops without which file')[1]
    .split('\n---')[0];
  const rows = section.split('\n').filter((l) => /^\| `[a-z-]+\.md` \|/.test(l));
  assert.ok(rows.length >= 6, `expected the consumer table, found ${rows.length} rows`);
  for (const row of rows) {
    const cells = row.split('|').map((c) => c.trim());
    const file = cells[1].replace(/`/g, '');
    const hard = (cells[2].match(/`([a-z-]+)`/g) || []).map((s) => s.replace(/`/g, ''));
    for (const skill of hard) {
      if (!SKILLS.includes(skill)) continue;
      assert.ok(skillText[skill].includes(file),
        `${skill} never names its hard-stop file ${file}`);
    }
  }
});

check('the working files are named consistently across doc, script and skills', () => {
  for (const name of Object.keys(FILES)) {
    assert.ok(own.includes(name), `own-files.md never names ${name}`);
  }
  assert.ok(skillText['good-morning'].includes('day-snapshot.md')
    && skillText['good-morning'].includes('brief-feedback.md'),
  'good-morning does not name its two working files');
  assert.ok(skillText['going-away'].includes('going-away-pool.md'),
    'going-away does not name its pool file');
});

console.log(failed === 0
  ? `daily-hq-consistency: all ${total} checks passed`
  : `daily-hq-consistency: ${failed} of ${total} checks FAILED`);
process.exit(failed === 0 ? 0 : 1);
