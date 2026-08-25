# The shared files

Copied from `~/.planning/SCHEMAS-always-allow-shared-files.md` on 2026-08-25,
when the first skill was built against it, with build-time corrections two
review rounds caught: the priorities, personas and sources examples and
required-field lists now carry the per-entry `last confirmed` the global rule
already required, the window form names its singular, the voice example
carries the instruction line the rules already required, and the
no-duplicate-keys rule is stated rather than implied. Amended again
2026-08-25 after a five-persona review of the writing plugin: the `Never`
exemptions now cover numbers, dates and amounts; `personas.md` carries a
setup-written privacy line, because the file is a candid read of named
colleagues; and `person:` resolution is verified by `setup` and `check`,
never judged by consumers that do not read `people.md`. Amended a third
time 2026-08-25 when `growth` was scoped against this document: the three
record files gain their own section and `wins.md` its entry schema, because
the shipped `setup` was already creating them with no contract behind them;
the consumer table now carries the four growth skills; the work-calendar
example lists `time-spent`; and `w-` joins the id prefixes. This copy is
what the installed plugin reads. If the two ever disagree beyond those
listed changes, say so rather than silently preferring either.

`setup` writes these. Other plugins read them.

**`setup` is the only automated writer. People edit them by hand, on purpose.**
An earlier version said "nothing else writes them", which contradicted the whole
point of markdown files a person owns. The consequence lands on consumers: any
invariant a skill relies on, such as no duplicate handles, is re-checked when
the file is used, not assumed because `setup` checked it once at write time.
The three record files carry the one exception to the only-writer rule, and
their own section below defines it.

---

## Who reads these, and what that means

**A language model reads these files. There is no parser.**

A model tolerates a stray blank line, a reordered field, a retitled heading.
But tolerance is not consistency: the same model can read an ambiguous file two
ways on two mornings. So anything that must be read the same way every time is
made unambiguous by design.

**Recognition rules, for every file:**

- **An entry begins at an `id:` line and runs to the next `id:` line or the end
  of the file.** Headings are decoration for the person, never structure, with
  one stated exception: the three section headings inside `voice.md`. Deleting
  or retitling any other heading changes nothing, because the `id:` line is the
  boundary.
- **`id:` is reserved for entry boundaries.** A note that mentions an id goes
  in a `note:` field, because any line starting `id:` starts an entry, and a
  person writing `id: copied from IT ticket 483` under a source would otherwise
  create a malformed second entry.
- **A field is a `key: value` line. The value runs to the end of the line**, so
  a value may contain colons and commas: `relationship: manager: North America`
  is the key `relationship` with everything after the first colon as its value.
- **A key other than `note:` appears at most once per entry, and once in the
  header.** A duplicated key is malformed, because two values for one field
  would have every consumer silently picking one. **This rule does not reach
  inside `voice.md`'s three sections**: `Prefer` repeats `from:`/`to:` by
  design, and lines inside `Never` and `How I sound` are list items and
  prose, never fields.
- **A list is either bracketed inline on one line, `[a, b]`, or indented dashes
  under the key.** An inline list does not wrap; anything long uses dashes.
- **Unknown fields are kept, and reported once.** A consumer meeting a key it
  does not know says so, because `exlude:` is a typo that must not vanish
  silently. Intentional additions use `note:`, which is never reported.
- **Enums and booleans are exactly the spellings written here.** `true`, not
  `yes`. A consumer meeting any other spelling treats the field as absent and
  says so.
- **Dates are `YYYY-MM-DD`.**
- **No silent defaults, anywhere.** A default is allowed only when it is
  reported: "timezone unrecognised, using UTC" is acceptable, silently using
  UTC is not.

**Where a script reads these**, which happens in Claude Code and not in Cowork,
it must accept exactly the syntax written here. A model may tolerate more, but
never where the outcome is safety-relevant: ids, handles, `required for` and
`kind` are read by the rules above and nothing looser, by model and script
alike.

**Uniqueness is file-wide, in every entry-bearing file.** A duplicate id or a
duplicate handle anywhere in the file makes it malformed. `setup` checks when
it writes, and a consumer scans the whole file for duplicates before using any
entry, because hand edits happen and nothing else catches them.

