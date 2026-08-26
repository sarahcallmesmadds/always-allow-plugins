#!/usr/bin/env node
// Check the daily-hq working files in a folder against their contract at
// ../references/own-files.md: the header, the complete-write marker, the
// entry fields, and the enums. Reports and changes nothing.
//
//   node verify-own.js [folder]
//
// An absent file is reported as absent and is not an error: absence means
// a first run, and the skills say so themselves. Exit 0 when every present
// file verifies, 1 on any error, 2 on usage.

'use strict';

const fs = require('fs');
const path = require('path');

// One file's rules: the header fields it requires beyond schema/run/date/
// items, and the entry fields it requires. own-files.md is the prose copy
// of this table; tests hold the two together.
const FILES = {
  'day-snapshot.md': {
    header: ['timezone'],
    required: ['source', 'start', 'end', 'status', 'participants'],
  },
  'brief-feedback.md': {
    header: [],
    required: ['source', 'scope', 'added', 'unmatched runs', 'reported'],
  },
  'going-away-pool.md': {
    header: ['window start', 'window end'],
    required: ['source', 'title', 'owner', 'status', 'summary'],
  },
};

const MARKER = 'complete';

// The header fields every working file requires after schema. The
// consistency suite compares own-files.md against this single list, so
// dropping a field here fails that comparison rather than passing quietly.
const COMMON_HEADER = ['run', 'date', 'items'];

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?$/;
const PERSON_ID = /^p-[a-z0-9-]+$/;
const ITEM_ID = /^[^\s/]+\/[^\s/]+$/;

function realDate(stamp) {
  const [y, m, d] = stamp.slice(0, 10).split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d));
  return t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d;
}

// A start/end value is real: a real calendar date, and when a time is
// carried, a real clock time.
function realTime(stamp) {
  if (!TIME.test(stamp) || !realDate(stamp)) return false;
  if (stamp.length === 10) return true;
  const [h, min] = stamp.slice(11).split(':').map(Number);
  return h <= 23 && min <= 59;
}

// A run id is r-YYYYMMDD-HHMM with a real calendar date and clock time.
function realRunId(value) {
  const m = value.match(/^r-(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})$/);
  if (!m) return false;
  return realDate(`${m[1]}-${m[2]}-${m[3]}`) && Number(m[4]) <= 23 && Number(m[5]) <= 59;
}

function realTimezone(name) {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: name });
    return true;
  } catch {
    return false;
  }
}

// The ids the shared files beside the working files define, for the
// cross-checks. A light scan of id: lines is enough: entries begin at
// id: by the contract's own recognition rule. Absence means the checks
// fall back to form only, said in the output.
function idsFrom(folder, file, prefix) {
  const full = path.join(folder, file);
  if (!fs.existsSync(full)) return null;
  const ids = new Set();
  for (const line of fs.readFileSync(full, 'utf8').split('\n')) {
    const m = line.match(/^id: ([a-z0-9-]+)$/);
    if (m && m[1].startsWith(prefix)) ids.add(m[1]);
  }
  return ids;
}

// sources.md ids with their kinds, so the snapshot can insist on
// calendar sources, not merely existing ones.
function sourceKinds(folder) {
  const full = path.join(folder, 'sources.md');
  if (!fs.existsSync(full)) return null;
  const kinds = new Map();
  let currentId = null;
  for (const line of fs.readFileSync(full, 'utf8').split('\n')) {
    const idm = line.match(/^id: ([a-z0-9-]+)$/);
    if (idm) {
      currentId = idm[1].startsWith('s-') ? idm[1] : null;
      if (currentId) kinds.set(currentId, null);
      continue;
    }
    const km = line.match(/^kind: (.+)$/);
    if (km && currentId) kinds.set(currentId, km[1].trim());
  }
  return kinds;
}

