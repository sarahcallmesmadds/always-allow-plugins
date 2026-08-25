---
name: review-as
description: Read a draft, plan, or deck the way a specific recorded persona would, and say where they will push back. Works on anything with an audience, not only prose. Use when the user says "review this as <someone>", "how will <someone> read this", "run this past <someone>'s eyes", "where will this get pushback". Read-only, changes nothing.
---

# review-as

Read the work as one recorded persona and report where that persona pushes
back, what they will actually read, and what they care about that is
missing.

Personas live in `personas.md` in the project folder, written at setup, per
the contract at `../../../setup/skills/install/references/file-schemas.md`.
**This skill stops without `personas.md`.** Missing, malformed, and
semantically empty each stop it by name; empty gets "no personas defined,
add one or run setup". It never invents a reviewer.

## Picking the persona

- Match what the user asked for against the entries: heading text where a
  heading exists, the id otherwise. **Show which entry matched and confirm
  before reviewing**, because headings are decoration and two personas can
  read alike. Never pick silently between candidates.
- Exactly one persona in the file: use it, and say so.
- A `person:` field on the entry is a link this skill cannot verify,
  because it does not read `people.md`. When one is present, say the link
  was not checked. Nothing in the review depends on it.

## The review

Everything comes from the persona's three recorded fields, applied to the
work in front of you:

- **`pushes back on`** finds the pushback: quote each part of the work that
  matches what this persona pushes back on, and say what the objection is.
- **`reads`** finds the exposure: say what this persona will actually see
  given how they read, and what load-bearing content sits outside that.
  A persona who reads "the first paragraph and the last line" will miss a
  recommendation buried in the middle, and that is a finding.
- **`cares about`** finds the gap: what they care about that the work never
  addresses.

Each finding quotes the work and names the recorded field it came from.

## The boundary this skill holds

**The output is built from what the user recorded about this persona, and
says so. It is not a prediction of the real person.** The recorded fields
are the whole evidence; nothing is inferred about the person beyond them,
nothing is looked up, and nobody is contacted. Where the recorded fields
are too thin to answer, that is the answer: a persona with a vague
`pushes back on` produces a vague review, and saying so beats padding it.

If `voice.md` exists it lends the user's own vocabulary to the report's
wording, under its confidence rules; without it nothing is lost but
phrasing, and the report says the guide was absent only if asked why the
wording is generic.

## What it does not do

- Review as nobody-in-particular. That is what `slop-check` and
  `say-it-simply` are for.
- Soften findings into suggestions. The persona's recorded pushback is the
  pushback.
- Edit the work. It reports; the user decides what moves.
