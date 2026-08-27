---
name: loose-ends
description: Raised and never closed, and how long ago. Reads the configured mail and chat sources for questions and requests that never got an answer, and lists them oldest first with their age. Use when the user says "loose ends", "what's still open", "what never got answered", "what fell through the cracks", "open loops", or a weekly scheduled task fires. Reads only the sources named in sources.md, names anything it could not check, writes nothing, changes nothing, and never sends anything.
---

# loose-ends

The list of things somebody asked for that nobody ever answered, with how
long each has been waiting. Oldest first, because the oldest is the one
everybody has stopped seeing.

The shared machine is `../../references/engine.md`; the shared-file
formats are the contract at
`../../../setup/skills/install/references/file-schemas.md`. If either
cannot be opened, say so; "When the references cannot be opened" then
governs. `sources.md` is a hard stop. `priorities.md` is optional: with
it, matched loose ends group under their priorities, each match naming
its term per the contract's rules; without it, one flat list, and the
loss is said once.

## What this skill cannot know, said up front

This skill does not read `people.md` or `about-me.md`. So it cannot tell
which loose ends are yours, cannot tell a person from a rota address, and
cannot detect your own replies. It lists what is open in the sources,
whoever raised it, and says this limit once per run. "What needs you" is
`inbox`'s question and `catch-me-up`'s; this skill's question is what
never closed at all.

## What counts as a loose end, exactly

- **Raised**: a message in a configured mail or chat source, inside the
  source's own window, that asks for something: a question, or a request
  directed at someone. The line quotes nothing; it names the thread,
  the source, the date, and who raised it as the source shows them.
- **Closed**: a later reply in the thread **from a different author than
  the raise**, compared by the source's own author values, so a raiser's
  "any update?" follow-up never closes their own ask, and excluding
  anything the connector itself marks as a bot. Judged by rereading the
  thread now. **This is deliberately weaker than the engine's
  qualifying-reply rule**, which needs the identity map this skill does
  not read: it cannot exclude a rota address or an unmarked bot, and the
  run says that limit once, never claiming the engine's standard.
- **A reaction never closes a loose end, and neither does an edit.** When
  the only activity since the raise is a reaction, the line says
  "acknowledged with a reaction only".
- A thread the source cannot re-read now is `unknown`, listed separately
  as unknown, never counted as open or closed.
- Age is whole days since the raise, in dates the run states. With
  `priorities.md` present, a priority's `since` trims what is compared
  against that priority, said when it trims.

## The read

Configuration failures first, per the engine: an `account` mismatch or a
required source of a kind this skill cannot handle stops the run. This
skill reads mail and chat kinds; calendar and notes are named once as
outside its reach. Each source reports the contract's status with
connector, range and paging named; a required source in any state but
`ok` or `empty` goes first, and the output is never called clean. The
claim "nothing is open" is scoped to what was read, unread sources named.

## The list

1. Open loose ends, oldest first, one line each: age, who raised it,
   what it asks, thread and source. Fifteen or fewer: all of them. More:
   the oldest fifteen, then one line per source naming how many more
   ("s-team-chat holds 9 more"), never a bare total.
2. Unknown items, listed as unknown with the reason.
3. The sources-read report with covered dates, then one concrete cited
   value per shared file that passed its whole validation.

## The register

An old ask is not called ignored, forgotten or dropped; it is called
unanswered, with its age, because this skill can see replies and cannot
see hallways. A source window shorter than the question deserves is
named: "chat covers 2 days; older chat loose ends are invisible here."

## What it does not do

- Write anything, anywhere. No file, no state, no counters.
- Send anything, remind anyone, or nag anyone.
- Change read, archive or label state on anything.
- Read calendar or notes sources, or anything `sources.md` does not name.
- Judge whether an unanswered ask still matters. It shows the age; the
  person judges.

## The honest limit

A question answered in a meeting, in a DM this skill cannot see, or by a
document changing reads as open here. The remedy is the line naming its
evidence, thread and window, so a false open is checkable in one click,
not confidence.

## When the references cannot be opened

Say which reference is unreadable, then run on these rules alone,
nothing looser. Sources are read only through `sources.md`; each read
reports one of `ok`, `empty`, `empty-unverified`, `partial`,
`unauthorized`, `unreachable`, `malformed`, any usable partial retrieval
being `partial`; claims are scoped to sources on `ok` or `empty`, unread
sources named. A loose end is a question or request with no later reply
in its thread from a different author than the raise, judged by
rereading the thread now; connector-marked bots do not close; reactions
and edits are not replies; unreadable threads are `unknown`, listed
separately. Oldest first, fifteen shown, the rest counted per source.
Nothing is written or sent.

Version: daily-hq 0.1.7, 2026-08-27.