function verifyFile(folder, name, rules, report, known) {
  const full = path.join(folder, name);
  if (!fs.existsSync(full)) {
    report.info(`${name}: absent`);
    return;
  }
  const error = (msg) => report.error(`${name}: error: ${msg}`);
  const raw = fs.readFileSync(full, 'utf8');
  const lines = raw.split('\n');

  // Unknown fields are kept and reported once per file, per the contract.
  const unknownSeen = new Set();
  const warnUnknown = (key) => {
    if (key === 'note' || unknownSeen.has(key)) return;
    unknownSeen.add(key);
    report.warn(`${name}: warning: unknown field "${key}" kept and reported`);
  };

  // The marker is the last non-blank line, held out of entry parsing.
  let markerValue = null;
  let markerLine = -1;
  for (let i = lines.length - 1; i >= 0; i -= 1) {
    if (/^complete: /.test(lines[i])) { markerLine = i; break; }
  }
  if (markerLine === -1) {
    error('complete-write marker missing');
  } else {
    markerValue = lines[markerLine].slice('complete: '.length).trim();
    if (lines.slice(markerLine + 1).some((l) => l.trim() !== '')) {
      error('content after the complete-write marker');
    }
    for (let i = 0; i < markerLine; i += 1) {
      if (/^complete: /.test(lines[i])) error('field "complete" appears more than once');
    }
  }

  // Split header from entries at the first id: line.
  const body = markerLine >= 0 ? lines.slice(0, markerLine) : lines;
  let firstEntry = body.findIndex((l) => /^id: /.test(l) || l === 'id:');
  if (firstEntry === -1) firstEntry = body.length;

  // ------------------------------------------------------------- header
  const header = {};
  if (!/^schema: /.test(body[0] || '')) {
    error('schema line missing; the file starts with "schema: 1"');
  } else {
    const version = body[0].slice('schema: '.length).trim();
    header.schema = version;
    if (version !== '1') error(`schema version ${version} unknown; this plugin reads schema 1`);
  }
  const headerRequired = [...COMMON_HEADER, ...rules.header];
  let lastHeaderKey = null;
  for (let i = 1; i < firstEntry; i += 1) {
    const line = body[i];
    if (line.trim() === '' || line.startsWith('#')) { lastHeaderKey = null; continue; }
    const dash = line.match(/^\s+- (.*)$/);
    if (dash) {
      if (!lastHeaderKey) { error(`dash item outside a list: ${JSON.stringify(line)}`); continue; }
      if (!Array.isArray(header[lastHeaderKey])) header[lastHeaderKey] = [];
      header[lastHeaderKey].push(dash[1].trim());
      continue;
    }
    const m = line.match(/^([A-Za-z][A-Za-z -]*): ?(.*)$/);
    if (!m) { error(`line not recognised as a field: ${JSON.stringify(line)}`); continue; }
    const [, key, value] = m;
    if (key in header) error(`field "${key}" appears more than once in the header`);
    header[key] = value.trim();
    lastHeaderKey = value.trim() === '' ? key : null;
    if (!headerRequired.includes(key) && key !== 'schema') warnUnknown(key);
  }
  for (const key of headerRequired) {
    if (Array.isArray(header[key])) error(`"${key}" takes a single value, not a list`);
  }
  for (const key of headerRequired) {
    if (!(key in header)) error(`required header field "${key}" missing`);
    else if (header[key] === '') error(`required header field "${key}" is blank`);
  }
  if (header.run !== undefined && header.run !== '' && !realRunId(header.run)) {
    error(`run "${header.run}" is not r-YYYYMMDD-HHMM with a real date and time`);
  }
  const headerDates = ['date', ...rules.header.filter((k) => k.startsWith('window '))];
  for (const key of headerDates) {
    if (header[key] !== undefined && header[key] !== ''
        && (!DATE.test(header[key]) || !realDate(header[key]))) {
      error(`${key} "${header[key]}" is malformed; dates are YYYY-MM-DD`);
    }
  }
  const ws = header['window start'];
  const we = header['window end'];
  if (typeof ws === 'string' && typeof we === 'string'
      && DATE.test(ws) && realDate(ws) && DATE.test(we) && realDate(we) && ws > we) {
    error(`window start ${ws} is after window end ${we}`);
  }
  if (rules.header.includes('timezone') && typeof header.timezone === 'string'
      && header.timezone !== '' && !realTimezone(header.timezone)) {
    error(`timezone "${header.timezone}" is not a recognised IANA name`);
  }
  if (markerValue !== null && header.run !== undefined && markerValue !== header.run) {
    error(`complete-write marker names "${markerValue}", run is "${header.run}"`);
  }

  // ------------------------------------------------------------ entries
  const entries = [];
  let current = null;
  let lastListKey = null;
  for (let i = firstEntry; i < body.length; i += 1) {
    const line = body[i];
    if (line.trim() === '' || line.startsWith('#')) { lastListKey = null; continue; }
    const dash = line.match(/^\s+- (.*)$/);
    if (dash) {
      if (!current || !lastListKey) { error(`dash item outside a list: ${JSON.stringify(line)}`); continue; }
      if (!Array.isArray(current.fields[lastListKey])) current.fields[lastListKey] = [];
      current.fields[lastListKey].push(dash[1].trim());
      continue;
    }
    const m = line.match(/^([A-Za-z][A-Za-z -]*): ?(.*)$/);
    if (!m) { error(`line not recognised as a field or an indented dash item: ${JSON.stringify(line)}`); continue; }
    const [, key, rawValue] = m;
    const value = rawValue.trim();
    if (key === 'id') {
      current = { id: value, fields: {} };
      entries.push(current);
      lastListKey = null;
      continue;
    }
    if (!current) { error(`field "${key}" before the first entry's id`); continue; }
    if (key !== 'note' && key in current.fields) error(`field "${key}" appears more than once on "${current.id}"`);
    if (value.startsWith('[') && value.endsWith(']')) {
      const inner = value.slice(1, -1).trim();
      current.fields[key] = inner === '' ? [] : inner.split(',').map((s) => s.trim());
      if (current.fields[key].some((s) => s === '')) error(`malformed inline list on "${current.id}": ${value}`);
      lastListKey = null;
    } else if (value === '') {
      current.fields[key] = '';
      lastListKey = key;
    } else {
      current.fields[key] = value;
      lastListKey = null;
    }
  }

  const seenIds = new Set();
  for (const entry of entries) {
    const id = entry.id;
    if (seenIds.has(id)) error(`duplicate id "${id}"`);
    seenIds.add(id);
    if (!ITEM_ID.test(id)) {
      error(`id "${id}" is not [source id]/[item id]`);
    } else if (!/^s-[a-z0-9-]+$/.test(id.split('/')[0])) {
      // Form is checked whether or not sources.md is here to resolve it.
      error(`id "${id}" does not begin with an s- source id`);
    } else if (typeof entry.fields.source === 'string'
        && entry.fields.source !== id.split('/')[0]) {
      error(`entry "${id}": source "${entry.fields.source}" does not match the id prefix "${id.split('/')[0]}"`);
    }
    for (const key of rules.required) {
      if (!(key in entry.fields)) error(`required field "${key}" missing on "${id}"`);
      else if (entry.fields[key] === '' && key !== 'participants') {
        error(`required field "${key}" is blank on "${id}"`);
      }
    }
    for (const key of Object.keys(entry.fields)) {
      if (!rules.required.includes(key) && !['note', 'last-checked'].includes(key)) warnUnknown(key);
      // Only a known scalar field is malformed as a list; an unknown
      // list-valued field is kept and warned like any unknown field.
      if (Array.isArray(entry.fields[key]) && key !== 'participants'
          && (rules.required.includes(key) || key === 'last-checked')) {
        error(`"${key}" on "${id}" takes a single value, not a list`);
      }
    }
    const f = entry.fields;
    if (typeof entry.fields.source === 'string' && known.sources
        && ITEM_ID.test(id) && !known.sources.has(entry.fields.source)) {
      error(`source "${entry.fields.source}" on "${id}" is not in sources.md`);
    }
    if (name === 'day-snapshot.md') {
      for (const key of ['start', 'end']) {
        if (typeof f[key] === 'string' && f[key] !== '' && !realTime(f[key])) {
          error(`${key} "${f[key]}" on "${id}" is malformed; a real YYYY-MM-DD or YYYY-MM-DDTHH:MM`);
        }
      }
      if (typeof f.start === 'string' && typeof f.end === 'string'
          && realTime(f.start) && realTime(f.end)) {
        // One representation per event: all-day or timed, never a mix,
        // so the interval is always comparable.
        if (f.start.length !== f.end.length) {
          error(`start "${f.start}" and end "${f.end}" on "${id}" mix all-day and timed forms`);
        } else if (f.end < f.start) {
          error(`end "${f.end}" on "${id}" is before its start`);
        }
      }
      if (typeof f.source === 'string' && known.sources && known.sources.has(f.source)
          && known.sources.get(f.source) !== 'calendar') {
        error(`source "${f.source}" on "${id}" is not a calendar source; the snapshot holds calendar events`);
      }
      if (typeof f.participants === 'string') {
        error(`participants on "${id}" must be a bracketed inline list or indented dash items`);
      }
      for (const p of Array.isArray(f.participants) ? f.participants : []) {
        if (!PERSON_ID.test(p)) error(`participants entry "${p}" on "${id}" is not a p- id`);
        else if (known.people && !known.people.has(p)) {
          error(`participants entry "${p}" on "${id}" does not resolve to a people.md id`);
        }
      }
    }
    if (name === 'brief-feedback.md') {
      if (typeof f.scope === 'string' && !['item', 'series'].includes(f.scope)) {
        error(`scope "${f.scope}" on "${id}" is malformed; item or series`);
      }
      if (typeof f.added === 'string' && (!DATE.test(f.added) || !realDate(f.added))) {
        error(`added "${f.added}" on "${id}" is malformed; dates are YYYY-MM-DD`);
      }
      const runs = f['unmatched runs'];
      if (typeof runs === 'string' && !/^\d+$/.test(runs)) {
        error(`unmatched runs "${runs}" on "${id}" is not a whole number of zero or more`);
      }
      if (typeof f.reported === 'string' && !['true', 'false'].includes(f.reported)) {
        error(`reported "${f.reported}" on "${id}" is malformed; true or false`);
      }
    }
    if (name === 'going-away-pool.md') {
      if (typeof f.owner === 'string' && f.owner !== 'unresolved' && !PERSON_ID.test(f.owner)) {
        error(`owner "${f.owner}" on "${id}" is neither a p- id nor "unresolved"`);
      } else if (typeof f.owner === 'string' && PERSON_ID.test(f.owner)
          && known.people && !known.people.has(f.owner)) {
        error(`owner "${f.owner}" on "${id}" does not resolve to a people.md id`);
      }
      if (typeof f['last-checked'] === 'string'
          && (!DATE.test(f['last-checked']) || !realDate(f['last-checked']))) {
        error(`last-checked "${f['last-checked']}" on "${id}" is malformed; dates are YYYY-MM-DD`);
      }
    }
  }

  if (header.items !== undefined && header.items !== '') {
    if (!/^\d+$/.test(header.items)) {
      error(`items "${header.items}" is not a whole number`);
    } else if (Number(header.items) !== entries.length) {
      error(`items says ${header.items}, the file holds ${entries.length} ${entries.length === 1 ? 'entry' : 'entries'}`);
    }
  }
}

