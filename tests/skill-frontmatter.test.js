#!/usr/bin/env node
// Identity checks for every shipped skill: the frontmatter properties an
// installer depends on, and the version stamp the field depends on.
// Nothing in a session would catch either when they break.
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

  check(`${plugin}:${skill} version stamp matches its plugin.json`, () => {
    const lines = fs.readFileSync(file, 'utf8').trimEnd().split('\n');
    const stamp = lines[lines.length - 1].match(/^Version: ([a-z-]+) (\d+\.\d+\.\d+), (\d{4}-\d{2}-\d{2})\.$/);
    assert.ok(stamp, `last line is not a version stamp: ${JSON.stringify(lines[lines.length - 1])}`);
    assert.strictEqual(stamp[1], plugin, `stamp names "${stamp[1]}", lives in "${plugin}"`);
    const own = JSON.parse(fs.readFileSync(
      path.join(PLUGINS, plugin, '.claude-plugin', 'plugin.json'), 'utf8',
    ));
    assert.strictEqual(stamp[2], own.version,
      `stamp says ${stamp[2]}, plugin.json says ${own.version}`);
  });
}

console.log(failed === 0
  ? `skill-frontmatter: all ${total} checks passed`
  : `skill-frontmatter: ${failed} of ${total} checks FAILED`);
process.exit(failed === 0 ? 0 : 1);