**`last confirmed` is required on every entry in every entry-bearing file**,
not only in `people.md`. The file-level date covers the header; each entry is
judged by its own.

## Where the files live

**The nine files live at the top level of the project's folder**: the
Cowork project folder, or in Claude Code the folder `setup` wrote them
into. No searching parent or sibling folders. A skill that cannot find a
file says where it looked before offering to run `setup`, because offering
setup against the wrong folder creates a second, conflicting set. A skill
that cannot read this contract itself says so and proceeds only on the
rules restated in its own text, nothing more.

## Every file starts with this

```markdown
schema: 1
last confirmed: 2026-08-24
```

**`schema` is required.** Missing, malformed, and unknown-version all follow
one rule: a consumer that hard-stops on this file stops and says which of the
three it found. A consumer for which the file is optional skips it, says what
it lost, and continues.

**`last confirmed`** is when a person agreed the contents, not when they were
written. **The file-level date covers the header fields. An entry's own
`last confirmed` covers that entry**, and the two are judged separately: a
current file can hold a stale entry. Older than 90 days is stale, and a
consumer says so once rather than refusing to run.

---

## The skill roster

`required for` lists and the consumer table use these ids and no others. **A
skill id not on this roster makes the field malformed** rather than silently
ignored, because `good-mornng` is a typo somebody will make, and ignoring it
silently downgrades a required source to optional.

`good-morning`, `catch-me-up`, `loose-ends`, `going-away`, `inbox`,
`time-spent`, `prioritize`, `wins`, `give-me-feedback`, `follow-ups`,
`prep-me`, `teach-me`, `best-in-class`, `a-better-way`, `sound-like-me`,
`slop-check`, `review-as`, `say-it-simply`, `why-we-decided`, `run-it-past`.

**`inbox` is a working id.** The skill has no name yet. Renaming it changes
this roster **and every `required for` list that names it**, which is why the
rename is in the Open table rather than described as free.

---

## `about-me.md`

```markdown
schema: 1
last confirmed: 2026-08-24

name: Sarah Madden
role: Head of Revenue Operations
company: Acme
timezone: America/New_York
working hours: 09:00-18:00 Mon,Tue,Wed,Thu,Fri
my handles:
  - email:sarah@acme.com
  - slack:acme.slack.com:U07L4GTGUAF

## What I do

Two or three sentences, in your words, about what the job actually is.

## What I am trying to get better at

The answer to the one question setup asks that nothing can find.
```

**Required:** `name`, `role`, `timezone`.

- **`my handles` is how a skill knows which participant is you**, typed the
  same way as `people.md` handles. Without it, "what needs you" cannot tell a
  thread that mentions you from one that mentions anybody. Found by itemising
  the prior art, which carried the person's own Slack id hardcoded.

- **`timezone` is an IANA name.** A consumer that cannot recognise it reports
  "timezone unrecognised, using UTC" and continues. Reported, never silent.
- **`working hours` is `HH:MM-HH:MM` then a comma-separated list of
  three-letter days.** `09:00-17:00 Mon,Wed,Fri` is a three-day week. Anything
  else is treated as absent, reported, and the consumer says it is assuming a
  whole day.

---

## `people.md`

```markdown
schema: 1
last confirmed: 2026-08-24

## Kate Lin
id: p-kate-lin
kind: person
relationship: my manager
handles:
  - email:kate@acme.com
  - email:kate.lin@acme.com
  - slack:acme.slack.com:U04KL9
last confirmed: 2026-08-24

## Support
id: p-support-rota
kind: shared
handles:
  - email:support@acme.com
last confirmed: 2026-08-24
```

**Required per entry:** `id`, `kind`, `handles`, `last confirmed`.

- **Ids match `p-` plus lowercase letters, digits and hyphens.** Never reused.
- **`kind` is `person` or `shared`.** A shared entry is a rota, a team address
  or a distribution list, and is never treated as an individual.
- **Every handle carries its type**: `email:`, `slack:`, `teams:`, `phone:`.
  A bare value is malformed. Email compares lowercased. **`slack:` and `teams:`
  carry their workspace or tenant**, `slack:acme.slack.com:U04KL9`, because a
  bare member id is only unique inside one workspace. **`phone:` is `+` then
  digits**, `phone:+12025550123`, with an optional ` ext N`.
