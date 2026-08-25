---
name: give-me-feedback
description: Honest feedback on how the user works, held against a standard they set: a finished project, or one dimension like "how am I doing at delegating". Runs monthly on a schedule by default, taking the dimension from what they said they are trying to get better at. Use when the user says "give me feedback", "how did I do on X", "be honest about how that went", "review how I worked", or the monthly task fires. Asks guiding questions where the data is thin. Never writes, never sends, never grades against a standard the user did not set.
---

# give-me-feedback

Feedback against a standard you set, from evidence, with the gaps named.
Where the evidence runs out it asks instead of asserting, because a
guiding question beats a confident guess.

The contract is at
`../../../setup/skills/install/references/file-schemas.md`. Nothing here
is a hard stop; every file is optional and every absence is a named loss.
`about-me.md` supplies the standing dimension, "what I am trying to get
better at", and the timezone. `priorities.md` supplies what mattered.
`sources.md` supplies the evidence, read over its configured windows with
accounts checked and statuses reported in plain words.

## Picking the standard

1. **Monthly run:** the dimension is what `about-me.md` says they are
   trying to get better at. If that file or line is absent, say so and ask
   for the dimension in one line rather than inventing one.
2. **A finished project:** the standard is what they wanted from it. Ask
   for it in one line if it is not stated, and hold the evidence against
   that, not against a generic idea of a good project.
3. **One dimension, on demand:** taken as asked.

The standard is always named at the top of the output. Feedback against an
unstated standard is opinion, and this skill does not deal in it.

## The evidence

1. Read what the configured sources cover, capped by their windows, and
   open with coverage: which sources, what span, what status, what was not
   checked. **A claim the window cannot support is not made.** Two days of
   chat is two days of chat.
2. Look for evidence that bears on the standard, cited: on delegating, the
   meetings they organised against the ones they attended, the threads
   where they answered questions someone else owned; on a project, the gap
   between its stated want and what the record shows happening.
3. With no sources readable, the run does not die: it becomes the
   interview. Say what could not be read, then ask the two or three
   questions the data would have answered.

## The shape of the output

1. The standard, in one line.
2. Coverage, in one line.
3. At most three findings, each **a comparison against the standard** with
   its evidence cited: "you said delegation; all eleven meetings this week
   were ones you organised" is a finding, "you had eleven meetings" is
   not.
4. Two or three guiding questions where the evidence is thin, the
   daily-dr shape: aimed at what the data cannot show, not restating what
   it can.
5. One suggested change, tied to a finding, phrased as something to try
   before the next run, not a verdict on character.

If `wins.md` exists and bears on the standard, its entries count as
evidence, read per its schema, a thin record called thin.

## What it does not do

- Write to any file. What they decide to change is theirs to record.
- Send anything, or gather feedback from other people. This is their data
  held against their standard, not a survey.
- Grade personality. The unit is a work pattern with evidence, never a
  trait.
- Overlap `time-spent`. The week-against-priorities comparison lives
  there; when asked for "feedback on my week", run the standard-based pass
  and point at `time-spent` for the time ledger.

## The honest limit

A month of source windows rarely covers a month: the read is capped by
each source's `look back`, and the output says what it actually saw.
The questions exist because the most important evidence, what happened in
the room, is not in any connector.
