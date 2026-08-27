---
name: say-it-simply
description: Fix the order of an answer or document so the reader can repeat the main point and knows what to do. Leads with the answer, ends on the reader's next move, and swaps jargon for plain words. Use when the user says "say it simply", "in plain English", "simplify this", "dumb it down", "what's the bottom line", "this is too complicated", "make this clearer", "I'm lost", or pushes back that something did not land.
---

# say-it-simply

Reorder the writing around what the reader needs to do. The failure is
usually order rather than length: the ask buried, a status where a next
action should be, options with no recommendation.

Given nothing to work on, say so and stop. Keep the draft's own language;
the checks are calibrated for English and the notice line says so when
working in another.

## The test

The original passes on order when its opening sentences carry the main
point AND its last line carries the reader's action, both visible in the
text. An explicit ask to simplify the words ("plain English", "dumb it
down") always gets the word-level pass even when the order already passes.
When both order and words pass, say so and change nothing; a rewrite that
exists to justify the skill is worse than none.

## Pick the shape

| Kind | What comes first |
|---|---|
| Decision | Numbered options, the recommendation slot marked |
| Status | What happens next |
| Finding | The problem, then its cost so far |
| Explanation | The one sentence to remember, then why it matters |
| Draft | One line saying what the draft is |

**Every shape still ends on the reader's position**; the rows above order
what comes before that last line (a status ends on what the reader must
do; a draft ends on the ask).

**The recommendation slot is never filled by this skill, and a hedge is
not a pick.** It holds the author's explicit, unhedged recommendation when
the text contains one. "Option 2 seems strongest, though I haven't thought
it through" becomes "you lean toward 2 but haven't committed", never a
marked recommendation. Otherwise the slot reads "no recommendation yet:
you need to decide X".

**Nothing factual is invented, anywhere in the shape.** A finding's cost
line uses only what the source states, or reads "cost not stated". A
jargon term carrying a factual claim keeps its claim: swap it for the
effect only when the source names the effect, otherwise the term stays
and gets flagged. **Filler that asserts nothing may simply be cut**,
because cutting invents nothing; "the synergies have been operationalized
into the workstream cadence" is not a fact being protected, it is the
absence of one. The rule that forbids inventing a recommendation covers
every other fact the same way.

## What passes through untouched

- **A condition never leaves the sentence of the commitment it limits.**
  "We ship Friday if legal signs off Wednesday" moves as one piece or not
  at all; a repeatable main point that drops the "if" has changed what was
  promised, invisibly.
- **The value of every number, date and amount, quoted words and agreed
  wording pass through exactly.** The form may follow the voice guide
  ("twelve" to "12"); the value never changes. One that is unclear is
  flagged in the notice line, never reworded inline.
- Names stay. Addresses (paths, ticket ids) go only when they sit outside
  any commitment and the reader has no need to navigate; an id inside a
  promise is load-bearing and stays.

## The words

Replace jargon with the effect in plain language, under the invention rule
above. If `voice.md` exists in the project folder (defined in the
contract, `../../../setup/skills/install/references/file-schemas.md`), its
`Prefer` list supplies the user's own swaps by the contract's matching
rules and confidence table: `corrected` applies them; `accepted` applies
them, and the notice line lists which swaps came from the unconfirmed
guide so each application is visible; `absent` applies nothing.

**All notices share one slot: at most two bracketed lines directly above
the rewrite**, exempt by name from the return-only rule. The line says
which case applies, in plain words, and carries any flagged numbers:
"(used your voice guide)"; "(swapped reconcile for 'check the records',
per your voice guide, which you haven't confirmed; say the word to review
it)"; "(no voice guide set up, so this is plain wording; run setup when
you want your own words used)"; or "(your voice guide exists but has a
problem I can't read past, so I didn't use it; nothing was overwritten)".
Never repeated per change, never phrased as the user's failure, and never
advice to rerun setup over a guide that exists.

## The rules that hold everything

- Return only the improved version, plus the notice slot. Never both
  versions, never an apology, never a history of the first attempt.
- Do not narrate process the reader does not need.
- Keep numbered options stable once shown; append rather than renumber.
- Shorter is not the goal; readable is.

## What it does not do

- Fill the recommendation slot, invent a cost, or supply an effect the
  source never stated. Surface what is missing instead.
- Send or publish anything, or change a file without being asked.
- Use a shared file silently: the contract's read-time checks apply, and
  anything skipped is named in the notice slot.

Version: writing 0.1.2, 2026-08-27.
