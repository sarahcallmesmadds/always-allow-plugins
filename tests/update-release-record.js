#!/usr/bin/env node
// Refresh tests/plugin-releases.json: one line per marketplace plugin,
// its declared version and a hash of everything in its directory.
// Run this after bumping a plugin's version; release-guard.test.js
// compares the working tree against this record and fails when content
// changed without a bump, or when a bump was never recorded.
//
// It records releases; it does not bless unbumped edits: a plugin whose
// content changed while its version stayed put is refused, because
// otherwise running this command would quietly re-baseline exactly the
// drift the guard exists to catch.
//
// Run: node tests/update-release-record.js

'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const RECORD = path.join(__dirname, 'plugin-releases.json');

function filesUnder(dir) {
  const out = [];
  for (const name of fs.readdirSync(dir).sort()) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) out.push(...filesUnder(full));
    else out.push(full);
  }
  return out;
}

function hashPlugin(sourceDir) {
  const hash = crypto.createHash('sha256');
  for (const file of filesUnder(sourceDir)) {
    hash.update(path.relative(sourceDir, file));
    hash.update('\0');
    hash.update(fs.readFileSync(file));
    hash.update('\0');
  }
  return hash.digest('hex');
}

function currentState() {
  const market = JSON.parse(fs.readFileSync(path.join(ROOT, '.claude-plugin', 'marketplace.json'), 'utf8'));
  const state = {};
  for (const entry of market.plugins) {
    state[entry.name] = {
      version: entry.version,
      hash: hashPlugin(path.join(ROOT, entry.source)),
    };
  }
  return state;
}

module.exports = { currentState, RECORD };

// The record the refusal judges against: the working-tree file, backed
// per entry by the committed copy in git, so deleting the file (or one
// entry) before rerunning does not bless anything. A repo with neither
// is a true first run.
function priorRecord() {
  let fromFile = {};
  if (fs.existsSync(RECORD)) fromFile = JSON.parse(fs.readFileSync(RECORD, 'utf8'));
  let fromGit = {};
  try {
    fromGit = JSON.parse(require('child_process').execSync(
      'git show HEAD:tests/plugin-releases.json',
      { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    ));
  } catch {
    // no git, or the record has never been committed
  }
  const merged = { ...fromGit, ...fromFile };
  return Object.keys(merged).length > 0 ? merged : null;
}

if (require.main === module) {
  const state = currentState();
  const prior = priorRecord();
  if (prior) {
    const refused = Object.entries(state)
      .filter(([name, now]) => {
        const was = prior[name];
        return was && was.version === now.version && was.hash !== now.hash;
      })
      .map(([name]) => name);
    if (refused.length > 0) {
      console.error(`refusing to record: ${refused.join(', ')} changed on disk without a version bump.`);
      console.error('Bump plugin.json and marketplace.json, restamp the skills, then rerun.');
      process.exit(1);
    }
  }
  fs.writeFileSync(RECORD, JSON.stringify(state, null, 2) + '\n');
  for (const [name, { version }] of Object.entries(state)) {
    console.log(`recorded ${name} ${version}`);
  }
}
