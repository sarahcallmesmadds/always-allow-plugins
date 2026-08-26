#!/usr/bin/env node
// Frontmatter checks for every shipped skill: the properties an installer
// depends on and nothing in a session would catch when they break.
//
// The angle-bracket ban exists because the Cowork installer silently drops
// any skill whose frontmatter description contains < or >: the skill
// vanishes from the installed set with no error, while its siblings
// install. Observed 2026-08-26 in two plugins at once (learning lost
// best-in-class over `<role>`, writing lost review-as over `<someone>`),
// confirmed fixed in the field once both descriptions moved to square
// brackets.
//
// Run: node tests/skill-frontmatter.test.js

'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PLUGINS = path.join(ROOT, 'plugins');

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

function skillDirs() {
  const out = [];
  for (const plugin of fs.readdirSync(PLUGINS)) {
    const skills = path.join(PLUGINS, plugin, 'skills');
    if (!fs.existsSync(skills)) continue;
    for (const skill of fs.readdirSync(skills)) {
      if (fs.existsSync(path.join(skills, skill, 'SKILL.md'))) {
        out.push([plugin, skill, path.join(skills, skill, 'SKILL.md')]);
      }
    }
  }
  return out;
}

function frontmatter(file) {
  const text = fs.readFileSync(file, 'utf8');
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  assert.ok(match, 'no frontmatter block');
  const fields = {};
  for (const line of match[1].split('\n')) {
    const field = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (field) fields[field[1]] = field[2];
  }
  return fields;
}

for (const [plugin, skill, file] of skillDirs()) {
  check(`${plugin}:${skill} frontmatter names itself and carries a description`, () => {
    const fields = frontmatter(file);
    assert.strictEqual(fields.name, skill, `name "${fields.name}" vs directory "${skill}"`);
    assert.ok(fields.description && fields.description.length > 0, 'description missing or empty');
  });

  check(`${plugin}:${skill} description is free of angle brackets`, () => {
    const fields = frontmatter(file);
    const hits = (fields.description || '').match(/[<>][^<>]*[<>]?/g);
    assert.ok(!/[<>]/.test(fields.description || ''),
      `installers drop skills over these: ${JSON.stringify(hits)}; use [square brackets] for placeholders`);
  });
}

console.log(failed === 0
  ? `skill-frontmatter: all ${total} checks passed`
  : `skill-frontmatter: ${failed} of ${total} checks FAILED`);
process.exit(failed === 0 ? 0 : 1);
