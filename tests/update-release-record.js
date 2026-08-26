#!/usr/bin/env node
// Refresh tests/plugin-releases.json: one line per marketplace plugin,
// its declared version and a hash of everything in its directory.
// Run this after bumping a plugin's version; release-guard.test.js
// compares the working tree against this record and fails when content
// changed without a bump, or when a bump was never recorded.
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

if (require.main === module) {
  const state = currentState();
  fs.writeFileSync(RECORD, JSON.stringify(state, null, 2) + '\n');
  for (const [name, { version }] of Object.entries(state)) {
    console.log(`recorded ${name} ${version}`);
  }
}