- An address on no entry resolves to **unresolved**, a visible state. Never
  guessed from a display name.
- `relationship` is free text, for wording, never logic.

---

## `priorities.md`

```markdown
schema: 1
last confirmed: 2026-08-24

## Renewals for Q4
id: pr-renewals-q4
rank: 1
since: 2026-07-01
include:
  - renewal
  - "churn risk"
  - QBR
exclude:
  - "special offer"
last confirmed: 2026-08-24

## Hiring two AEs
id: pr-hiring-aes
rank: 2
since: 2026-08-10
include:
  - "interview loop"
  - "offer letter"
  - candidate
last confirmed: 2026-08-24
```

**Required per entry:** `id`, `rank`, `since`, `include`, `last confirmed`.

**How matching works, exactly:**

- Both sides are lowercased, punctuation becomes a space, and whitespace
  collapses before comparing, so `"follow up"` matches `follow-up`.
- An unquoted term matches as a whole word. A quoted term matches as an ordered
  phrase after the same normalisation, so `"offer letter"` matches
  "Offer Letter.pdf" and `offer` alone does not match "offered".
- **Inflections are not handled.** `renewal` does not match "renewals". List
  both if both matter. This is the crudeness, stated.
- **Only titles and subject lines are searched** in v1, not bodies.
- **An entry's `exclude` blocks assignment to that entry only.** An earlier
  version had exclusion working globally, so one priority's `"special offer"`
  could stop a hiring email reaching the hiring priority.
- When include and exclude both match within one entry, the item is excluded
  from that entry and the output records that it was.
- **Every assignment names the term that made it**, so a wrong match is visible
  rather than mysterious.
- An item matching several entries belongs to the highest ranked; **ties break
  by id, alphabetically**, so reordering the file for readability never changes
  an assignment.
- A skill comparing a window against a priority uses only the part of the
  window on or after `since`, and says when it has done so.
- **Semantically empty, the header and no entries, is valid** and means nothing
  is confirmed. Skills needing priorities say so instead of inventing them.

**This is the weakest file here** and the first thing likely to need replacing.

---

## `voice.md`

```markdown
schema: 1
last confirmed: 2026-08-24
confidence: corrected

If you edit this file by hand, set confidence: corrected. The three headings
below are fixed; retitling one makes the file unreadable to the skills.

## Never

- em dashes
- leverage
- utilize
- "circle back"
- three short sentences in a row

## Prefer

- from: reconcile
  to: check the saved records and fix disagreements
- from: dependency review
  to: check what relies on this

## How I sound

Two or three sentences. Plain, direct, no hedging, contractions fine.
```

**Required:** `confidence`. The three sections may each be empty.

**The three headings `## Never`, `## Prefer`, `## How I sound` are structural
and fixed.** This is the one deliberate exception to headings-are-decoration,
because here the headings carry the meaning. Retitling one makes the file
malformed, and the file says so in a comment `setup` writes at the top.

**`confidence` is `corrected`, `accepted` or `absent`:**

| Value | Meaning | Consumer behaviour |
|---|---|---|
| `corrected` | The person edited it | Apply everything |
| `accepted` | Waved through quickly | Apply `Never` and `Prefer`. Treat `How I sound` as a guess |
| `absent` | Nothing gathered | Apply nothing. Say the guide is empty when asked to match a voice |

- **If you edit this file by hand, set `confidence: corrected`.** That
  instruction is written into the file itself, directly under the header
  lines, as the example shows. **A missing or unrecognised `confidence` is malformed**, not silently
  `accepted`: hard-stop consumers stop, optional ones skip the file and say so.
  An earlier version defaulted it, which broke the no-silent-defaults rule in
  the same document that states it.
- **Under `accepted`, every application of a `Never` or `Prefer` rule is
  reported**: "changed X per your voice guide, which you have not confirmed."
  A guessed rule may act, and it acts visibly, so a wrong guess gets corrected
  instead of silently rewriting a contractual phrase forever. Under
  `corrected`, rules apply without narration.
