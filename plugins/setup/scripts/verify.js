#!/usr/bin/env node
// Verify a directory holding the six shared files against the contract in
// skills/install/references/file-schemas.md.
//
//   node verify.js <directory>
//
// Exit 0: no errors (warnings allowed). Exit 1: at least one error.
// Exit 2: the invocation itself was wrong.
//
// This is the Claude Code path. In Cowork a model does this by reading the
// contract; anywhere a script reads these files it accepts exactly the syntax
// the contract writes and nothing looser.

'use strict';

const fs = require('fs');
const path = require('path');

const ROSTER = [
  'good-morning', 'catch-me-up', 'loose-ends', 'going-away', 'inbox',
  'time-spent', 'prioritize', 'wins', 'give-me-feedback', 'follow-ups',
  'prep-me', 'teach-me', 'best-in-class', 'a-better-way', 'sound-like-me',
  'slop-check', 'review-as', 'say-it-simply', 'why-we-decided', 'run-it-past',
];

const STALE_DAYS = 90;

// ---------------------------------------------------------------- reporting

const findings = [];

function report(file, level, message) {
  findings.push({ file, level, message });
}

// ------------------------------------------------------------------ parsing

// A field is a `key: value` line. The key runs to the first colon, the value
// to the end of the line. Handle items like `email:x` are list items, never
// fields, because they only appear under a dash.
function parseField(line) {
  const m = line.match(/^([A-Za-z][A-Za-z '-]*?):(?:\s+(.*))?$/);
  if (!m) return null;
  return { key: m[1], value: (m[2] || '').trim() };
}

function isDashItem(line) {
  return /^\s+-\s+\S/.test(line) || /^-\s+\S/.test(line);
}

function dashValue(line) {
  return line.replace(/^\s*-\s+/, '').trim();
}

// An inline list is bracketed on one line: [a, b]. Empty [] is a valid empty
// list. Returns null when the value is not bracketed.
function parseInlineList(value) {
  const m = value.match(/^\[(.*)\]$/);
  if (!m) return null;
  const inner = m[1].trim();
  if (inner === '') return [];
  return inner.split(',').map((s) => s.trim()).filter((s) => s !== '');
}

// Split a file into the header block and entries. An entry begins at an `id:`
// line and runs to the next `id:` line or the end of the file. Headings are
// decoration and are skipped everywhere except voice.md, which never comes
// through here.
function splitEntries(lines) {
  const header = [];
  const entries = [];
  let current = null;
  for (const line of lines) {
    const field = parseField(line);
    if (field && field.key === 'id') {
      current = { id: field.value, lines: [] };
      entries.push(current);
      continue;
    }
    if (current) current.lines.push(line);
    else header.push(line);
  }
  return { header, entries };
}

// Collect the fields of one entry (or header block). A key appearing twice
// keeps both values, so duplicates are detectable. Dash lists attach to the
// preceding empty-valued key.
function collectFields(lines) {
  const fields = [];
  let openList = null;
  for (const line of lines) {
    if (/^#/.test(line) || line.trim() === '') { openList = null; continue; }
    if (isDashItem(line)) {
      if (openList) openList.list.push(dashValue(line));
      continue;
    }
    // An indented continuation (like `to:` under a Prefer item) only occurs
    // in voice.md, which is parsed separately.
    const field = parseField(line.trim());
    if (field) {
      const entry = { key: field.key, value: field.value, list: null };
      if (field.value === '') { entry.list = []; openList = entry; }
      else openList = null;
      fields.push(entry);
      continue;
    }
    openList = null;
  }
  return fields;
}

function getAll(fields, key) {
  return fields.filter((f) => f.key === key);
}

function getOne(fields, key) {
  const all = getAll(fields, key);
  return all.length > 0 ? all[0] : null;
}

// The value of a list-bearing field: inline brackets, or the dash list.
function listOf(field) {
  if (field === null) return null;
  if (field.list !== null && field.list.length > 0) return field.list;
  const inline = parseInlineList(field.value);
  if (inline !== null) return inline;
  if (field.list !== null) return field.list; // empty dash list
  return null;
}

// ----------------------------------------------------------------- checks

function isDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

function daysOld(value) {
  return Math.floor((Date.now() - new Date(`${value}T00:00:00Z`).getTime()) / 86400000);
}

function checkDate(file, where, value, { stale = true } = {}) {
  if (!isDate(value)) {
    report(file, 'error', `${where}: dates are YYYY-MM-DD, got "${value}"`);
    return;
  }
  if (stale && daysOld(value) > STALE_DAYS) {
    report(file, 'warning', `${where}: last confirmed ${value} is older than ${STALE_DAYS} days, stale`);
  }
}

// Every file starts with `schema: 1` and a file-level `last confirmed`.
// Missing, malformed and unknown-version are three different messages.
function checkHeader(file, fields) {
  const schema = getOne(fields, 'schema');
  if (schema === null) {
    report(file, 'error', 'schema line missing');
  } else if (!/^\d+$/.test(schema.value)) {
    report(file, 'error', `schema line malformed: "${schema.value}"`);
  } else if (schema.value !== '1') {
    report(file, 'error', `schema version ${schema.value} unknown, this checker knows version 1`);
  }
  const confirmed = getOne(fields, 'last confirmed');
  if (confirmed === null) {
    report(file, 'error', 'file-level last confirmed missing');
  } else {
    checkDate(file, 'file header', confirmed.value);
  }
}

function checkId(file, id, prefix, seen) {
  const re = new RegExp(`^${prefix}-[a-z0-9][a-z0-9-]*$`);
  if (!re.test(id)) {
    report(file, 'error', `id "${id}" does not match ${prefix}- plus lowercase letters, digits and hyphens`);
  }
  if (seen.has(id)) {
    report(file, 'error', `duplicate id "${id}", uniqueness is file-wide`);
  }
  seen.add(id);
}

function checkHandle(file, where, raw) {
  const m = raw.match(/^([a-z]+):(.*)$/);
  if (!m) {
    report(file, 'error', `${where}: handle "${raw}" carries no type; handles are email:, slack:, teams: or phone:`);
    return null;
  }
  const [, type, rest] = m;
  if (type === 'email') {
    if (!/^[^\s@]+@[^\s@]+$/.test(rest)) {
      report(file, 'error', `${where}: "${raw}" is not an email address`);
      return null;
    }
    return `email:${rest.toLowerCase()}`;
  }
  if (type === 'slack' || type === 'teams') {
    const parts = rest.split(':');
    if (parts.length !== 2 || parts[0] === '' || parts[1] === '') {
      report(file, 'error', `${where}: "${raw}" must carry its workspace or tenant, like ${type}:acme.${type === 'slack' ? 'slack.com' : 'onmicrosoft.com'}:ID`);
      return null;
    }
    return raw;
  }
  if (type === 'phone') {
    if (!/^\+\d+( ext \d+)?$/.test(rest)) {
      report(file, 'error', `${where}: "${raw}" must be phone:+ then digits, with an optional " ext N"`);
      return null;
    }
    return raw;
  }
  report(file, 'error', `${where}: handle type "${type}" is not one of email, slack, teams, phone`);
  return null;
}

function checkEntryConfirmed(file, id, fields) {
  const confirmed = getOne(fields, 'last confirmed');
  if (confirmed === null) {
    report(file, 'error', `${id}: last confirmed is required on every entry`);
  } else {
    checkDate(file, id, confirmed.value);
  }
}

// Unknown fields are kept and reported once per key. `note:` is never
// reported, because it is the documented place for a person's own additions.
function checkUnknownFields(file, fields, known, reported) {
  for (const f of fields) {
    if (f.key === 'note' || known.includes(f.key)) continue;
    if (reported.has(f.key)) continue;
    reported.add(f.key);
    report(file, 'warning', `unknown field "${f.key}" kept and reported; intentional additions use note:`);
  }
}

function requireFields(file, id, fields, required) {
  let ok = true;
  for (const key of required) {
    if (getOne(fields, key) === null) {
      report(file, 'error', `${id}: required field "${key}" missing`);
      ok = false;
    }
  }
  return ok;
}

// -------------------------------------------------------------- file checks

function checkAboutMe(file, lines) {
  // Fields live above the first heading; everything after is prose.
  const firstHeading = lines.findIndex((l) => /^#/.test(l));
  const top = firstHeading === -1 ? lines : lines.slice(0, firstHeading);
  const fields = collectFields(top);
  checkHeader(file, fields);
  requireFields(file, 'about-me', fields, ['name', 'role', 'timezone']);
  checkUnknownFields(file, fields,
    ['schema', 'last confirmed', 'name', 'role', 'company', 'timezone', 'working hours', 'my handles'],
    new Set());

  const tz = getOne(fields, 'timezone');
  if (tz !== null) {
    try {
      new Intl.DateTimeFormat('en-US', { timeZone: tz.value });
    } catch {
      report(file, 'warning', `timezone "${tz.value}" unrecognised, consumers will use UTC`);
    }
  }

  const hours = getOne(fields, 'working hours');
  if (hours !== null) {
    const re = /^\d{2}:\d{2}-\d{2}:\d{2} (Mon|Tue|Wed|Thu|Fri|Sat|Sun)(,(Mon|Tue|Wed|Thu|Fri|Sat|Sun))*$/;
    if (!re.test(hours.value)) {
      report(file, 'warning', `working hours "${hours.value}" not HH:MM-HH:MM then comma-separated three-letter days; treated as absent, consumers will assume a whole day`);
    }
  }

  const handles = listOf(getOne(fields, 'my handles'));
  if (handles !== null) {
    for (const h of handles) checkHandle(file, 'my handles', h);
  }
}

function checkPeople(file, lines) {
  const { header, entries } = splitEntries(lines);
  checkHeader(file, collectFields(header));
  const seenIds = new Set();
  const seenHandles = new Map();
  const reported = new Set();
  for (const entry of entries) {
    const fields = collectFields(entry.lines);
    const id = entry.id;
    checkId(file, id, 'p', seenIds);
    requireFields(file, id, fields, ['kind', 'handles']);
    checkEntryConfirmed(file, id, fields);
    checkUnknownFields(file, fields,
      ['kind', 'relationship', 'handles', 'last confirmed'], reported);

    const kind = getOne(fields, 'kind');
    if (kind !== null && kind.value !== 'person' && kind.value !== 'shared') {
      report(file, 'error', `${id}: kind is person or shared, exactly; got "${kind.value}"`);
    }
    const handles = listOf(getOne(fields, 'handles'));
    if (handles !== null) {
      if (handles.length === 0) {
        report(file, 'error', `${id}: handles list is empty`);
      }
      for (const h of handles) {
        const canonical = checkHandle(file, id, h);
        if (canonical === null) continue;
        if (seenHandles.has(canonical)) {
          report(file, 'error', `${id}: handle "${h}" already on ${seenHandles.get(canonical)}, uniqueness is file-wide`);
        } else {
          seenHandles.set(canonical, id);
        }
      }
    }
  }
  if (entries.length === 0) {
    report(file, 'warning', 'semantically empty: header and no entries, valid, nothing confirmed');
  }
  return { ids: [...seenIds] };
}

function checkPriorities(file, lines) {
  const { header, entries } = splitEntries(lines);
  checkHeader(file, collectFields(header));
  const seenIds = new Set();
  const reported = new Set();
  for (const entry of entries) {
    const fields = collectFields(entry.lines);
    const id = entry.id;
    checkId(file, id, 'pr', seenIds);
    requireFields(file, id, fields, ['rank', 'since', 'include']);
    checkEntryConfirmed(file, id, fields);
    checkUnknownFields(file, fields,
      ['rank', 'since', 'include', 'exclude', 'last confirmed'], reported);

    const rank = getOne(fields, 'rank');
    if (rank !== null && !/^[1-9]\d*$/.test(rank.value)) {
      report(file, 'error', `${id}: rank must be a positive integer, got "${rank.value}"`);
    }
    const since = getOne(fields, 'since');
    if (since !== null) checkDate(file, `${id} since`, since.value, { stale: false });
    const include = listOf(getOne(fields, 'include'));
    if (include !== null && include.length === 0) {
      report(file, 'error', `${id}: include list is empty`);
    }
  }
  if (entries.length === 0) {
    report(file, 'warning', 'semantically empty: header and no entries, valid, nothing confirmed');
  }
}

function checkVoice(file, lines) {
  // The three section headings are structural here, the one stated exception
  // to headings-are-decoration. Retitling one makes the file malformed.
  const top = [];
  for (const line of lines) {
    if (/^#/.test(line)) break;
    top.push(line);
  }
  const fields = collectFields(top);
  checkHeader(file, fields);
  checkUnknownFields(file, fields, ['schema', 'last confirmed', 'confidence'], new Set());

  const confidence = getOne(fields, 'confidence');
  if (confidence === null) {
    report(file, 'error', 'confidence missing; malformed, not silently accepted. It is corrected, accepted or absent');
  } else if (!['corrected', 'accepted', 'absent'].includes(confidence.value)) {
    report(file, 'error', `confidence "${confidence.value}" unrecognised; malformed, not silently accepted. It is corrected, accepted or absent`);
  }

  const headings = lines.filter((l) => /^##\s/.test(l)).map((l) => l.replace(/^##\s+/, '').trim());
  for (const wanted of ['Never', 'Prefer', 'How I sound']) {
    if (!headings.includes(wanted)) {
      report(file, 'error', `structural heading "## ${wanted}" missing or retitled; the three voice headings are fixed`);
    }
  }
  for (const h of headings) {
    if (!['Never', 'Prefer', 'How I sound'].includes(h)) {
      report(file, 'warning', `heading "## ${h}" is not one of the three structural headings`);
    }
  }

  // Prefer is a from:/to: list. A from without a to is malformed.
  const preferStart = lines.findIndex((l) => /^##\s+Prefer\s*$/.test(l));
  if (preferStart !== -1) {
    const section = [];
    for (const line of lines.slice(preferStart + 1)) {
      if (/^##\s/.test(line)) break;
      section.push(line);
    }
    for (let i = 0; i < section.length; i += 1) {
      const line = section[i];
      if (/^-\s+from:/.test(line.trim()) || /^\s+-\s+from:/.test(line)) {
        const next = (section[i + 1] || '').trim();
        if (!/^to:\s+\S/.test(next)) {
          report(file, 'error', `Prefer item "${dashValue(line)}" has no to: line; Prefer is a from:/to: list`);
        }
      }
    }
  }
}

function checkPersonas(file, lines, peopleIds) {
  const { header, entries } = splitEntries(lines);
  checkHeader(file, collectFields(header));
  const seenIds = new Set();
  const reported = new Set();
  for (const entry of entries) {
    const fields = collectFields(entry.lines);
    const id = entry.id;
    checkId(file, id, 'pe', seenIds);
    requireFields(file, id, fields, ['cares about', 'pushes back on', 'reads']);
    checkEntryConfirmed(file, id, fields);
    checkUnknownFields(file, fields,
      ['person', 'cares about', 'pushes back on', 'reads', 'last confirmed'], reported);

    const person = getOne(fields, 'person');
    if (person !== null) {
      if (peopleIds === null) {
        report(file, 'error', `${id}: person "${person.value}" cannot be checked because people.md is missing or unreadable`);
      } else if (!peopleIds.includes(person.value)) {
        report(file, 'error', `${id}: person "${person.value}" does not resolve to a people.md id; only an absent field means deliberately unlinked`);
      }
    }
    const pushes = getOne(fields, 'pushes back on');
    if (pushes !== null && pushes.value === '' && (pushes.list === null || pushes.list.length === 0)) {
      report(file, 'warning', `${id}: blank "pushes back on" makes this persona not useful`);
    }
  }
  if (entries.length === 0) {
    report(file, 'warning', 'semantically empty: header and no entries, valid; hard-stop consumers stop and say "no personas defined"');
  }
}

function checkSources(file, lines) {
  const { header, entries } = splitEntries(lines);
  checkHeader(file, collectFields(header));
  const seenIds = new Set();
  const reported = new Set();
  for (const entry of entries) {
    const fields = collectFields(entry.lines);
    const id = entry.id;
    checkId(file, id, 's', seenIds);
    requireFields(file, id, fields, ['kind', 'account', 'required for']);
    checkEntryConfirmed(file, id, fields);
    checkUnknownFields(file, fields,
      ['kind', 'account', 'required for', 'look back', 'look ahead', 'read', 'skip', 'except', 'last confirmed'], reported);

    const kind = getOne(fields, 'kind');
    if (kind !== null && !['calendar', 'mail', 'chat', 'notes'].includes(kind.value)) {
      report(file, 'error', `${id}: kind "${kind.value}" is malformed, never ignored; it is calendar, mail, chat or notes`);
    }
    const requiredFor = listOf(getOne(fields, 'required for'));
    if (requiredFor === null && getOne(fields, 'required for') !== null) {
      report(file, 'error', `${id}: required for must be a bracketed inline list or a dash list`);
    }
    if (requiredFor !== null) {
      for (const skill of requiredFor) {
        if (!ROSTER.includes(skill)) {
          report(file, 'error', `${id}: "${skill}" in required for is not on the skill roster; malformed rather than silently ignored`);
        }
      }
    }

    const windows = [];
    for (const key of ['look back', 'look ahead']) {
      const field = getOne(fields, key);
      if (field === null) continue;
      windows.push(key);
      if (!/^(\d+ days|1 day)$/.test(field.value)) {
        report(file, 'error', `${id}: ${key} "${field.value}" is malformed; the form is a non-negative integer then "days"`);
      }
    }
    if (windows.length === 0) {
      report(file, 'error', `${id}: at least one of look back / look ahead is required`);
    }
    if (kind !== null && kind.value === 'calendar' && getOne(fields, 'look ahead') === null) {
      report(file, 'warning', `${id}: a calendar source without look ahead misses today's 2pm meeting`);
    }
  }
  if (entries.length === 0) {
    report(file, 'warning', 'semantically empty: valid, and hard-stop consumers stop on it too, saying "no sources configured"; never a quiet day');
  }
}

// -------------------------------------------------------------------- main

function main(argv) {
  const args = argv.slice(2);
  const positional = [];
  for (const arg of args) {
    if (arg.startsWith('-')) {
      process.stderr.write(`verify.js: unknown option "${arg}". Usage: node verify.js <directory>\n`);
      return 2;
    }
    positional.push(arg);
  }
  if (positional.length !== 1) {
    process.stderr.write('Usage: node verify.js <directory>\n');
    return 2;
  }
  const dir = positional[0];
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    process.stderr.write(`verify.js: "${dir}" is not a directory\n`);
    return 2;
  }

  const read = (name) => {
    const file = path.join(dir, name);
    if (!fs.existsSync(file)) {
      report(name, 'error', 'missing');
      return null;
    }
    return fs.readFileSync(file, 'utf8').split(/\r?\n/);
  };

  const aboutMe = read('about-me.md');
  if (aboutMe) checkAboutMe('about-me.md', aboutMe);

  const people = read('people.md');
  let peopleIds = null;
  if (people) peopleIds = checkPeople('people.md', people).ids;

  const priorities = read('priorities.md');
  if (priorities) checkPriorities('priorities.md', priorities);

  const voice = read('voice.md');
  if (voice) checkVoice('voice.md', voice);

  const personas = read('personas.md');
  if (personas) checkPersonas('personas.md', personas, peopleIds);

  const sources = read('sources.md');
  if (sources) checkSources('sources.md', sources);

  const errors = findings.filter((f) => f.level === 'error');
  const warnings = findings.filter((f) => f.level === 'warning');
  for (const f of findings) {
    console.log(`${f.file}: ${f.level}: ${f.message}`);
  }
  console.log(`${errors.length} error${errors.length === 1 ? '' : 's'}, ${warnings.length} warning${warnings.length === 1 ? '' : 's'} across the six files.`);
  return errors.length > 0 ? 1 : 0;
}

process.exit(main(process.argv));
