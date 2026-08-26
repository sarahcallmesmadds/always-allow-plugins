---
name: catch-me-up
description: You were away. Only what still needs you. Reads the configured sources over the away window, shows open items first, then what was answered while you were out and may still need your sign-off, then what changed. Use when the user says "catch me up", "I'm back", "I was out", "what did I miss", "back from vacation", "what happened while I was away", or asks for a debrief since a date. Finds the away window from the calendar before ever asking for dates. Reads only the sources named in sources.md, names anything it could not check, writes nothing, and never sends anything.
---

# catch-me-up

The return brief: what still needs you after time away, not a replay of
everything that happened. Open items first, because a teammate's
"approved" while you were out can hide a decision that was actually
yours.

The shared machine is `../../references/engine.md`; the working-file
formats are `../../references/own-files.md`; the shared-file formats are
the contract at `../../../setup/skills/install/references/file-schemas.md`.
If any cannot be opened, say so; "When the references cannot be opened"
then governs. `people.md` and `sources.md` are hard stops; `about-me.md`
is optional, with the engine's enumerated degradation, every loss stated.
`day-snapshot.md` and `brief-feedback.md` are read if present and never
written: this skill honours suppressions and touches no counter.

## File states, told apart

The table in `good-morning` governs here identically, with one
difference: this skill treats both working files as read-only, so a
failed write state is only ever reported, never repaired.

## The away window

1. A window the person states wins, in dates or plain words ("last Monday
   to Friday"), resolved in the `about-me.md` timezone and read back to
   them.
2. Otherwise look before asking, per this marketplace's first rule: scan
   the configured calendar sources for events whose titles say away
   (out of office, OOO, PTO, vacation, leave) and whose end falls within
   the last 7 days. Exactly one match: **the window runs from that
   event's start to now**, so the whole absence is covered, said aloud.
   Several: list them and ask which. None: say the calendar showed none,
   then ask for the dates.
3. A calendar that cannot be read is named with its status; the fallback
   to asking is stated, never silent.
4. The brief always names its window: start, end, and the day count.

## The read

As `good-morning`'s read, over the away window intersected with each
source's own `look back` (reading past a source's window is not
allowed, apart from the engine's one stated exception for relationship
history, and when the away window is longer than a source's
`look back`, the brief says which days of that source it could not
cover and names the fix).
Configuration failures first; the contract's seven statuses per source;
required-source failures at the top; the quiet-day claim scoped to what
was read, unread sources named.

## The brief

Build item records per the engine: dedup, resolution states with the
reread done now, change since the snapshot where one exists. Rank them
per the engine and apply the engine's cap: **at most seven items in the
whole brief, whatever group each lands in**, cuts named per the engine.
The groups below are how the seven surviving items are presented, in
this order every run:

1. Anything broken: required-source failures, a window the sources could
   not fully cover. Not items; never capped.
2. **Open items**: resolution `open`, plus anything awaiting your reply,
   ranked per the engine.
3. **Answered while you were away, may still need your sign-off**:
   membership is exactly the engine's rule, the qualifying reply's
   timestamp falls inside the away window. A thread answered before the
   trip is plain `answered` and appears in neither group. This group is
   never hidden and never folded into the open items; when the cap cuts
   from it, the cut lines say so.
4. **Changes since the snapshot**, when a valid snapshot exists, always
   naming the base and its age; without one, one line saying change
   detection has no base, never a guess. Calendar and notes items belong
   here and only here: their resolution state is `unknown` by kind, per
   the engine, and they never repeat in group 5.
5. Mail and chat items whose threads could not be re-read now, said as
   `unknown` with the reason.
6. The sources-read report with covered dates, then one concrete cited
   value per shared file that passed its whole validation. Not items.

An all-empty window is said plainly with the window named; it is a
scoped quiet claim, never proof the time away was quiet.

## The register

As `good-morning`'s: no claim the covered dates cannot support,
unresolved participants shown as unresolved, an unrecognised group never
printed, the 90-day wording honest about short histories.

## What it does not do

- Write anything: no snapshot, no counters, no files, no state.
- Send anything.
- Read any external source `sources.md` does not name.
- Change read, archive or label state on anything.
- Replay content. Items say what needs you, with sources cited; they do
  not paste threads.

## The honest limit

Resolution states run on replies the connectors can re-read now. A
decision made in a meeting, a hallway yes, or a thread the connector
cannot fetch again all read as `open` or `unknown`; the brief says which
evidence it had. The away window from calendar titles is a guess the
person confirms, not a fact.

## When the references cannot be opened

Say which reference is unreadable, then run on these rules alone, nothing
looser. Sources are read only through `sources.md`; each read reports one
of `ok`, `empty`, `empty-unverified`, `partial`, `unauthorized`,
`unreachable`, `malformed`, any usable partial retrieval being `partial`;
quiet claims are scoped to sources on `ok` or `empty`, unread sources
named. Resolution states are `open`, `answered`, `closed-by-you`,
`unknown`; precedence when evidence conflicts is `closed-by-you`, then
`answered`, then `open`, anything unreadable `unknown`; each thread is
judged by rereading it now;
a qualifying reply is from a person who is not you, not a bot, not a
shared entry, and a reaction or an edit is not a reply; the
answered-while-away group holds exactly the threads whose latest
qualifying reply falls inside the away window. Open items first, at
most seven items in the whole brief whatever group each lands in, cuts
named with kind, source and what each needed; the window and every
source's covered dates are always named; nothing is written or sent.

Version: daily-hq 0.1.3, 2026-08-26.
