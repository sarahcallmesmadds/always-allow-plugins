---
name: wins
description: Find what actually went well, confirm it with the user in their words, and append it to the running wins record. Designed to run from the weekly scheduled task setup hands over; it cannot create or check that task. Also invoked directly with "log a win", "what went well", "add this to my wins", "wins this week", including a win about someone else. The only skill allowed to write to wins.md. Appends only entries the user has confirmed; never edits or deletes an old entry.
---

# wins

What actually went well, written down, so three months from now there is
evidence instead of a feeling.

The record is `wins.md` and this skill is its **only automated writer**,
per the contract
(`../../../setup/skills/install/references/file-schemas.md`). If the
contract cannot be opened, say so and do only what this text itself
specifies, nothing more. `people.md`, `sources.md` and `about-me.md`
(timezone) are optional; each one absent is named once as a loss, not a
stop.

## Record states, told apart, spoken plainly

- **Missing:** stop. Say where you looked, then point at setup, or offer
  the by-hand route, a file holding the two header lines.
- **Malformed, or an unknown schema version:** never append. Name what is
  wrong in plain words, show the confirmed entry as a paste-safe block so
  nothing is lost, and say the file needs fixing by hand first. Never
  tell anyone to paste into a broken file.
- **Header only:** the newborn state, valid, appended to like any other.
- **One malformed entry:** the rest of the record stays readable; the
  broken entry is named and left alone.

## Finding the candidates

1. On the weekly run, read the configured sources. Before reading one,
   compare the identity the connector reports against the entry's
   `account`; a mismatch, or no identity, is a configuration failure that
   stops the run and says so. Report each source with the contract's
   status label and a plain phrase: `ok` (checked successfully), `empty`,
   `empty-unverified`, `partial` (data then a failure is partial, not
   unreachable), `unauthorized`, `unreachable`, `malformed`. The span
   read is the 7 dates ending today in the configured timezone,
   intersected per source with its `look back`, the actual dates printed.
2. Look for evidence, not adjectives: the thing that closed early, the
   thread that ended in a yes, the deadline that passed quietly. **A
   claim about who said or did something is made only when the person is
   verified**, by `my handles` in `about-me.md` or an identity the
   connector reports; a display name is not identity, and unverifiable
   evidence is dropped, not guessed at.
3. Every candidate cites where it came from. No source reachable, or the
   user invoked this directly with a win in hand, then the candidates are
   whatever they tell you; the record is the point, not the scavenging.
4. A win about another person is a win. If the person matches a
   `people.md` entry, offer the link; never guess an identity from a
   display name.

## Confirming and writing

1. Show each candidate one at a time and ask: is this real, and how would
   you say it? **The entry is written in their words once corrected.**
   Dropped candidates are dropped without argument.
2. Show the exact entry before writing, per the contract's schema: a `w-`
   id slugged from the win, `date` when it went well, `win` on one line,
   `person` only when confirmed against `people.md`, `last confirmed`
   today.
3. **The write is one uninterrupted pass**: re-read the whole file,
   validate it, settle the id against exactly what was just read (a taken
   id gets `-2`, then `-3`, chosen here and nowhere else), append at the
   end, then immediately re-read and confirm the file still reads clean
   and holds the new entry exactly once. If that last check fails, show
   what the file now holds and the entry text for safe keeping, and do
   not retry silently. Nothing between the re-read and the append but the
   append.
4. **Never edit or delete an old entry**; a correction is a new entry
   saying so. Where a file cannot be written from here, hand the entry
   back as a paste block, but only after that same fresh re-read came
   back clean.

## Reading the record back

The read-back sticks to what the entries literally hold: `date`, `win`
text, `person` links. It may count exact words and phrases across entries
after the contract's normalisation ("the word 'Meridian' appears in six
of eight entries") and group by linked person or by month. It does not
infer clients, projects or priorities from prose, and it does not open
`priorities.md`, which it has no right to read. **A thin record is called
thin**: two entries are "two entries", never a trend. A week with no
entry gets exactly "no entry exists for that period"; whether that week
was quiet, skipped, or never run is unknowable from the record and is
never guessed.

## What it does not do

- Write to any file except `wins.md`, or one byte of it uninvited.
- Manufacture a win. Saying "no wins surfaced this week" is a valid,
  honest run, and it leaves no entry behind.
- Rank or judge. `time-spent` compares the week; this one keeps the
  evidence.
- Report a win about a person to that person. Nothing here is sent.

## The honest limit

Week one has an empty record and says so. The value compounds: the tenth
week can say what the first cannot, and only if the entries are the
user's own words rather than generated praise, which is why every entry
passes through their hands on the way in.