function main() {
  const args = process.argv.slice(2);
  if (args.some((a) => a.startsWith('-'))) {
    console.error(`unknown option ${args.find((a) => a.startsWith('-'))}`);
    process.exit(2);
  }
  if (args.length !== 1) {
    console.error('Usage: node verify-own.js [folder]');
    process.exit(2);
  }
  const folder = args[0];
  if (!fs.existsSync(folder) || !fs.statSync(folder).isDirectory()) {
    console.error(`${folder} is not a directory`);
    process.exit(2);
  }
  let errors = 0;
  let warnings = 0;
  const out = [];
  const report = {
    error: (msg) => { errors += 1; out.push(msg); },
    warn: (msg) => { warnings += 1; out.push(msg); },
    info: (msg) => { out.push(msg); },
  };
  const known = {
    people: idsFrom(folder, 'people.md', 'p-'),
    sources: sourceKinds(folder),
  };
  if (!known.people) report.info('people.md: absent; participant and owner ids checked for form only');
  if (!known.sources) report.info('sources.md: absent; entry source ids checked for form only');
  for (const [name, rules] of Object.entries(FILES)) {
    verifyFile(folder, name, rules, report, known);
  }
  console.log(`${errors} ${errors === 1 ? 'error' : 'errors'}, ${warnings} ${warnings === 1 ? 'warning' : 'warnings'}`);
  for (const line of out) console.log(line);
  process.exit(errors > 0 ? 1 : 0);
}

module.exports = { FILES, MARKER, COMMON_HEADER };

if (require.main === module) main();
