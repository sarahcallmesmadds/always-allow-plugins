---
name: time-spent
description: Compare where the week actually went against the user's ranked priorities and say what to change. Owns every bare weekly-review ask. Use when the user says "where did my week go", "how was my week", "time spent", "did I work on what matters", "was this week worth it", "run my weekly review", or the weekly task fires. Designed to run from the weekly scheduled task setup hands over; it cannot create or check that task. Reads the calendar only through the configured sources. Never writes anything, never sends anything, never produces a plain list of what happened.
---

# time-spent

Where the week went, held against what you said mattered. The output is a
comparison, never a diary. A bare "how was my week?" belongs here;
`give-me-feedback` takes over only when a project, dimension or standard is
named.

The contract is `../../../setup/skills/install/references/file-schemas.md`.
If it cannot be opened, say so; the section "When the contract cannot be
opened" then governs. `priorities.md` and `sources.md` are hard stops; `about-me.md`
is optional and supplies the timezone, and without it say once that UTC is
assumed.

## File states, told apart, spoken plainly

| State | `priorities.md` / `sources.md` | `about-me.md` |
|---|---|---|
| Missing | Stop. Say where you looked, offer setup | Continue, UTC assumed, said once |
| Malformed (file will not read per its shape) | Stop. Name the state and the plain reason together: "malformed: two entries share the same id" | Continue, name the loss |
| Semantically empty (header, no entries) | Stop: "you haven't confirmed any priorities yet" / "no sources are configured" | n/a |
| Unknown schema version | Stop: "this file says it's a newer version than I know how to read" | Continue, name the loss |

**A malformed entry is skipped and named; the file's other entries stay
usable.** Only a file that will not read at all stops the run. Never invent
a priority and never grade a week against a guess.

## When the contract cannot be opened

Say so, then run on these rules alone, nothing looser. Schema 1 is the
only version this text knows. Every file opens with `schema:` then
`last confirmed:` as its first two lines, and any `last confirmed`,
file-level or entry-level, older than 90 days is called stale once. An
entry runs from one `id:` line to the next. Keys this text knows:
priorities entries carry `id`, `rank`, `since`, `include`, `exclude`,
`last confirmed`; sources entries carry `id`, `kind`, `account`,
`required for`, `look back`, `look ahead`, `read`, `skip`, `except`,
`last confirmed`; `about-me.md` carries `name`, `role`, `company`,
`timezone`, `working hours`, `my handles`. `note:` is the person's own
space and is never reported; any other unknown key is kept and reported
once per file, because a typo like `exlude:` must not vanish. A required
key missing or blank malforms that entry, not the file.

## The week, exactly

The week is the 7 calendar dates ending today, in the configured timezone.
For each source, intersect that with its own window: reading past a
source's `look back` is not allowed, so a calendar set to `look back: 0
days` contributes one date, the output prints the exact dates each source
covered, and the fix is named (raise `look back` on that entry). Sources
covering different spans are never merged as if equal; each comparison
names the span it rests on.

## The read

1. Calendar entries in `sources.md` are this skill's reach. A **required**
   source (this skill in its `required for`) whose kind it cannot handle
   stops the run before any reading. Mail, chat and notes kinds are named
   once as outside reach.
2. Before reading a source, compare the identity the connector reports
   against the entry's `account`. A mismatch, or no identity to compare,
   is a configuration failure: the run stops and says so, outside the
   read statuses.
3. Report every source read with the contract's status label and a plain
   phrase beside it: `ok` (checked successfully), `empty`,
   `empty-unverified` (nothing came back and the read could not be
   confirmed), `partial` (stopped early; data then a failure is partial,
   not unreachable), `unauthorized`, `unreachable`, `malformed`. Name
   connector, range and whether paging finished. A required source in any
   state but `ok` or `empty` goes first and the output is never called
   complete.

## The comparison

1. Match event titles against each priority's `include` and `exclude` by
   the contract's rules: lowercased, punctuation to spaces, whole words,
   quoted phrases in order, **no inflections**, titles only. **An entry's
   `exclude` blocks that entry only**, and when include and exclude both
   match within one entry the item is excluded there and the output
   records that it was. Every assignment names its term, and when several
   terms in the same entry match, every one of them.
2. An event matching several priorities belongs to the highest ranked;
   ties break by id, alphabetically. Overlapping events count their
   overlapped time once, toward the higher-ranked match; all-day events
   count zero hours and are listed separately. Use only the part of the
   week on or after each priority's `since`, and say when that trimmed
   anything.
3. Output, in this order every run: the covered dates per source; each
   priority in rank order with matched hours and terms; the two fixed
   callouts, the highest-ranked priority with zero matched hours (if any)
   and any lower-ranked priority with more hours than rank 1 (if any);
   the unmatched bucket ("unmatched, which is not the same as wasted"),
   naming any block recurring on two or more distinct dates under the
   same normalised title.
4. End with at most three changes, each tied to one comparison above, in
   the rank order of the priorities they concern, then offer `prioritize`
   on the coming week. **That offer is `prioritize`'s scheduled route**;
   make it every run.

## The register

A claim the covered dates cannot support is not made; six days is called
six days. Title matching is crude and the output says so the first time a
match looks wrong ("matched on the word 'renewal'; if that's mis-filed,
add the term to exclude"). If every priority matched nothing, the likelier
cause is terms, not the week; say that instead of grading.

## What it does not do

- Write to any file.
- Read mail, chat or notes, or anything except through `sources.md`.
- Produce a list of events. Anything without a comparison attached is cut.
- Judge a priority's worth. It compares time against rank; changing ranks
  is the person's job, and `prioritize`'s to propose.

## The honest limit

This is title matching against a calendar. A week of unlabelled focus
blocks reads as unmatched, and a misleading title reads as work on a
priority it merely mentioned. The remedy is naming terms, dates and
windows in every output so the person can correct the inputs, not
confidence.
