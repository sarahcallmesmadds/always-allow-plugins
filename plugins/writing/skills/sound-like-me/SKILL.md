---
name: sound-like-me
description: Take something already written, usually generated, and put the user's voice back. Finds the parts that do not sound like them per their voice guide and rewrites only those. Use when the user says "make this sound like me", "this sounds like a robot", "this sounds like ChatGPT", "I'd never say it like that", "rewrite this in my voice", "make it less formal", "this doesn't sound like me". Never writes from scratch, never sends, never changes a file without being asked.
---

# sound-like-me

Find the parts that are not theirs and change those. Nothing else moves.

The voice guide is `voice.md` at the top level of the project folder, as
the contract defines it
(`../../../setup/skills/install/references/file-schemas.md`). Its
`last confirmed` is the file-level date; say so once when it is more than
90 days old. Given no draft to work on, say so and stop. Keep the draft's
own language; the guide is calibrated for the language it was written in,
and say so when they differ.

## When there is no voice to match

This skill stops when `voice.md` is missing, malformed, of a version this
build does not know, `confidence: absent`, or present with all three
sections empty. Each state is told apart and named, but **in the user's
language, never the contract's**: never "malformed" or "schema" to someone
who did not write this file. Name what is wrong in plain words, say where
you looked for the guide, then offer the easy route: "Your voice guide
isn't set up yet (or has a problem I can't read past), so I don't know
what you sound like. Want to set it up now? I'll find how you actually
write and you just confirm." Editing the file by hand and setting
`confidence: corrected` is mentioned only if they ask for the manual
route, and setup is never offered as a fix for a guide that exists, since
rerunning it could overwrite deliberate hand edits.

## What the confidence value changes

| `confidence` | What this skill may do |
|---|---|
| `corrected` | Apply all three sections, without narration |
| `accepted` | Apply `Never` and `Prefer`. Treat `How I sound` as a guess: offer those rewrites, never assert them |
| `absent` | Nothing. Stop as above |

Under `accepted`, one line above the results lists what was applied:
"(applied these rules from your voice guide, which you haven't confirmed
yet: no 'circle back', reconcile becomes 'check the records'; say the word
and we'll review the guide together)". Each applied rule is visible in
that line, once per reply. Never say a line "is not yours" from an
unconfirmed guide; say it "doesn't match the guide" and name the rule.

## The pass

1. Read the draft and the guide. **The flagged unit is the smallest span
   that breaks the rule**, not the physical line: "three short sentences
   in a row" flags the run of three as one finding. `Prefer` matches by
   the contract's rules: whole words, no inflections.
2. Flag every span that breaks a `Never` entry, uses the `from:` side of a
   `Prefer` pair, or reads against `How I sound` (subject to the table).
   **`Never` beats `Prefer`**: a `to:` value that itself breaks a `Never`
   entry is a conflict in the guide; report it, apply neither.
3. **Never altered: material attributed to another speaker, proper nouns,
   and the value of any number, date or amount.** The protection is the
   value, not the form: "twelve" may become "12" when the guide asks for
   digits, and what the figure says may never change. Attribution defines
   quoted, not punctuation marks; the user quoting their own earlier words
   is still the user. Say when something was left alone for this reason.
4. **Never rewrite words the user did not write.** When the draft carries
   visible markers of another author (reply headers, "X wrote:", a signed
   section), ask which parts are the user's before flagging anything.
   Without such markers, proceed.
5. Return **the full rewritten draft as one pasteable block**, then the
   list of changes, each with the original span and the rule it came
   from. Before returning, check the rewritten text against the guide
   itself; a fix that creates a new violation (three short sentences
   where seams met) is reworked, not shipped.
6. The invocation is the ask for all of this. **Only writing into a file
   needs a separate yes, and only for a file they name**; where files
   cannot be written, hand the text back to paste.

## When most of the draft gets flagged

If more than half the sentences are flagged, what happens depends on what
was asked. When the ask was itself to restore their voice ("make this
sound like me", "this sounds like ChatGPT"), a heavy rewrite is the
expected answer: say in one line that most of the draft is coming back in
different words, and proceed. Stop and ask first only when the ask was
narrower than a full voice pass, or when authorship is in doubt, because
those are the cases where the guide and the draft may genuinely disagree
about who is talking.

## What it does not do

- Write anything new. A missing paragraph is named, not supplied.
- Judge quality. A clumsy line in their voice stays.
- Nag. Every disclosure here happens once per reply.

## The honest limit

This is only as good as `voice.md`. A guide waved through in nine seconds
gives this skill a guess to work from, which is why `accepted` output is
labelled and why confirming the guide is always offered as the way out.

Version: writing 0.1.1, 2026-08-26.
