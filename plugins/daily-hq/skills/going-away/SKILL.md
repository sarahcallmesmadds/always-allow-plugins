---
name: going-away
description: What is in flight, who covers what, drafted. Before time away, reads the configured sources for what will still be moving while the user is out, proposes an owner per item, and drafts the handover for the user to send themselves. Use when the user says "going away", "I'm out next week", "prep my handover", "who covers what", "I'm on vacation from Friday", or an out-of-office calendar event is coming up. Two steps, preview then draft, with a working pool file between them. Reads only the sources named in sources.md, writes only its own pool file, and never sends anything.
---

# going-away

The handover, built in two steps: a **preview** that reads the sources
and freezes what is in flight into a pool the person can prune, then a
**draft** written only from that pool. The split exists so pruning is
real: a dropped item cannot sneak back, because the draft never re-reads
the sources.

The shared machine is `../../references/engine.md`; the pool format is
`../../references/own-files.md`; the shared-file formats are the contract
at `../../../setup/skills/install/references/file-schemas.md`. If any
cannot be opened, say so; "When the references cannot be opened" then
governs. `about-me.md`, `people.md` and `sources.md` are hard stops.
`voice.md` is optional and rules the draft's wording per the contract's
confidence table; its absence or `absent` confidence is said, and the
draft is written plainly.

## The away window

As `catch-me-up` finds it, looking before asking: a stated window wins;
otherwise the calendar sources are scanned for an upcoming away event
(out of office, OOO, PTO, vacation, leave); several candidates are
listed to pick from; none found is said before asking for dates. The
window is read back before anything is written.

## Step one: the preview, and the pool

1. Read the sources per the engine: configuration failures first, the
   contract's status per source, claims scoped to what was read. This
   skill reads calendar, mail, chat and notes kinds.
2. **In flight is exactly this**: a calendar event inside the away
   window from a configured calendar source, except those its `skip:`
   prose excludes, **and except the away events themselves** (the event
   that set the window, and any event whose title says away in the same
   terms the window scan uses); and a mail or chat thread, inside its
   source's window, whose resolution state is `open`, or `answered`
   where the latest word is not yours. A calendar event is a candidate
   because it will happen without you, which is a fact, not a claim
   that it needs coverage: deciding that is exactly what the preview's
   pruning is for, and the preview says so. Calendar history feeds
   relationship evidence only, per the engine.
3. **The proposed owner is a guess from evidence, per kind, and is
   always said as a guess.** For a calendar event: the organiser, where
   the connector names one and it resolves to a `people.md` person that
   is not you and not `shared`. For a mail or chat thread: the resolved
   person, not you, not `shared`, **and not the item's raiser** (a
   requester waiting on you is not its cover), who most recently wrote
   in the thread. Nothing qualifies: the owner is `unresolved`, which
   becomes a handover warning, never a rejected pool.
4. Show the preview: every candidate item, its owner, its status line,
   and its two-sentence summary written now, at preview time, never
   thread content. Then write `going-away-pool.md` per `own-files.md`:
   run id, the away window, count, items, marker last. Re-read it and
   check marker and
   count before claiming the pool is written; a failed write is reported
   now.
5. **Dropping an item rewrites the pool with a new count and a new
   marker, and only then is the removal confirmed.** In Claude Code the
   pool can be checked with
   `node "${CLAUDE_PLUGIN_ROOT}"/scripts/verify-own.js [folder]`.

## Step two: the draft

1. The pool is the sole source of candidate items. The draft also reads
   `people.md`, `about-me.md` and `voice.md` for names, role and
   wording, and nothing else.
2. **The draft refuses a pool whose marker, count, or any item's
   required fields do not check out**, naming what failed, because a
   damaged pool would otherwise produce a confident handover missing
   items. The remedy it offers is rerunning the preview.
3. The draft groups items by owner, one section per person, each item
   with its status line and summary; `unresolved` owners become a
   warning block at the top: "no owner found for these, assign before
   sending." It opens with the pool's recorded away window, and it ends
   with a placeholder line for how to reach you in a real emergency,
   left blank for the person to fill or delete.
4. The draft is shown for the person to send themselves. It is never
   sent, posted, or saved anywhere beyond being shown, unless the
   person asks for it as a file.

## The register

Per the contract's confidence table: under `corrected`, voice rules
apply without narration; under `accepted`, every applied rule is
reported; `Never` entries are hard, with the contract's exemptions. The
draft claims only what the pool holds: an item whose status went stale
between preview and draft is still stated as the pool recorded it, with
the pool's date named.

## What it does not do

- Send, post, or schedule anything, to anyone.
- Write anything except `going-away-pool.md`.
- Set an out-of-office reply, decline meetings, or touch the calendar.
- Notify proposed owners. Proposing is not asking; the person asks.
- Read any external source `sources.md` does not name.

## The honest limit

In-flight detection sees threads and events, not obligations. A promise
made in a meeting, work tracked in a tool the schema has no kind for,
and anything older than a source's window are invisible here, and the
preview names each source's covered dates so the gaps are visible. The
proposed owner is a guess from activity, said as a proposal, never as
fact.

## When the references cannot be opened

Say which reference is unreadable, then run on these rules alone,
nothing looser. Sources are read only through `sources.md`; each read
reports one of `ok`, `empty`, `empty-unverified`, `partial`,
`unauthorized`, `unreachable`, `malformed`, any usable partial
retrieval being `partial`; claims are scoped to sources on `ok` or
`empty`, unread sources named. In flight is a calendar event in the
window, or a mail or chat thread that is `open`, or `answered` with the
latest word not yours, judged by rereading each thread now. The pool
file carries a run id, the away window it was built for, an item count
matching its entries, per item a namespaced id, source, title, an owner
that is a `people.md` id or `unresolved`, a status line and a one-line
summary that quotes nothing, and ends with a `complete:` marker
matching the run id; the draft is built from the pool alone, opens with
the pool's window, refuses a pool that fails these checks, and nothing
is ever sent.

Version: daily-hq 0.1.5, 2026-08-26.
