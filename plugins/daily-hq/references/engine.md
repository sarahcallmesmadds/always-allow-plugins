# The engine

`good-morning` and `catch-me-up` are one machine over different windows:
`good-morning` runs it over today plus each source's own window,
`catch-me-up` over the away window. `inbox` and `loose-ends` use its
reading, resolution and reporting rules over their own reads. This
document is that machine, written once so the skills cannot drift apart.

The shared-file formats are the contract at
`../../setup/skills/install/references/file-schemas.md`; this document
never restates them. The plugin's own files are
`./own-files.md`. Where either cannot be opened, each skill says so and
runs on the fallback rules in its own text, nothing looser.

## What a run takes

- A window: dates in the `about-me.md` timezone.
- The sources to read, from `sources.md`, each intersected with its own
  `look back` / `look ahead`. Reading past a source's window is not
  allowed, with one stated exception, next; the output names the dates
  each source actually covered.
- **The relationship-history exception, the only one**: for relationship
  evidence alone, the calendar sources' history is read beyond
  `look back`, as far back as the connector exposes, because a last-seen
  date inside a 0-day window would make rank 3 meaningless. It reads
  only the configured calendar sources, feeds only rank 3, never adds
  items, and the brief says once that it was used and how far back the
  records go.
- The identity map: `people.md` entries plus `my handles` from
  `about-me.md`.
- The previous snapshot, if any, per `own-files.md`.

**`about-me.md` is optional for the two briefs, and the degradation is
exactly this**: without `my handles`, `closed-by-you` and mention-of-you
detection are off and the affected resolution states report `unknown`;
without `timezone`, dates are evaluated in UTC and the brief says so,
which can move a 90-day boundary; without `name` and `role`, nothing
changes for the briefs. Every loss is stated in the brief.

## Before reading: configuration failures

Reported before any reading, outside the status table, per the contract:
a required source whose kind the skill cannot handle, and an `account`
mismatch between what the connector reports and the entry. Both are hard
stops for that skill. Kinds a skill does not support are named once as
outside its reach.

## Reading, and the status per source

One status per source, from the contract's seven, decided by the
contract's phase rule: any usable partial retrieval is `partial` whatever
failed afterwards, `unauthorized` and `unreachable` only when nothing
usable came back, `malformed` when what came back could not be used. The
output reports, per source: connector called, range requested, whether
paging finished, any error.

**Positive evidence of a successful read, per kind.** This is the difference
between `empty` and `empty-unverified` when zero items come back. **A
bare empty list is never evidence**, because a connector that turns an
error into an empty list produces exactly that, and from the response
alone the two are indistinguishable. `empty` therefore needs the
response to carry affirmative completion evidence over and above the
empty result; without it, zero items is `empty-unverified`, and that is
the correct answer, not a failure to be papered over:

- **calendar**: the response attributably covers the requested range (the
  range echoed back, or per-day structure spanning it) and offers no
  further page. A response that merely returns nothing is
  `empty-unverified`.
- **mail**: the listing or search states or structurally shows
  completion: an explicit end of results, a zero total, or exhausted
  pagination the response itself shows. Zero hits with none of those is
  `empty-unverified`.
- **chat**: as mail, per channel or thread; a channel the connector
  cannot find gives no evidence about its contents.
- **notes**: an actual listing for the range that is empty. A query
  answered "nothing found" without a listing is `empty-unverified`,
  because a failed index looks identical.

**A connector whose responses never carry such evidence can never yield
`empty`, only `empty-unverified`.** That is by design and the brief says
so when it happens; the remedy lives with the connector, not in trusting
silence. This section is what scopes the quiet-day claim, per the
contract: "nothing needs you" may be said of a source only on `ok` or
`empty`.

## The item record

Per item the engine returns:

| Field | Rule |
|---|---|
| source id, namespaced item id, kind | `s-work-calendar/evt-42`, never a bare id |
| thread | The connector's thread or conversation locator, carried on every mail and chat item so the resolution reread can run. A chat message outside any thread is its own thread: its channel or conversation plus its position. An item the connector gave no locator for resolves `unknown` |
| title, start, end | Start and end absent for mail and chat |
| participants | Resolved ids, plus unresolved raw values flagged as such |
| prep evidence | `lacks agenda text` and `lacks attachment`: absence, not presence |
| relationship evidence | Last-seen date per resolved participant. A first meeting is relationship evidence, never prep evidence |
| change since snapshot | `new`, `moved`, `cancelled`, `changed`, `unchanged`, `unknown` |
| resolution state | Below |
| status per source | The contract's vocabulary |

