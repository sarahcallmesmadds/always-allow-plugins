---
name: give-me-feedback
description: Honest feedback on how the user works, held against a standard they set: a finished project, or one dimension like "how am I doing at delegating". A bare "how was my week" belongs to time-spent, not here; this skill needs a project, dimension or standard named. Designed to run monthly from the scheduled task setup hands over, taking the dimension from what they said they are trying to get better at; it cannot create or check that task. Use when the user says "give me feedback", "how did I do on X", "be honest about how that went". Asks guiding questions where the data is thin. Never writes, never sends, never grades against a standard the user did not set.
---

# give-me-feedback

Feedback against a standard you set, from evidence, with the gaps named.
Where the evidence runs out it asks instead of asserting, because a
guiding question beats a confident guess.

The contract is at
`../../../setup/skills/install/references/file-schemas.md`. If it cannot
be opened, say so; the section "When the contract cannot be opened" then
governs. **No file is a hard stop here; a source configuration failure is.**
`about-me.md` supplies the standing dimension, "what I am trying to get
better at", and the timezone. `priorities.md` supplies what mattered.
`sources.md` supplies the evidence.

For each optional file: missing means the loss is named once; a file that
will not read per its shape (malformed, said with the plain reason), or
claims a schema version this text does not know, is set aside whole with
the loss named, never half-read; semantically empty means it has nothing
to offer, said once; a malformed entry is skipped by name while the rest
stays usable.

## When the contract cannot be opened

Say so, then run on these rules alone, nothing looser. Schema 1 is the
only version this text knows. Every file opens with `schema:` then
`last confirmed:` as its first two lines, and any `last confirmed`,
file-level or entry-level, older than 90 days is called stale once. An
entry runs from one `id:` line to the next. Keys this text knows:
priorities entries require `id`, `rank`, `since`, `include`,
`last confirmed` and may carry `exclude`; sources entries require `id`,
`kind`, `account`, `required for`, `last confirmed` and at least one of
`look back` / `look ahead` (a calendar source needs `look ahead`), and
may carry `read`, `skip`, `except`; `about-me.md` requires `name`,
`role`, `timezone` and may carry `company`, `working hours`,
`my handles`. `note:` is the person's own
space and is never reported; any other unknown key is kept and reported
once per file. A required key missing or blank malforms that entry, not
the file.

## Picking the standard

1. **Monthly run:** the dimension is what `about-me.md` says they are
   trying to get better at. If that file or line is absent, say so and ask
   for the dimension in one line rather than inventing one.
2. **A finished project:** the standard is what they wanted from it. Ask
   for it in one line if it is not stated, and hold the evidence against
   that, not against a generic idea of a good project.
3. **One dimension, on demand:** taken as asked.
4. **A bare "how was my week"** is routed to `time-spent`, every time.

The standard is always named at the top of the output. Feedback against an
unstated standard is opinion, and this skill does not deal in it.

## The evidence

1. Before reading a source, compare the identity the connector reports
   against its `account`; a mismatch, or no identity, is a configuration
   failure: stop and say so, outside the read statuses. The same goes for
   a source naming this skill in its `required for` whose kind it cannot
   handle, stopped before reading. Report each source read with the
   contract's status label and a plain phrase: `ok` (checked
   successfully), `empty`, `empty-unverified`, `partial` (data then a
   failure is partial, not unreachable), `unauthorized`, `unreachable`,
   `malformed`, naming connector, range, whether paging finished, and any
   error. Open with coverage: which sources, the exact dates each covered
   within its window, what was not checked.
   **A claim the covered dates cannot support is not made.** Two days of
   chat is two days of chat.
2. Look for evidence that bears on the standard, cited: on delegating,
   the meetings they organised against the ones they attended; on a
   project, the gap between its stated want and what the record shows.
   **A claim about who said or did what is made only when the person is
   verified**, by `my handles` or an identity the connector reports; a
   display name is not identity, and unverifiable evidence is omitted,
   with the omission named.
3. With no sources readable, the run does not die: it becomes the
   interview. Say what could not be read, then ask the two or three
   questions the data would have answered.

## The shape of the output

1. The standard, in one line.
2. Coverage, in one line.
3. At most three findings, each **a comparison against the standard**
   with its evidence cited: "you said delegation; all eleven meetings
   this week were ones you organised" is a finding, "you had eleven
   meetings" is not. Findings are ordered by how much cited evidence
   stands behind each; ties follow the order sources appear in
   `sources.md`, then date order.
4. Two or three guiding questions where the evidence is thin, the
   daily-dr shape: aimed at what the data cannot show, not restating what
   it can.
5. One suggested change, tied to a finding, phrased as something to try
   before the next run, not a verdict on character.

## What it does not do

- Write to any file. What they decide to change is theirs to record.
- Read `wins.md`. That record belongs to the `wins` skill alone.
- Send anything, or gather feedback from other people. This is their data
  held against their standard, not a survey.
- Grade personality. The unit is a work pattern with evidence, never a
  trait.
- Take the weekly ledger. The week-against-priorities comparison is
  `time-spent`'s, and a bare weekly ask goes there.

## The honest limit

A month of source windows rarely covers a month: the read is capped by
each source's `look back`, and the output says what it actually saw. The
questions exist because the most important evidence, what happened in the
room, is not in any connector.
