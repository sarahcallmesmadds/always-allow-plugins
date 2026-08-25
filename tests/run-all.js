#!/usr/bin/env node
// Run every test suite in this directory and report what passed.
//
//   node tests/run-all.js          every suite
//   node tests/run-all.js verify   only suites whose name contains "verify"
//
// Discovery is by directory listing rather than a list kept here, so a suite
// added tomorrow runs without anyone remembering to mention it.

'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const HERE = __dirname;
const filter = process.argv[2];

const suites = fs.readdirSync(HERE)
  .filter((f) => f.endsWith('.test.js'))
  .filter((f) => !filter || f.includes(filter))
  .sort();

if (suites.length === 0) {
  console.log(filter ? `No suite matches "${filter}".` : 'No test suites found.');
  process.exit(1);
}

let anyFailed = false;
for (const suite of suites) {
  const run = spawnSync(process.execPath, [path.join(HERE, suite)], { encoding: 'utf8' });
  const stdout = (run.stdout || '').trim().split('\n');
  const summary = stdout[stdout.length - 1] || '(no output)';
  const ok = run.status === 0;
  if (!ok) anyFailed = true;
  console.log(`${ok ? 'ok  ' : 'FAIL'}  ${suite}: ${summary}`);
  if (!ok) console.log((run.stdout || '') + (run.stderr || ''));
}

process.exit(anyFailed ? 1 : 0);
