---
name: teach-me
description: Build a cited brief on a topic from sources actually retrieved this run, keep it as a file the user owns, and refresh it on request. Use when the user says "teach me X", "brief me on X", "keep me current on X", "what's the state of X", "refresh my brief", or when a brief file whose refreshed date is over 90 days old is used in the conversation. Explain-it-back is a mode of the brief. Writes only brief files carrying its own written-by marker, and only after showing the result.
---

# teach-me

A brief you keep, on a topic you name, where every claim rests on a source
retrieved this run. Not a chat answer that scrolls away: a file, refreshed
on request, that says how current it is.

## The hard stop

**The cited product needs live web access.** A session that cannot
retrieve pages stops here and says so. If the person asks anyway, answer
from model knowledge as an explicitly different thing: labelled as such,
never written to a brief file, never called current, never called the
brief. There is no path from model knowledge to a saved brief.

## The web-read ledger

Every run keeps a ledger, one row per source: URL, the publication or
update date where the page states one, the date read, the retrieval
state, and on failure the error kept.

- **Four retrieval states.** `full`: the tool returned the document
  without truncation. `partial`: some content then truncation or a
  timeout; it supports only claims inside the retrieved part, said so.
  `snippet`: search-result text only, **discovery-only, supporting no
  claim**, because a snippet has no page context. `failed`: nothing
  usable, listed, never cited as read.
- **Pages group into source families**: a page quoting, crediting, or
  syndicating another counts with its origin, not as a second voice.
  Counts report both numbers, pages read and independent origins.
  Grouping sees only the provenance a page shows; say that once.
- The output opens with one aggregate coverage line (pages, families,
  states). The full ledger is the brief's `## Sources` section.

## The optional read

`about-me.md` (role, for pitching the brief at the right level) follows
the contract at `../../../setup/skills/install/references/file-schemas.md`:
a file that is absent, malformed, of an unknown schema version, or
semantically empty is set aside whole with the loss named once, never
half-read; unknown fields reported once; a stale `last confirmed` said
once. Without it, the brief is pitched generally and says so. If the
contract itself cannot be opened, say so and run on this file's rules
alone, nothing looser.

## Creating a brief

1. Search for the topic, read what the search surfaces, build the ledger.
2. Write the brief as `##` sections, every claim resting on a `full` or
   `partial` read per the ledger rules. No uncited claims.
3. Show the whole file before writing. The shape:

```markdown
topic: EU pricing rules
refreshed: 2026-08-25
written by: teach-me

Your corrections and additions go under ## My notes; refresh rewrites
the body and never touches that section.

## <section>
...

## Sources
<the ledger, plus this run's change note>

## My notes
```

4. It saves as `brief-<topic-slug>.md` at the top level of the project
   folder, beside the shared files but not one of them. **If that name is
   taken, by anyone's file, do not touch it**: propose the next free slug
   (`-2`, then `-3`), or the adoption flow below if the person wants that
   file taken over.

## Refresh

**Only files carrying `written by: teach-me` are refreshed.** A
`brief-*.md` without that line is someone else's document whatever its
shape; stop and say so. **Adoption is explicit**: only when the person
asks for a file to be taken over is its content rebuilt as a managed
brief, shown and approved before anything is written. A lookalike header
is never treated as authorship.

The flow:

1. **Re-run discovery**, not just the old citations: search the topic
   fresh, re-read the prior sources, and report new, removed, changed
   and failed sources before proposing anything.
2. Walk the body section by section. **Every changed line is shown old
   beside new**, so a correction the person made by hand is visible
   before it can be lost. A line they say is theirs is kept verbatim.
3. **Nothing is written until the end.** Assemble the final: accepted
   sections new, declined sections keeping their old text. Show the
   assembled whole once; one yes writes the file once. A run where
   nothing is accepted writes nothing.
4. `## My notes` is carried forward verbatim, always.
5. The change note in `## Sources` records what this run took, what it
   declined, and any section that kept old text, so a mixed file is
   recorded rather than hidden. **`refreshed:` means exactly: the date
   of the run that last wrote this file.**

## Explain-it-back

A mode, on request, after any brief: the person explains the topic back,
and the reply marks what they have right and what the brief actually
says, citing the brief's own lines. It corrects against the brief, not
against fresh reading.

## The nudge lines

This skill's triggers live in the project instructions. If the
instructions visible in this conversation do not carry these lines, end
the run by offering them as a paste block:

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

- Send anything, or read mail, calendar, chat, notes, or `sources.md`.
- Write to any of the nine shared files.
- Refresh, rewrite, or adopt a file without its marker, outside the
  explicit adoption flow.
- Rewrite `## My notes` or any line the person claims.
- Save or label model-knowledge output as a brief or as current.
- Support a claim with a snippet, or with any part of a page that was
  not retrieved.

## The honest limits

- A brief is as current as the run that last wrote it, and `refreshed:`
  with the change note say exactly that.
- An edit made silently inside the body is shown old-beside-new at
  refresh but is not guaranteed to survive a quick yes. The guaranteed
  home for the person's own words is `## My notes`, and the header says
  so.
- Discovery is a search, not a guarantee. The ledger vouches only for
  what it lists.