- **`Never` is hard, with these exemptions: quoted material, proper nouns,
  numbers, dates and amounts are never altered**, and the consumer says
  when it left one. **The protection is the value, not the form**: writing
  "twelve" as "12" on the guide's own instruction changes no value and is
  allowed; changing what a number, date or amount says never is.
- **`Prefer` is a `from:`/`to:` list, not a table.** Matching uses the
  priorities rules: lowercased, punctuation to space, whole words, phrases
  in order, and **inflections are not handled**: `from: reconcile` does not
  match "reconciled". `Never` beats `Prefer`: a `to:` value that breaks a
  `Never` entry is a conflict the consumer reports and does not apply.
- **For a consumer that reports rather than rewrites**, the exemptions
  above also govern counting, plus one more: a sentence citing or restating
  a rule is not a violation of it.
- **`voice.md` has no entries; its `last confirmed` is the file-level date**
  and staleness is judged on that.

---

## `personas.md`

Read by `review-as` and `run-it-past`. Not read by anything in `daily-hq`.

```markdown
schema: 1
last confirmed: 2026-08-24

These entries are your private read of real people; review them before
sharing this project.

## Kate, my manager
id: pe-kate
person: p-kate-lin
cares about: whether the number moves, and whether I saw the risk early
pushes back on: anything without a date on it
reads: the first paragraph and the last line
last confirmed: 2026-08-24
```

**Required per entry:** `id`, `cares about`, `pushes back on`, `reads`,
`last confirmed`. **`person` is optional.**

- **A present `person` must resolve to a `people.md` id, or the file is
  malformed.** Only an absent field means deliberately unlinked. `setup`
  verifies this when it writes and `check` re-verifies it; a consumer that
  does not read `people.md` treats the link as unverified, mentions that
  only when asked, and never judges the file by it.
- **One persona is valid.** Two or three is guidance.
- **The privacy line at the top is written by `setup`**, mirroring the
  voice.md instruction comment, because sharing the project shares this
  file and the file is the person's candid read of named colleagues.
- A persona with a blank `pushes back on` is not useful, and `setup` says so
  rather than writing one.
- **Semantically empty stops the hard-stop consumers**: `review-as` with no
  personas says "no personas defined, add one or run setup". It never invents a
  reviewer.

---

## `sources.md`

```markdown
schema: 1
last confirmed: 2026-08-24

## Work calendar
id: s-work-calendar
kind: calendar
account: sarah@acme.com
required for: [good-morning, catch-me-up, prep-me, time-spent]
look back: 0 days
look ahead: 1 day
read: events, attendees, attachments, agenda text
skip: events I declined
last confirmed: 2026-08-24

## Work mail
id: s-work-mail
kind: mail
account: sarah@acme.com
required for: [good-morning, inbox]
look back: 7 days
read: inbox, sent
skip: newsletters, automated notifications
last confirmed: 2026-08-24

## Team chat
id: s-team-chat
kind: chat
account: acme.slack.com
required for: []
look back: 2 days
read: direct messages, mentions
skip: channels I am only lurking in
except: ignore the deal rows Sarah owns for admin reasons
last confirmed: 2026-08-24
```

**Required per entry:** `id`, `kind`, `account`, `required for`,
`last confirmed`, and at least one of `look back` / `look ahead`.

- **`account` binds the source to a real one**, because a person with two mail
  accounts has no other way to say which. **A consumer compares the identity
  the connector actually reports against `account`**, and a mismatch is a
  configuration failure: reading the personal Gmail while the work source is
  configured must not count as the work source being checked.
- **`required for` uses the skill roster.** An id not on it is malformed.
- **`look back` and `look ahead` replace a single window.** Both are
  non-negative integers in the exact form `N days`, with `1 day` also
  accepted for one. **The range always includes
  today**, in the `about-me.md` timezone: `look back: N` adds the N calendar
  days before today, `look ahead: N` adds the N after, so
  `look back: 0 days` with `look ahead: 1 day` means today and tomorrow.
  Calendar sources need `look ahead`, because a backward-only read misses
  today's 2pm meeting. Anything else in these fields is malformed.
