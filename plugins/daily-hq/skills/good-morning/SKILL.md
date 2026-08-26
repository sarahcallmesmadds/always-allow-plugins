---
name: good-morning
description: The day assembled before you sit down. Today's calendar, mail and chat read through the configured sources, compared against the last morning's snapshot, ranked by what needs you, capped at seven items. Use when the user says "good morning", "what's my day", "morning brief", "what's on today", "what changed overnight", or the daily scheduled task fires. Designed to run from the scheduled task setup hands over; it cannot create or check that task. Reads only the sources named in sources.md, names anything it could not check, writes only its own snapshot and suppression files, and never sends anything.
---

# good-morning

The morning brief: what today holds, what changed since the last one, and
what needs you first. The output is seven ranked items and their evidence,
never a diary of everything that happened.

The shared machine is `../../references/engine.md`; the working-file
formats are `../../references/own-files.md`; the shared-file formats are
the contract at `../../../setup/skills/install/references/file-schemas.md`.
If any of the three cannot be opened, say so; "When the references cannot
be opened" then governs. `people.md` and `sources.md` are hard stops.
`about-me.md` is optional, with the engine's enumerated degradation, every
loss stated in the brief.

## File states, told apart, spoken plainly

| State | `people.md` / `sources.md` | `about-me.md` | `day-snapshot.md` / `brief-feedback.md` |
|---|---|---|---|
| Missing | Stop. Say where you looked, offer setup | Continue, losses named per the engine | Continue: a first run / no suppressions, said |
| Malformed | Stop, naming the state and the plain reason together | Continue, name the loss | Treat as absent, say so; suppressions keep their readable entries |
| Semantically empty | Stop, naming the file: "no sources are configured" / "people.md holds no entries"; never a quiet day | n/a | Same as missing |
| Unknown schema version | Stop, naming it | Continue, name the loss | Treat as absent, say so |

A malformed entry in a readable file is skipped and named; the other
entries stay usable. In Claude Code, check the working files with:

```bash
node "${CLAUDE_PLUGIN_ROOT}"/scripts/verify-own.js [folder]
```

## The window

Today plus each source's own `look back` / `look ahead`, in the
`about-me.md` timezone, per the contract: the range always includes
today. Reading past a source's window is not allowed, with the engine's
one stated exception: relationship history from the calendar sources,
feeding rank 3 alone, never adding items, said once when used. The
brief names the dates each source actually covered.

## The read

1. Configuration failures come first, outside the statuses, per the
   engine: an `account` mismatch, or a required source whose kind this
   skill cannot handle, stops the run and says so. This skill reads
   calendar, mail, chat and notes kinds.
2. Read each source per the engine, and report each with the contract's
   status and a plain phrase beside it, naming connector, range, and
   whether paging finished. The engine's positive-evidence rules decide
   `empty` against `empty-unverified`.
3. A required source in any state but `ok` or `empty` goes at the top of
   the brief, and the brief is never called quiet. The quiet-day claim is
   always scoped to what was read: sources not read are named as
   unchecked, and kinds outside this skill's reach are named once.

## The brief

1. Build the item records per the engine: dedup across sources, prep and
   relationship evidence, change since the snapshot, resolution states.
2. Rank per the engine's table and cap at seven. Warnings, the day's
   shape and the read-files line are not items. Every rank 1 item names
   its signals ("no agenda, nothing attached"); every cut names its kind,
   source and what it needed.
3. Output, in this order every run: anything broken (required-source
   failures, a failed write from this run); the day's shape (timed items
   in start order, one line each); the seven items with their evidence;
   changes since the snapshot, always naming the base and its age
   ("changes since Friday, 3 days ago"), or the first-run line; cuts;
   the sources-read report with the covered dates; one concrete cited
   value per shared file that passed its whole validation.
4. A missing snapshot is a first run: no change claims, one line saying
   change detection starts tomorrow. Change classification uses connector
   evidence only as far as it goes, per the engine: an update timestamp
   alone is `changed`, never `moved`; absence proves cancellation only
   when the read completely covered the event's old slot.

## Suppressions

Honour every readable entry in `brief-feedback.md`: a suppressed item or
series is left out of the brief. When the person says an item should stop
appearing ("stop showing me this", "mute that series"), confirm which
item, then append the entry per `own-files.md` and rewrite the file with
its new count and marker. This skill alone maintains the counters, per
`own-files.md`: increment only when the entry's source was checked
completely, reset on any match, and at 14 consecutive misses say once
"this suppression matches nothing, possible typo" and mark it reported.

## The snapshot write

After the brief, write today's `day-snapshot.md` per `own-files.md`:
calendar events with resolved participants, the run id, the count, the
marker last. Re-read it and check marker and count before claiming
success. **A failed write is reported in this morning's brief**, not
discovered as silence tomorrow.

## The register

A claim the covered dates cannot support is not made. With less than 90
days of history, rank 3 lines read "first time in the N days of records",
never "first time in 90". The prep signals are coarse and the brief says
which one fired rather than judging content. An unresolved participant is
shown as unresolved; a raw value that looks like a channel or group is
"an unrecognised group", never printed.

## What it does not do

- Save the brief unless asked. Shown, not stored.
- Send anything, to anyone, ever.
- Create or edit any shared file. Its own two working files are the only
  things it writes.
- Read any external source `sources.md` does not name.
- Change read, archive or label state on anything.

## The honest limit

The ranking runs on absence signals and calendar metadata, not on
understanding your day. A parking map attached to a real meeting defeats
the prep signal, and a misleading title reads as its words. The remedy is
naming the signal and the source on every item so the person can judge,
not confidence.

## When the references cannot be opened

Say which reference is unreadable, then run on these rules alone, nothing
looser. Sources are read only through `sources.md`; each read reports one
of `ok`, `empty`, `empty-unverified`, `partial`, `unauthorized`,
`unreachable`, `malformed`, where any usable partial retrieval is
`partial` and zero items without positive evidence of a completed read is
`empty-unverified`. "Nothing needs you" is said only of a source on `ok`
or `empty`, and unread sources are named. Ranks: 1 calendar items lacking
both agenda text and attachment, where the connector supports both
fields; 2 moved, cancelled or new since the snapshot; 3 a resolved
participant last seen more than 90 days back, or never, counting only
events with 20 or fewer attendees; 4 everything else; cap seven, ties by
start time, cuts named with kind, source and what each needed. The
snapshot compares against the most recent successful one, named with its
age; missing or invalid means a first run, said; the new snapshot ends
with a `complete:` marker matching its `run:` line and an `items:` count
matching its entries, re-read after writing, failures reported now.
Resolution states are `open`, `answered`, `closed-by-you`, `unknown`;
precedence when evidence conflicts is `closed-by-you`, then `answered`,
then `open`, anything unreadable `unknown`; a qualifying reply is from a
person who is not you, not a bot, not a shared entry; reactions and
edits are not replies; calendar and notes items carry `unknown` with the
reason said.

Version: daily-hq 0.1.3, 2026-08-26.
