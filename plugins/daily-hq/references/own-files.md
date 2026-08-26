# The daily-hq working files

Three files this plugin owns: `day-snapshot.md`, `brief-feedback.md`,
`going-away-pool.md`. They live at the top level of the project folder,
beside the nine shared files, and they are not part of the shared-file
contract: `setup` never writes them, `check` does not judge them, and no
other plugin reads them. Each has exactly one writing skill, named below.

**These files are machine-written and carry no `last confirmed`.** That is
a deliberate deviation from the shared files' header rule, stated here: a
person never confirms a snapshot, and pretending one was confirmed would
make the field a lie. A person may still read or delete these files freely;
deleting one is always safe and means the next run starts fresh, saying so.

The recognition rules are the shared contract's: an entry begins at an
`id:` line and runs to the next `id:` line or the end of the file, a field
is a `key: value` line, a key other than `note:` appears at most once per
entry and once in the header, lists are bracketed inline or indented
dashes, uniqueness is file-wide, dates are `YYYY-MM-DD`, unknown fields
are kept and reported once, and there are no silent defaults.

## The header and the complete-write marker

Every working file opens with `schema: 1` on the first line, then its
header fields, then its entries, and its **last non-blank line is
`complete: [the run id]`**, matching the header's `run:` exactly.

- **`run:`** is `r-`, the run's date as `YYYYMMDD`, a hyphen, then the
  time as `HHMM`: `r-20260826-0730`. Exactly that shape, in the file's
  timezone where it has one, otherwise the `about-me.md` timezone the
  writing skill ran under.
- **`items:`** is the number of entries in the file, exactly.
- A file whose marker is missing, whose marker does not match `run:`, or
  whose `items:` does not match the entry count **failed its write**. The
  plan's rule for what a reader then does is per file, below; the common
  ground is that it is said aloud, never silently repaired, and the next
  writer reports the failed state before replacing the file.
- **A failed write is reported by the run that made it**, in that run's own
  output, not discovered as silence later. The writer re-reads the file
  after writing and checks marker and count before claiming success.

In Claude Code the checks in this document run as a script:

```bash
node "${CLAUDE_PLUGIN_ROOT}"/scripts/verify-own.js [folder]
```

Anywhere the script cannot run, a skill checks by hand against this
document. The script and this document name the same files, the same
required fields and the same marker; a disagreement between them is a bug
in this plugin. **Where `people.md` and `sources.md` sit beside the
working files, the script also checks that every participant and owner
resolves to a `people.md` id and every entry's source prefix to a
`sources.md` id; where either file is absent, it says those ids were
checked for form only.**

## `day-snapshot.md`

Written by `good-morning`, and only by `good-morning`. Read by the engine
for change detection. Holds the calendar events the most recent successful
morning run saw.

```markdown
schema: 1
run: r-20260826-0730
date: 2026-08-26
timezone: America/New_York
items: 2

## Quota review
id: s-work-calendar/evt-4471
source: s-work-calendar
start: 2026-08-26T14:00
end: 2026-08-26T15:00
status: confirmed
participants: [p-kate-lin, p-amir-osei]

## Offsite hold
id: s-work-calendar/evt-4520
source: s-work-calendar
start: 2026-08-27
end: 2026-08-27
status: confirmed
participants: []

complete: r-20260826-0730
```

**Header:** `schema`, `run`, `date` (the covered date), `timezone` (the
IANA name the run evaluated dates in), `items`. All required.

**Required per entry:** `id`, `source`, `start`, `end`, `status`,
`participants`.

- **`id` is the namespaced item id**: the `sources.md` source id, a `/`,
  then the connector's own id for the event, which may hold any characters
  except whitespace and `/`. Never a bare id.
- **`source` repeats the id's prefix** and must match it exactly.
- **`start` and `end`** are `YYYY-MM-DD` for an all-day event or
  `YYYY-MM-DDTHH:MM` otherwise, in the header's timezone.
