---
name: wins
description: Find what actually went well, confirm it with the user in their words, and append it to the running wins record. Runs weekly on a schedule by default; also invoked directly with "log a win", "what went well", "add this to my wins", "wins this week", including a win about someone else. The only skill allowed to write to wins.md. Appends only entries the user has confirmed; never edits or deletes an old entry.
---

# wins

What actually went well, written down, so three months from now there is
evidence instead of a feeling.

The record is `wins.md` at the top level of the project folder, and this
skill is its **only automated writer**, as the contract defines
(`../../../setup/skills/install/references/file-schemas.md`). The record
missing is the hard stop: say where you looked, then point at setup, or
offer the by-hand route, a file holding the two header lines. `people.md`,
`sources.md` and `about-me.md` (timezone) are optional; each one absent is
named once as a loss, not a stop.

## Finding the candidates

1. On the weekly run, read the configured sources over their windows,
   accounts checked, statuses reported in plain words, the week capped by
   each source's `look back` and the cap said aloud. Look for evidence,
   not adjectives: the thing that closed early, the thread that ended in a
   yes, the deadline that passed quietly, the person who repeated the
   user's idea back as the plan.
2. Every candidate cites where it came from. No source reachable, or the
   user invoked this directly with a win in hand, then the candidates are
   whatever they tell you; the record is the point, not the scavenging.
3. A win about another person is a win: "for you or anyone". If the person
   matches a `people.md` entry, offer the link; never guess an identity
   from a display name.

## Confirming and writing

1. Show each candidate one at a time and ask: is this real, and how would
   you say it? **The entry is written in their words once corrected.**
   Dropped candidates are dropped without argument.
2. Show the exact entry before writing, per the contract's schema: a `w-`
   id slugged from the win, `date` when it went well, `win` on one line,
   `person` only when confirmed against `people.md`, `last confirmed`
   today.
3. Before appending, re-read the whole file: ids are unique file-wide and
   hand edits happen. A clash gets a new id, and a file that will not read
   per its shape is named in plain words and left alone rather than
   appended to.
4. Append at the end. **Never edit or delete an old entry**; a correction
   is a new entry saying so. Where a file cannot be written from here,
   hand the entry back as a paste block and say where it goes.

## Reading the record back

When asked what has gone well lately, the answer is a comparison, not a
recitation: the run of weeks with nothing recorded, the same client named
in every entry since June, the wins clustering under one priority while
the top-ranked one has none. **A thin record is called thin**: two entries
are "two entries", never a trend.

## What it does not do

- Write to any file except `wins.md`, or one byte of it uninvited.
- Manufacture a win. A quiet week is recorded as nothing, and saying "no
  wins surfaced this week" is a valid, honest run.
- Rank or judge. `time-spent` compares the week; this one keeps the
  evidence.
- Report a win about a person to that person. Nothing here is sent.

## The honest limit

Week one has an empty record and says so. The value compounds: the tenth
week can say what the first cannot, and only if the entries are the
user's own words rather than generated praise, which is why every entry
passes through their hands on the way in.
