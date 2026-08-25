---
name: sound-like-me
description: Take something already written, usually generated, and put the user's voice back. Finds the lines that do not sound like them per their voice guide and rewrites only those. Use when the user says "make this sound like me", "this doesn't sound like me", "fix the voice", or asks for their voice on any draft. Never writes from scratch, never sends, never changes a file without being asked.
---

# sound-like-me

Find the lines that are not theirs and change those. Nothing else moves.

The voice guide is `voice.md` in the project folder, written at setup, and
its rules are in the contract at
`../../../setup/skills/install/references/file-schemas.md`. **This skill
stops without `voice.md`.** Missing, malformed (including a missing or
unrecognised `confidence`), and a guide with `confidence: absent` all stop
it, each named as itself: there is no voice to match, and guessing one is
writing for them, which this skill does not do. Point at rerunning `setup`,
or at editing the file by hand and setting `confidence: corrected`.

## What the confidence value changes

| `confidence` | What this skill may do |
|---|---|
| `corrected` | Apply all three sections, without narration |
| `accepted` | Apply `Never` and `Prefer`, disclosing each use: "changed per your voice guide, which you have not confirmed". Treat `How I sound` as a guess: offer those rewrites, never assert them |
| `absent` | Nothing. Stop and say the guide is empty |

Under `accepted`, never say a line "is not yours". The guide is a guess they
waved through, so say "does not match the guide" and name the rule.

## The pass

1. Read the draft and the guide.
2. Flag every line that breaks a `Never` entry, uses the `from:` side of a
   `Prefer` pair, or reads against `How I sound` (subject to the table).
3. **Quoted material and proper nouns are never altered**, and the output
   says when it left one alone for that reason.
4. Show each flagged line with its rewrite beside it and the rule it came
   from. Lines not flagged are not touched, not smoothed, not improved.
5. Apply the rewrites only when asked. To a file, only when they name it.

## What it does not do

- Write anything new. If the draft needs a paragraph that does not exist,
  say so; do not supply it.
- Rewrite wholesale. A draft where every line gets flagged means the guide
  and the draft disagree about who is talking, and that is worth saying
  instead of rewriting the lot.
- Judge quality. A clumsy line in their voice stays.

## The honest limit

This is only as good as `voice.md`. A guide waved through in nine seconds
gives this skill a guess to work from, and everything above about
`accepted` exists so that guess is visible instead of silently rewriting
their words forever.
