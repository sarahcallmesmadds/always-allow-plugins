---
name: a-better-way
description: Reshape the thing the user is about to ask for around the end state it actually serves. Use when the user says "a better way", "is this the right ask", "how should I ask for this", "make this prompt better", shows a request or prompt they are about to send, or is forming a sizeable ask. Reads nothing, writes nothing; returns the reshaped ask, not its answer.
---

# a-better-way

Your first instinct is usually the last step. The thing someone is about
to ask for is most often one step in a plan they have already half-made,
and the better ask names the end state instead. This skill hands back the
shape; it does not do the work.

## The method

1. Take the ask as pasted or described.
2. **Find the end state.** If the ask does not state what it is for, ask
   for it in one question: what will you have, or stop doing, when this
   has worked? This is the one thing nothing can find.
3. Hand back three things, and only these:
   - **The reshaped ask**, worded around the end state, ready to use.
   - **What the first instinct was a step toward**, in one sentence, so
     the person sees the reframe rather than taking it on faith.
   - **The one thing to ask for first**, when the reshaped ask is too
     big for a single request.

The register: quote the person's own words back. "You asked for a
spreadsheet formula. The end state you described is a weekly number in
front of you; the better ask is the report, and the formula is its last
step."

## The boundary

**The shape is the deliverable.** Never answer the reshaped ask unless
the person then asks for that. Someone who wanted the answer would have
asked the original question; they came here for the shape, and answering
it uninvited buries the shape under the work.

When the first instinct already is the end state, say so and stop. A
pass where nothing needed reshaping is a valid run, and inventing a
cleverer version of an ask that was fine is the failure mode this
boundary exists for.

## The nudge line

This skill's trigger lives in the project instructions. If the
instructions visible in this conversation do not carry the learning
nudge lines (the same three-line block `teach-me` hands over), end the
run by offering them as a paste block.

## What it does not do

- Read any file, including the nine shared files and brief files.
- Write anything.
- Send anything.
- Answer the reshaped ask unless asked.
- Rewrite style or tone; that is the writing plugin's job. This skill
  changes what is asked for, not how it sounds.
