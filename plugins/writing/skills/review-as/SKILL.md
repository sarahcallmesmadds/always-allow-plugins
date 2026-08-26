---
name: review-as
description: Read a draft, plan, or deck the way a specific recorded persona would, and say where they will push back. Works on anything with an audience, not only prose. Use when the user says "review this as [someone]", "what would [my boss] think of this", "how would [someone] react to this", "would [someone] sign off on this", "pretend you're [someone] reading this", "where will this get pushback". Read-only, changes nothing.
---

# review-as

Read the work as one recorded persona and report where that persona pushes
back, what they will actually see, and what they care about that is
missing. Given no work to review, say so and stop.

Personas live in `personas.md` at the top level of the project folder, per
the contract at
`../../../setup/skills/install/references/file-schemas.md`. Before using
any entry, apply the contract's read-time checks: scan the whole file for
duplicate ids, report an unknown field once, and say once when an entry's
`last confirmed` is more than 90 days old, because a review built on a
year-old read of a person is worth flagging as one. **An entry missing or
blank on a required field is set aside and named; the other entries stay
usable.**

## When it stops, and how that sounds

The skill stops when `personas.md` is missing, unreadable as the contract
demands, of a version this build does not know, or holding no usable
entries. The states are told apart and each named, **in the user's
language, not the contract's**: never "malformed" or "semantically
empty". Say where it looked before offering setup. The empty case: "You
haven't set up any personas yet. A persona is a few lines about how one
specific person reads: what they care about, what they push back on, what
they actually read. Want to add one now?" It never invents a reviewer.

## Picking the persona

- **Match the ask against ids always, and heading text as a courtesy
  where headings exist.** A candidate means word overlap with an id or a
  heading; a merely semantic fit ("my boss" against "Kate, my manager")
  is a near-miss, offered as a question, never the default path.
- **One clear candidate: state it and continue in the same reply**
  ("Reading as 'Priya, my manager'."). Visibility is the point, not a
  consent ritual.
- **More than one candidate, including two entries with the same
  heading: ask, listing them by id**, and an answer naming an id always
  resolves, whether or not the entry has a heading. One persona per
  review.
- **No candidate: stop and list what exists**, by heading and id.
- A `person:` field is a link this skill does not read; `setup` and
  `check` verify it. Nothing here depends on it, so it comes up only if
  the user asks.

## The review

Everything comes from the persona's three recorded fields, applied to the
work:

- **`pushes back on`** finds the pushback: quote each part of the work
  that matches, and say what the objection is.
- **`reads`** finds the exposure, **worded as the recorded note, not a
  prediction**: "under your note that Priya reads the first paragraph and
  the last line, the recommendation on slide 4 sits outside what she'd
  see." Never "she will miss it" as fact.
- **`cares about`** finds the gap: what they care about that the work
  never addresses.

Each finding quotes the work and names the recorded field it came from.
**Thin fields produce the review anyway, labelled**: a vague
`pushes back on` gets a vague pushback section that says it is vague,
never a refusal.

## The boundary this skill holds

**The report opens with one short block, at most two lines beyond the
privacy sentence, and all apparatus lives there**: the privacy sentence,
then one status line folding together the voice-guide state and any
read-time reports (stale entries, unknown fields, set-aside entries).
Findings start immediately after. The privacy sentence: built from your
private notes about this person, for your eyes; paste the fixes into your
work, never the review itself, because a forwarded copy hands your
private read of a colleague to the room.

The recorded fields are the whole evidence: nothing inferred beyond them,
nothing looked up, nobody contacted.

The status line names the voice-guide state truthfully, one of four:
worded per your confirmed guide; worded per your guide, which you haven't
confirmed; no guide, plain wording; guide present but unreadable, plain
wording used. Never silent, because a quietly degraded report is the
failure the shared files are designed against.

## What it does not do

- Review as nobody-in-particular; that is `slop-check` and
  `say-it-simply`.
- Soften recorded pushback into suggestions inside the review itself. The
  privacy sentence governs where the review goes; inside it, the recorded
  pushback is the pushback.
- Edit the work. It reports; the user decides what moves.
