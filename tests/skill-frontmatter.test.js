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
// brackets. The ban covers the whole frontmatter block, and descriptions
// must be plain same-line text, because a YAML folded value would hide
// its content from a line-based read.
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
  const block = match[1];
  const fields = {};
  for (const line of block.split('\n')) {
    const field = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (field) fields[field[1]] = field[2];
  }
  return { block, fields };
}

function realDate(stamp) {
  const [y, m, d] = stamp.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d));
  return t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d;
}

const stampsByPlugin = {};

for (const [plugin, skill, file] of skillDirs()) {
  check(`${plugin}:${skill} frontmatter names itself and carries a plain description`, () => {
    const { fields } = frontmatter(file);
    assert.strictEqual(fields.name, skill, `name "${fields.name}" vs directory "${skill}"`);
    assert.ok(fields.description && fields.description.length > 0, 'description missing or empty');
    assert.ok(!/^[>|]/.test(fields.description),
      'description uses a YAML folded or literal value; keep it plain text on one line');
  });

  check(`${plugin}:${skill} frontmatter is free of angle brackets`, () => {
    const { block } = frontmatter(file);
    const hits = block.match(/[<>][^<>\n]*[<>]?/g);
    assert.ok(!/[<>]/.test(block),
      `installers drop skills over these: ${JSON.stringify(hits)}; use [square brackets] for placeholders`);
  });

  check(`${plugin}:${skill} version stamp matches its plugin.json`, () => {
    const lines = fs.readFileSync(file, 'utf8').trimEnd().split('\n');
    const last = lines[lines.length - 1];
    const stamp = last.match(/^Version: ([a-z-]+) (\d+\.\d+\.\d+), (\d{4}-\d{2}-\d{2})\.$/);
    assert.ok(stamp, `last line is not a version stamp: ${JSON.stringify(last)}`);
    assert.strictEqual(stamp[1], plugin, `stamp names "${stamp[1]}", lives in "${plugin}"`);
    assert.ok(realDate(stamp[3]), `${stamp[3]} is not a real calendar date`);
    const own = JSON.parse(fs.readFileSync(
      path.join(PLUGINS, plugin, '.claude-plugin', 'plugin.json'), 'utf8',
    ));
    assert.strictEqual(stamp[2], own.version,
      `stamp says ${stamp[2]}, plugin.json says ${own.version}`);
    (stampsByPlugin[plugin] = stampsByPlugin[plugin] || []).push([skill, last]);
  });
}

for (const [plugin, stamps] of Object.entries(stampsByPlugin)) {
  check(`${plugin}: one identical stamp across all its skills`, () => {
    const distinct = [...new Set(stamps.map(([, line]) => line))];
    assert.ok(distinct.length === 1,
      `mixed stamps: ${stamps.map(([s, l]) => `${s} "${l}"`).join('; ')}`);
  });
}

console.log(failed === 0
  ? `skill-frontmatter: all ${total} checks passed`
  : `skill-frontmatter: ${failed} of ${total} checks FAILED`);
process.exit(failed === 0 ? 0 : 1);
