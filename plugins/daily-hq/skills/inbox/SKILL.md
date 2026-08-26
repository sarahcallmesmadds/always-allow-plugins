---
name: inbox
description: Sorts mail and chat by what needs you. Three buckets, needs-attention first, with the reason each item is there. Use when the user says "triage my inbox", "what's in my inbox", "sort my email", "go through my messages", "what needs me", "clean this up", or a scheduled triage task fires. Reads only the sources named in sources.md, names anything it could not check, and changes no state anywhere: it never archives, never labels, never marks read, never drafts and never sends. This skill's name is a working id and may change.
---

# inbox

Your mail and chat sorted by whether they need you, with the reason on
every line. The output is a sorted read, never an action: this skill
holds a hard written rule that **it changes no state anywhere — no read
marks, no archive, no labels**, because its prior art did all three and
a sorter that acts is a different tool.

The shared machine's reading and resolution rules are
`../../references/engine.md`; the shared-file formats are the contract at
`../../../setup/skills/install/references/file-schemas.md`. If either
cannot be opened, say so; "When the references cannot be opened" then
governs. `about-me.md` and `sources.md` are hard stops: sorting by what
needs you is the whole skill, and without `my handles` there is no you.
`priorities.md` is optional: matches raise items into attention with the
matching term named, per the contract's rules; without it, the loss is
said once.

## The read

Configuration failures first, per the engine. This skill reads mail and
chat kinds; calendar and notes are named once as outside its reach. Each
source reports the contract's status, connector, range and paging; a
required source in any state but `ok` or `empty` goes first, and the
output is never called done. Claims are scoped to what was read, unread
sources named.

## The three buckets, in this order

1. **Needs attention.** Items where the evidence says you: a mention of
   you or a question to you (via `my handles`), a thread whose resolution
   state is `open` with you in it, a reply to something you wrote, a
   priority match (term named), an amount or deadline in the title.
   Every line names its reason and its resolution state, per the engine,
   with the reread done now. Ordered by resolution first (`open` before
   `answered`), then oldest first.
2. **Calendar churn.** Invitation, acceptance, decline, update and
   cancellation mail. Before anything else is said about it, sweep it and
   surface: an invitation to you that you have not answered, and the same
   person accepting two overlapping slots on the same day. State the
   latest state of a recurring series once instead of listing its every
   update. Say once that this mail is not the calendar: nothing here
   changes an event.
3. **Notification noise.** Machine mail: document tools announcing
   updates, file-share notices, meeting-notes mails, newsletters,
   digests, cold outreach, vendor promotions. Counted and named by
   category, not listed item by item, unless asked.

Every item lands in exactly one bucket, and the three counts sum to what
was read; say the total. When a rule and the evidence disagree, the item
goes up, never down: a newsletter that asks you a direct question is
attention, not noise.

## The register

Each attention line carries the load-bearing fact: the amount, the date,
who is waiting, in the item's own words but never a pasted thread.
`answered` is not done, per the engine: an answered thread that may still
need your sign-off says so. Unresolved senders are shown as unresolved;
a raw value that looks like a channel or group is "an unrecognised
group", never printed.

## What it does not do

- **Change state anywhere: no read marks, no archive, no trash, no
  labels, no flags.** Not even when asked mid-run; it says this rule and
  stops at sorting.
- Draft or send anything.
- Write any file.
- Read calendar or notes sources, or anything `sources.md` does not
  name.
- Unsubscribe from anything, or judge what should be deleted.

## The honest limit

Needs-you detection runs on handles, mentions and reply shape. A demand
written without your name in a channel you skim reads as not-yours; a
newsletter that mentions your name reads as attention. The remedy is the
named reason on every line, so a mis-sort is visible and correctable,
not confidence.

## When the references cannot be opened

Say which reference is unreadable, then run on these rules alone,
nothing looser. Sources are read only through `sources.md`; each read
reports one of `ok`, `empty`, `empty-unverified`, `partial`,
`unauthorized`, `unreachable`, `malformed`, any usable partial retrieval
being `partial`; claims are scoped to sources on `ok` or `empty`, unread
sources named. You are the handles in `about-me.md` `my handles`, and
without that file this skill stops. Three buckets in the order above,
attention lines each naming their reason, the three counts summing to
the total, and no state changed anywhere: no read marks, no archive, no
labels, nothing drafted, nothing sent.

Version: daily-hq 0.1.0, 2026-08-26.