- **`status`** is what the connector reported for the event, as text,
  never blank.
- **`participants`** holds resolved `people.md` ids only. An empty list is
  written as `[]`, never omitted. Unresolved attendees are not recorded
  here; the snapshot exists for change detection, not identity.

**A snapshot that fails validation is treated as absent, and the reader
says so**: change detection starts over rather than running against a file
that cannot be trusted, because a truncated write must not produce wrong
change claims a day later.

## `brief-feedback.md`

Written by `good-morning`, and only by `good-morning`, which appends the
suppressions the person asks for and maintains the counters. Honoured by
`good-morning` and `catch-me-up`.

```markdown
schema: 1
run: r-20260826-0730
date: 2026-08-26
items: 1

## Weekly ops sync reminders
id: s-team-chat/th-99120
source: s-team-chat
scope: series
added: 2026-08-20
unmatched runs: 0
reported: false

complete: r-20260826-0730
```

**Header:** `schema`, `run` (the last run that maintained the file),
`date`, `items`. All required.

**Required per entry:** `id`, `source`, `scope`, `added`,
`unmatched runs`, `reported`.

- **`id`** is the namespaced item or series id being suppressed, in the
  same form as the snapshot's. **`source`** repeats its prefix exactly.
- **`scope`** is `item` or `series`, exactly. A series suppression lives
  until removed; an item suppression is inert once the item stops
  appearing.
- **`unmatched runs`** is a whole number, zero or more. A run increments
  it **only when that entry's source was checked completely** (`ok` or
  `empty`), **any match resets it to zero**, and at 14 consecutive misses
  the entry is reported once ("this suppression matches nothing, possible
  typo") and `reported` is set `true`. A later match resets both.
- **`reported`** is `true` or `false`, exactly.

A malformed entry is skipped and named; the file's other suppressions stay
in force. A file that fails its write check keeps suppressing by its
readable entries, and the failure is said.

## `going-away-pool.md`

Written by `going-away`'s preview, and only by it. Read by `going-away`'s
draft, which uses the pool as the sole source of candidate items and never
re-reads the sources.

```markdown
schema: 1
run: r-20260828-1600
date: 2026-08-28
window start: 2026-08-31
window end: 2026-09-04
items: 1

## Meridian renewal quote
id: s-work-mail/msg-18823
source: s-work-mail
title: Renewal quote for Meridian
owner: p-kate-lin
status: open, awaiting your reply since 2026-08-21
summary: Kate asked for the revised quote before the renewal call. You said you would send numbers once finance confirmed the floor.
last-checked: 2026-08-28

complete: r-20260828-1600
```

**Header:** `schema`, `run`, `date`, `items`, `window start`,
`window end`. All required. **The window fields are the away window the
preview ran for**, `YYYY-MM-DD` each, because the draft opens with the
window and the pool is its only persisted input; a pool without its
window would leave a later draft, or another session, unable to say
when the absence is.

**Required per entry:** `id`, `source`, `title`, `owner`, `status`,
`summary`.

- **`id`** and **`source`** follow the snapshot's rules exactly.
- **`owner`** is a resolved `people.md` id, or the exact word
  `unresolved`, which the draft turns into a handover warning rather than
  a rejected pool.
- **`status`** is one line saying where the item stands, never blank.
- **`summary`** is at most two sentences, written at preview time, on one
  line. **Never thread content**: no quoted messages, no pasted text,
  because a frozen thread is a leak with a file name. The two-sentence
  bound is the writing skill's rule; the structural rule here is one
  non-blank line.
- `last-checked` is optional, `YYYY-MM-DD`.

**The draft refuses a pool whose marker, count, or any item's required
fields do not check out**, naming what failed, because a damaged pool
would otherwise produce a confident handover missing items. Dropping an
item in the preview **rewrites the pool with a new count and a new
marker, and only then is the removal confirmed**; dropped items cannot
reappear, because the draft never re-reads the sources.
