#!/usr/bin/env node
// The guard between "merged" and "running": a plugin edit that ships
// without a version bump is served from cache as the old version, so the
// change silently never arrives. This suite compares every marketplace
// plugin against tests/plugin-releases.json and fails when content
// changed under an unchanged version, or when a release was never
// recorded. After a deliberate bump: node tests/update-release-record.js
//
// Run: node tests/release-guard.test.js

'use strict';

const assert = require('assert');
const fs = require('fs');

const { currentState, RECORD } = require('./update-release-record.js');

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

const state = currentState();

check('a release record exists', () => {
  assert.ok(fs.existsSync(RECORD), 'tests/plugin-releases.json missing; run node tests/update-release-record.js');
});

const record = fs.existsSync(RECORD) ? JSON.parse(fs.readFileSync(RECORD, 'utf8')) : {};

for (const [name, now] of Object.entries(state)) {
  check(`${name}: content and version move together`, () => {
    const was = record[name];
    assert.ok(was, `${name} has no recorded release; run node tests/update-release-record.js`);
    if (now.version === was.version) {
      assert.strictEqual(now.hash, was.hash,
        `${name} changed on disk but is still ${now.version}; bump plugin.json and marketplace.json, restamp its skills, then run node tests/update-release-record.js`);
    } else {
      assert.fail(`${name} is now ${now.version} (recorded ${was.version}); record the release: node tests/update-release-record.js`);
    }
  });
}

for (const name of Object.keys(record)) {
  check(`${name}: still shipped by the marketplace`, () => {
    assert.ok(state[name], `${name} is recorded but no longer in marketplace.json; refresh the record if that is intended`);
  });
}

console.log(failed === 0
  ? `release-guard: all ${total} checks passed`
  : `release-guard: ${failed} of ${total} checks FAILED`);
process.exit(failed === 0 ? 0 : 1);
