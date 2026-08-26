---
name: teach-me
description: Build a cited brief on a topic from sources actually retrieved this run, keep it as a Word document the user owns, and rerun it on request. Use when the user says "teach me X", "brief me on X", "keep me current on X", "what's the state of X", "refresh my brief", "rerun this", or when a brief file whose refreshed date is over 90 days old is used in the conversation. Explain-it-back is a mode of the brief. Writes only brief files carrying its own written-by marker, and only after showing the result.
---

# teach-me

A brief you keep as a Word document in your project folder, on a topic
you name, where every claim rests on a source retrieved this run; the
one exception is My notes, the person's own section, carried forward
verbatim. A document, rerun on request, that says how current it is.

## The one prerequisite

**A brief is built only from pages retrieved this run.** If pages
cannot be retrieved, say so and stop. Model knowledge is never
written to a brief file, never labelled a brief, never called current.

## The web-read ledger

Every run keeps a ledger, one row per source: URL, the publication or
update date where the page states one, the date read, the retrieval
state, and on failure the error kept.

- **Four retrieval states.** `full`: the tool returned the document
  without truncation of any kind. Truncation the tool notes anywhere,
  a capped quote included, makes the read `partial`: it supports only
  claims inside the retrieved part, said so. `snippet`: search-result
  text only, **discovery-only, supporting no claim**, because a
  snippet has no page context. `failed`: nothing usable, listed, never
  cited as read. **On `partial` or `failed`, the error is kept.**
- **Claims group into source families**: material a page quotes,
  credits, or syndicates from another counts with its origin, not as a
  second voice; the page's own analysis counts with its publisher.
  The origin count is the distinct origins, publishers and named
  credits alike, behind at least one claim in the brief. Counts report
  both numbers, pages read and origins, never mixed: `full` is a
  page's state, so "N origins read in full" is never written.
  Grouping sees only the provenance a page shows; that limit is
  said once in the report and once in Sources.
- The run's report to the person opens with one aggregate coverage
  line (pages, origins, states), every number recounted from the
  ledger at writing time, never recalled. In the brief, the coverage
  line opens Sources, which holds the full ledger; the document opens
  per the shape below.

## The optional read

`about-me.md` (role, for pitching the brief and its takeaways at the
right level) is read only when a brief is being built this run, and
follows the contract at
`../../../setup/skills/install/references/file-schemas.md`:
a file that is absent, malformed, of an unknown schema version, or
semantically empty is set aside whole with the loss named once, never
half-read; unknown fields reported once; a stale `last confirmed` said
once. Without it, the brief is pitched generally and says so. If the contract
itself cannot be opened, say so and set `about-me.md` aside unread,
naming the loss, because this file does not restate the reader rules
that make that file safe to judge; everything else here runs on this
file's own rules.

## Creating a brief

1. Search for the topic, read what the search surfaces, build the ledger.
2. Write the brief. Directly under the document's title, which is the
   topic: **one bolded sentence, substantial and not long, the
   strongest and best-supported claim of the whole read.** No preamble
   and no framing words; the sentence carries itself. Then Takeaways:
   three to six highlights pitched at the role in `about-me.md`, each
   one cited or counted, selected and ranked for that role. Then the
   topic itself in sections.
3. **Every sentence is a sourced claim, a counted pattern, or
   structure.** A sourced claim names its source and rests on a `full`
   or `partial` read per the ledger rules. A counted pattern counts
   origins over the ledger: "four of six origins name X". Structure is
   the non-claim scaffolding only: the title, the ownership record,
   headings, ledger rows, the change note, and the three sentences
   this skill itself requires (the coverage line, the provenance
   limit, the My notes survival line); prose about the topic is never
   structure.
   Nothing else gets written: no conclusions, no judgments, no advice,
   and no significance words like "worth knowing" or "not urgent",
   because no page said them. Two named leaks: a comparative no page
   made ("X is the most specific"), and an uncounted "the origins do
   not agree"; each is written as a counted pattern or not at all.
   Relevance lives in what is selected and how it is ordered, never
   in added sentences.
4. **Show the whole document as formatted text in the conversation,
   never as raw markup or a code block**, and take the yes. **Nothing
   is written until the person approves the shown document**; a change
   they ask for is made and shown again first, and a withheld yes
   writes nothing. The document, in order:

   - The topic, as the document's title.
   - The one sentence to remember: bolded, sourced, standing alone.
   - Takeaways.
   - The topic sections.
   - Sources: the ownership record, two plain lines reading
     `written by: teach-me` and `refreshed: YYYY-MM-DD`, then the
     coverage line, the ledger, and this run's change note.
   - My notes, opening with the line "Anything you put here survives
     every rerun." Everything below that line is the person's and is
     never rewritten.

5. It saves as `brief-<topic-slug>.docx`, a Word document at the top
   level of the project folder, beside the shared files but not one of
   them. A session that cannot produce a Word document says so and
   offers `brief-<topic-slug>.md` instead; the format change gets its
   own yes, never a silent default. **If the name being saved is
   taken, by anyone's file, do not touch it**: propose the next free
   slug (`-2`, then `-3`), or the adoption flow below if the person
   wants that file taken over.

## Refresh

**Only documents whose Sources section carries `written by: teach-me`
are refreshed.** A brief-named file without that line is someone else's
document whatever its shape; stop and say so. A document whose contents
cannot be reliably read is a different state, not an unowned file: say
the read failed and stop, changing nothing. **Adoption is explicit**:
only when the person asks for a file to be taken over is its content
rebuilt as a managed brief, shown and approved before anything is
written. A lookalike shape is never treated as authorship.

**A refresh is a rerun**, asked for in words like "refresh this" or
"rerun this". Discovery starts over and the body is rebuilt current;
there is no line-by-line merge with the old text. The flow:

1. **Re-run discovery**, not just the old citations: search the topic
   fresh, re-read the prior sources, and report new, removed, changed
   and failed sources.
2. Rebuild the brief per Creating a brief, from this run's reads only.
   **The person's My notes content is carried forward verbatim,
   always**; the rest of the document is replaced.
3. Show the whole rebuilt document once, as formatted text; one yes
   writes it once. A withheld yes writes nothing.
4. The change note in Sources records that this run rebuilt the
   body and names the sources that joined, dropped, changed, or failed
   since the prior run. **`refreshed:` means exactly: the date of the
   run that last wrote this file.**

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
- Rewrite the person's My notes content.
- Save or label model-knowledge output as a brief or as current.
- Support a claim with a snippet, or with any part of a page that was
  not retrieved.
- Write a conclusion, judgment, or advice into a brief. It reports
  what the pages said and what the counts show; explain-it-back marks
  a person's account only against the brief's own lines.

## The honest limits

- A brief is as current as the run that last wrote it, and `refreshed:`
  with the change note say exactly that.
- A refresh replaces the body. The one home for the person's own words
  is My notes, and the document says so there.
- Discovery is a search, not a guarantee. The ledger vouches only for
  what it lists.
