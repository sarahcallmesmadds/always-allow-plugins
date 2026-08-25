---
name: time-spent
description: Compare where the week actually went against the user's ranked priorities and say what to change. Runs weekly on a schedule by default. Use when the user says "where did my week go", "time spent", "did I work on what matters", "was this week worth it", "run my weekly review", or a scheduled weekly task fires. Reads the calendar only through the configured sources. Never writes anything, never sends anything, never produces a plain list of what happened.
---

# time-spent

Where the week went, held against what you said mattered. The output is a
comparison, never a diary.

The priorities are `priorities.md` and the source configuration is
`sources.md`, both at the top level of the project folder, as the contract
defines them (`../../../setup/skills/install/references/file-schemas.md`).
Both are hard stops: without priorities there is no standard, and without a
readable calendar source there is no week. `about-me.md` is optional and
supplies the timezone the windows are read in; without it, say once that
UTC is being assumed.

## When it stops

Missing, unreadable, or empty-of-entries `priorities.md` or `sources.md`
each stop this skill, named apart but **in the user's language, never the
contract's**: "you haven't confirmed any priorities yet, so there's nothing
to compare your week against. Want to set them up? I'll propose them from
what you've actually been doing." A sources file with no calendar entry
stops it the same way, naming what is missing. Never invent a priority and
never grade a week against a guess.

## The read

1. Find the calendar entries in `sources.md`. Read each through its
   connector, checking the account the connector reports against the
   entry's `account`; a mismatch is a configuration failure reported before
   anything else, not a read.
2. **The week is up to 7 days back, capped by the source's `look back`.**
   Reading past the configured window is not allowed, so a calendar set to
   `look back: 0 days` gives one day, and the output says so and names the
   fix: raise `look back` on that source entry. Never quietly widen a
   window and never call one day a week.
3. Report each source in the contract's status terms, translated to plain
   words: read fully, empty, could not verify, partial, refused, could not
   reach, unreadable. A required source in any state but the first two puts
   that fact at the top and the output is never called complete.
4. Mail and chat sources are outside this skill's reach in v1; if they are
   configured, say once that only the calendar was compared.

## The comparison

1. Match event titles against each priority's `include` and `exclude`
   terms by the contract's rules: lowercased, punctuation to spaces, whole
   words, quoted phrases in order, **no inflections**. Only titles are
   searched. Every assignment names the term that made it.
2. An event matching several priorities belongs to the highest ranked;
   ties break by id, alphabetically. Use only the part of the week on or
   after each priority's `since`, and say when that trimmed anything.
3. Time matching no priority is its own bucket, named honestly: "unmatched,
   which is not the same as wasted".
4. Open with coverage: which sources, what window, what status. Then the
   comparisons, largest gap first:
   - hours per priority against its rank, where the mismatch is the point:
     "Renewals is rank 1 and got 90 minutes; hiring is rank 2 and got nine
     hours."
   - a rank-1 priority with zero matched time this week, with its `since`
     date: standing first since July with nothing on the calendar is a
     finding.
   - the unmatched bucket, with its biggest recurring blocks named.
5. End with at most three changes worth making, each tied to one
   comparison above, then offer `prioritize` on the coming week. **This
   offer is `prioritize`'s scheduled route**; make it every run.

## The register

A claim the window cannot support is not made. Six days of data is called
six days. Titles-only matching is crude and the output says so the first
time a match looks wrong ("matched on the word 'renewal'; if that's
mis-filed, add the term to exclude"). If every priority matched nothing,
the likeliest cause is terms, not the week; say that instead of grading.

## What it does not do

- Write to any file.
- Read mail or chat, or anything except through `sources.md`.
- Produce a list of events. Anything without a comparison attached is cut.
- Judge a priority's worth. It compares time against rank; changing the
  ranks is the person's job, and `prioritize`'s to propose.

## The honest limit

This is title matching against a calendar. A week of unlabelled focus
blocks reads as unmatched, and a misleading title reads as work on a
priority it merely mentioned. The remedy is naming terms and windows in
every output so the person can correct the inputs, not confidence.