**Dedup is the engine's job.** The same topic arriving via chat, mail and
a recap is one item, its sources listed. Connect them before writing.

## Resolution state

`open`, `answered`, `closed-by-you`, `unknown`. Precedence when evidence
conflicts: `closed-by-you`, then `answered`, then `open`; anything
unreadable is `unknown`.

- `open`: the thread exists, is readable now, and no qualifying reply
  follows the item.
- `answered`: **a qualifying reply exists after the item**, checked by
  rereading the thread now, not at the window's edge. Qualifying: from a
  resolved person or an unresolved human address, not from you, not from
  an entry marked `shared`, not a bot, and a reaction or an edit is not a
  reply. Your own follow-up must not mark your own question answered.
- `closed-by-you`: your reply, from `my handles`, is the latest word.
- **The record carries the evidence**: the latest qualifying reply's id,
  author and timestamp, so grouping is computed from one defined reply,
  not whichever a builder picked.
- **`answered` does not mean done.** `catch-me-up` shows a separate
  group, "answered while you were away, may still need your sign-off",
  whose membership is exactly: the qualifying reply's timestamp falls
  inside the away window. A thread answered before the trip is plain
  `answered` and appears in neither group.
- Anything the source cannot re-read now is `unknown`, said as such.

**The reread, per kind**: for **mail**, fetch the item's `thread`
locator now and judge the messages after the item; for **chat**, read
the item's `thread` locator now, meaning the messages that follow the
item in its thread, or in its channel or conversation when it sits in
none. An item whose record carries no `thread` locator is `unknown`,
said with that reason. **Calendar and notes items carry no replies, so
their resolution state is `unknown`, with the reason stated once**: not
unreadable, but a kind that has nothing to read. Grouping for those
items uses change-since-snapshot, never resolution, and they are never
listed a second time as unknown.

## Ranking and the cap

Seven items. Warnings, the day's shape and the read-files line are not
items. An item takes its highest rank.

| Rank | Signal, executably |
|---|---|
| 1 | **Calendar items only, where the connector supports both prep fields**: `lacks agenda text` and `lacks attachment`. Mail and chat never rank 1 on prep |
| 2 | `moved`, `cancelled`, or `new` since the snapshot |
| 3 | A resolved participant whose last-seen is more than 90 days before the meeting's start date, or who has no prior event in the records at all, counting only calendar events with 20 or fewer attendees |
| 4 | Everything else |

- Every rank 1 item names its signals: "no agenda, nothing attached." The
  signals are coarse; v1 says which fired rather than pretending to judge
  content.
- **90 days is exclusive, in the `about-me.md` timezone.** With less than
  90 days of history the line reads "first time in the N days of
  records", never "first time in 90".
- Ties: start time, earliest first; mail and chat after timed items, most
  recent arrival first.
- **A cut item's line names its kind, source and what it needed**: "cut:
  a chat request awaiting your approval", never "1 item cut".

## The snapshot, in use

Format and validation are `own-files.md`'s. In use:

- **A missing snapshot is a first run**: no change claims, one line saying
  change detection starts tomorrow.
- **The comparison base is the most recent successful snapshot, and the
  brief always names it and its age**: "changes since Friday, 3 days
  ago". No eligibility judgment, no holiday table; naming the base lets
  the person judge the gap.
- A snapshot that fails validation is treated as absent, saying so.
- **Connector change data is used where it exists** and classified only
  as far as it goes: an update timestamp alone yields `changed`, not
  `moved`. A cancellation needs the connector saying so, or absence from
  a read that completely covered the event's old slot; an event that
  merely moved beyond `look ahead` is absent from a narrower read and is
  not cancelled. Anything less is `unknown`, said.

## Suppressions, in use

Format and the counter rules are `own-files.md`'s. A suppressed item is
left out of the brief silently; a suppressed series stays out until the
person removes the entry. Only `good-morning` maintains the counters;
`catch-me-up` honours the entries and touches nothing.

## The person on the page

- An unresolved participant is shown as unresolved, but a raw value that
  looks like a channel or group is shown as "an unrecognised group",
  never printed, because "show what you could not identify" and "never
  name the channel" collide otherwise.
- The brief cites one concrete value per shared file it used, **and only
  for a file that passed its whole validation**: a file that yielded one
  good entry and then failed is reported malformed, never cited. The
  citation raises the bar and proves nothing; the real check is the
  fixture tests in this repository.