- **`kind` is `calendar`, `mail`, `chat` or `notes`. Anything else is
  malformed**, never ignored, because `kind: email` is a typo that would
  silently drop a required source. `notes` is a meeting-notes tool such as
  Granola, added because the prior art reads one every morning.
- **A CRM and a project tracker are not expressible in v1**, and the prior art
  reads both. That is a stated loss, not an oversight: a generalised
  `good-morning` starts without pipeline movement and sprint status, and adding
  those kinds is a schema version 2 question.
- **Configuration failures are reported before reading, outside the status
  table**: a required source whose kind the skill cannot handle, and an
  `account` mismatch. Both are hard stops for that skill, not an ignore, and
  neither pretends to be a read status.
- **`read`, `skip` and `except` are prose instructions, not a query language.**
  Two skills can act on them differently, so any skill acting on them reports
  what it actually did. That is mitigation, not a fix.
- **Semantically empty is valid** and means no sources are configured. **A
  consumer that hard-stops on this file stops on a semantically empty one too**,
  saying "no sources configured". It never treats an empty configuration as a
  quiet day.

### The status a consumer reports per source

**Seven statuses.** An earlier version had six with an undocumented seventh.

| Status | When |
|---|---|
| `ok` | Every configured part completed: the range, the listed fields, the filters. One or more items |
| `empty` | Same completeness, zero items, **and the connector gave positive evidence the read succeeded** |
| `empty-unverified` | Zero items without that evidence. A connector that turns an error into an empty list lands here |
| `partial` | Any configured part incomplete: paging stopped, rate limited, truncated, or a listed field like attachments could not be read |
| `unauthorized` | Credentials refused |
| `unreachable` | Network failure or timeout **before any usable response**. A failure after partial retrieval is `partial`, with the error retained: ninety-nine messages then a timeout is a partial read, not an unreachable source |
| `malformed` | Read something, could not make sense of it |

`ok` and `empty` are mutually exclusive by item count. A consumer says
"checked successfully", never "genuinely read", and reports: connector called,
range requested, whether paging finished, any error.

### The quiet-day rule

**A quiet-day claim is always scoped to what was read.**

- "Nothing needs you" may be said of a source only when it returned `ok` or
  `empty`.
- A source in whose `required for` the skill appears, returning anything else,
  goes at the top of the output, and the output is never called quiet.
- **A configured source the skill did not read is named as unchecked**: the
  brief says "calendar and mail are quiet. Chat was not checked." An earlier
  version allowed an unqualified quiet day while an optional chat source held
  "production is down, call me". Scoping the claim fixes that without forcing
  every source to be required. **The scope of "unchecked" is the sources whose
  kinds the skill supports**; kinds it does not support are named once as
  outside its reach, so a mail-and-calendar skill is not made to analyse the
  whole source configuration.

---

## The three record files

The nine files are the six contract files above plus three records:
`decisions.md`, `wins.md`, `what-ive-tried.md`. `setup` creates each with
only the two header lines and never touches it again.

**A record is an append-only journal.** A new entry goes at the end. Nobody,
person or skill, edits or deletes an old entry; a correction is a new entry
that says so. This is the one exception to "`setup` is the only automated
writer": **each record has exactly one automated writer, the skill named
here, and it appends only entries the person has seen and confirmed.**

**No lock over these files exists here**, in the same way true atomic
replacement does not, and promising one anyway is the failure this document
already names. A writer appends only its new entry block, never rewriting
the rest, and re-reads afterwards; that detects a racing write or hand
edit rather than preventing it, and a detected race is reported with the
entry preserved, never silently retried.

| Record | Automated writer |
|---|---|
| `wins.md` | `wins` |
| `decisions.md` | none yet |
| `what-ive-tried.md` | none yet |

A record whose writer is "none yet" gets one when the plugin that owns it is
scoped and this table is amended. Until then no skill appends to it.

Records follow the global recognition rules: entries begin at `id:`, fields
are `key: value` lines, uniqueness is file-wide, and `last confirmed` is
required per entry. For an append-only record, `last confirmed` is the date
the entry was written down and is never updated afterwards.

### `wins.md`

```markdown
schema: 1
last confirmed: 2026-08-24

## Closed the Meridian renewal
id: w-meridian-renewal-early
date: 2026-08-28
win: Closed the Meridian renewal two weeks early, at full price
person: p-kate-lin
last confirmed: 2026-08-28
```

