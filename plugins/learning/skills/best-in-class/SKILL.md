---
name: best-in-class
description: What strong looks like in the user's role right now, from sources read this run, held against what they said they are trying to get better at. Use when the user asks "what does good look like", "how do I measure up", "what should I learn next", "what does a strong <role> do these days", "am I behind on AI", "best in class". Read-only, writes nothing.
---

# best-in-class

One comparison: the outside standard for the role, current and counted,
against the person's own recorded line about what they are trying to get
better at. Not career advice from nowhere; a cited gap statement.

## The one prerequisite

**The comparison is built only from pages retrieved this run.** If
pages cannot be retrieved, say so and stop; there is nothing to
compare against. Model knowledge is never presented as the comparison
and never called current.

## The ledger

Kept per run, one row per source: URL, the publication or update date
where the page states one, the date read, the retrieval state, and on
`partial` or `failed` the error kept. **Four retrieval states.** `full`:
the tool returned the document without truncation. `partial`: some
content then truncation or a timeout; it supports only claims inside
the retrieved part, said so. `snippet`: search-result text only,
**discovery-only, supporting no claim**, because a snippet has no page
context. `failed`: nothing usable, listed, never cited as read. Claims
group into source families by the provenance the page shows: material
a page quotes or syndicates counts with its origin. **A page can carry
two voices**: its own analysis counts with its publisher, and a claim it
attributes to a named origin counts with that origin, never with the
page repeating it. The origin count is the distinct origins,
publishers and named attributions alike, that back at least one claim
the output uses; the coverage line reports pages read and that count,
and every "N of M" in the body uses that same M. Agreement language
runs over origins only. The output opens with one aggregate coverage
line; the full ledger sits at the end of the report.

## The two reads

`about-me.md` (role, and the "What I am trying to get better at" line)
follows the contract at
`../../../setup/skills/install/references/file-schemas.md` in full: a
file that is absent, malformed, of an unknown schema version, or
semantically empty is set aside whole with the loss named once, never
half-read; unknown fields reported once; staleness said once. **With no
role available from the file, ask for one**, because the standard half
cannot truthfully run "for the role" on nothing and no file can answer
this. With no better-at line, the gap half says what it is missing and
never guesses a gap from nothing. If the contract itself cannot be
opened, say so and set `about-me.md` aside unread, naming the loss:
the standard half runs on a role the person gives, and the gap half
has nothing recorded to quote.

## The output

- What separates good from strong in this role this year, each point
  carrying its origin count ("two of three independent origins name
  delegation; the third names forecasting first").
- How the strong ones in this role use AI day to day. This is the
  absorbed AI-adoption lens, and it gets the same counting.
- Which of those the person's better-at line already points at, quoting
  the line back.

**Insufficient or conflicting evidence is an outcome, not a gap to paper
over.** When the read material does not establish a divider, say exactly
that, quote the better-at line anyway, and show what the origins
disagree on. Never round one origin's echoes up to a consensus, and
never cherry-pick weaker pages until a count works.

## The nudge lines

This skill's trigger lives in the project instructions. If the
instructions visible in this conversation do not carry these lines,
identical in all three learning skills, end the run by offering them
as a paste block:

```
When I ask to learn, be briefed on, or stay current on a topic, offer
teach-me; when a brief file with a refreshed date over 90 days old
comes up, offer to refresh it.
When I ask how I measure up in my role or what to learn next, offer
best-in-class.
When I am forming a sizeable request, offer a-better-way before I
send it.
```

## What it does not do

- Write anything, brief files included.
- Send anything, or read mail, calendar, chat, notes, or `sources.md`.
- Present model knowledge as a current source.
- Count two copies of one origin as two voices, to the extent the pages
  show their origin.
- Invent a gap when the better-at line is absent, or a consensus when
  the origins disagree.

## The honest limits

- The comparison is as good as what the search surfaced this run, and
  the ledger vouches only for what it lists.
- Origin grouping sees only the provenance a page shows for each
  claim; silent copying can still double-count, and every output using
  origin counts says
  that limit once.
- The gap half is only as good as the better-at line setup collected in
  one question.
