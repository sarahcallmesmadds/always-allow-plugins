---
name: say-it-simply
description: Fix the order of an answer or document so the reader can repeat the main point and knows what to do. Leads with the answer, ends on the reader's next move, and swaps jargon for plain words. Use when the user says "say it simply", "make this clearer", "I'm lost", "what am I supposed to do with this", or pushes back that something did not land.
---

# say-it-simply

Reorder the writing around what the reader needs to do. The failure is
usually order rather than length: the ask buried, a status where a next
action should be, options with no recommendation.

## The test

Before returning anything, ask of the result:

1. Can the reader repeat the main point in one sentence?
2. Do they know what to do, decide, or stop worrying about?

If the original already passes both, say so and change nothing. A rewrite
that exists to justify the skill is worse than no rewrite.

## Pick the shape

| Kind | Shape |
|---|---|
| Decision | Numbered options, recommendation marked, context underneath |
| Status | What the reader must do, then what happens next |
| Finding | The problem, then what it has cost so far, even "nothing yet" |
| Explanation | The one sentence to remember, then why it matters |
| Draft | The ask, then one line saying what the draft is |

A decision always carries a marked recommendation; options without one hand
the analysis back to the reader. A finding always says what it has cost.

## The words

Replace jargon with the effect in plain language rather than defining it:
the reader should not have to carry the term. If `voice.md` exists in the
project folder, its `Prefer` list supplies the user's own swaps, under the
contract's confidence rules: applied plainly under `corrected`, applied
with "per your voice guide, which you have not confirmed" under `accepted`,
and not applied under `absent`, where generic plain language is used and
the empty guide is mentioned once. Without the file, generic plain language
and one line saying the pass ran without it.

Keep names, drop addresses: the name of the thing that changed stays, the
file path or ticket id goes unless the reader must navigate there.

## End on the reader's position

The last line is what the reader does, decides, or can stop worrying
about. Caveats and process go above it, never after it.

## The rules that hold everything

- Return only the improved version. Never both, never an apology, never a
  history of how the first attempt failed.
- Do not narrate process the reader does not need.
- Keep numbered options stable once shown; append rather than renumber.
- Shorter is not the goal; readable is. A short answer can still hide the
  point.

## What it does not do

- Write the missing substance. If the answer has no recommendation because
  nobody decided, surface the decision needed; do not invent one.
- Send or publish anything, or change a file without being asked.