**Required per entry:** `id`, `date`, `win`, `last confirmed`.

- **Ids match `w-` plus lowercase letters, digits and hyphens.** Never reused.
- **`date` is when it went well**, which is not always the day it was written
  down; `last confirmed` covers the writing down.
- **`win` is one line**, the thing itself, in the person's words once they
  have confirmed it.
- **`person` is optional** and follows the `personas.md` rule: a present
  `person` must resolve to a `people.md` id or that entry is malformed, and
  a consumer that does not read `people.md` treats the link as unverified.
- **Semantically empty, the header and no entries, is valid** and is what a
  fresh install holds. A consumer using a thin record says it is thin rather
  than drawing quiet conclusions from two entries.

`decisions.md` and `what-ive-tried.md` have no entry schema yet; they get
one when their writers are named. Until then a valid one holds exactly the
two header lines, plus anything a person wrote by hand.

---

## Which skill stops without which file

Uses the roster ids. Anything not listed does not read the file.

| File | Hard stop for | Optional for |
|---|---|---|
| `about-me.md` | `going-away`, `inbox` | `good-morning`, `catch-me-up`, `best-in-class`, `give-me-feedback`, `teach-me`, `time-spent`, `wins` |
| `people.md` | `good-morning`, `catch-me-up`, `going-away`, `follow-ups` | `prioritize`, `wins` |
| `priorities.md` | `time-spent`, `prioritize` | `loose-ends`, `inbox`, `give-me-feedback` |
| `voice.md` | `sound-like-me` | `slop-check`, `say-it-simply`, `review-as`, `going-away` |
| `personas.md` | `review-as`, `run-it-past` | nothing |
| `sources.md` | `good-morning`, `catch-me-up`, `loose-ends`, `inbox`, `prep-me`, `follow-ups`, `going-away`, `time-spent` | `wins`, `give-me-feedback` |
| `wins.md` | `wins` | nothing |

The growth skills read connectors only through `sources.md`, like everything
else: `time-spent` stops without a readable source configuration because a
week it cannot see is a comparison it cannot make, and its `about-me.md`
read is for the timezone the source windows are defined in.

**Optional means it runs and says what it lost, never a silent default.** The
`voice.md` optional list is the named prose-producing skills; an earlier
version said "anything producing prose", which no builder could enumerate.

---

## How `setup` writes them

- **True atomic replacement of six files does not exist here**, and an earlier
  version promised it anyway. What `setup` actually does: writes the full new
  set aside, verifies every file and cross-reference, then replaces the live
  files one at a time and re-verifies the live set. **A failure mid-replacement
  is reported naming which files are new and which are old**, and the verified
  aside set is kept so a person can finish by hand.
- **A rewrite carries unknown fields and `note:` lines forward**, so a person's
  own additions survive.
- Success is reported only after the live set verifies.

## Rules for all nine

- A missing hard-stop file stops that skill, by name. No defaults, no output.
- A file that will not be read as its shape demands is **malformed**, never
  empty. Missing, malformed, semantically empty and unknown-version are four
  states with four meanings, each named as itself and none folded into
  another.
- **A required field missing or blank malforms that entry, not the file**:
  the entry is skipped and named, and the other entries stay usable. A
  blank value and an absent key are the same state.
- Ids: `p-` people, `s-` sources, `pr-` priorities, `pe-` personas, `w-`
  wins. Stable, never reused.

---

## Open

| Open | Why it matters |
|---|---|
| Word matching does not handle inflections | `renewal` misses "renewals" unless both are listed |
| `read`, `skip`, `except` are prose | Two skills can act differently; reporting what was done is mitigation |
| No migration from schema 1 to 2 | Stopping on unknown versions is safe, not a migration |
| The `inbox` id is a placeholder | Renaming it touches every `required for` that lists it |
| Exact text normalisation is not pinned character by character | Unicode, apostrophes and edge punctuation can still read two ways; settled at build with test cases, not here |
| A connector's "positive evidence" of a successful read is undefined per connector | What counts as evidence differs by connector and is recorded when each adapter is built |
