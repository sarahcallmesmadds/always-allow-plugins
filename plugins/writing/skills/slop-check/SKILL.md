---
name: slop-check
description: Check a draft, document, or deck for the habits that mean nobody edited it before shipping, plus claims the material itself cannot support. Names the specific lines so each finding can be fixed or sent back to whoever produced it. Use when the user says "slop-check this", "does this read like AI", "check this before I send it", "did anyone review this". Read-only; changes nothing unless asked.
---

# slop-check

Report how much a piece of writing looks generated and shipped unedited,
and point at exactly where. This is the always-allow version: it reads
prose, not code, and it reports; it cannot block anything, because nothing
here runs hooks, and it says so rather than implying enforcement.

It is a fresh build. It shares a name with the `infra-plugins` skill for
people who write code, and they diverge by design.

## What it looks for

**Proof, first.** Generation artefacts left in the text: `oaicite`,
`[cite: 1]`, "As of my last update". One is enough; these are facts, not
taste.

**The person's own rules.** If `voice.md` exists in the project folder, its
`Never` list is checked as their standing rules, under the confidence table
in the contract: applied plainly under `corrected`, applied with "which you
have not confirmed" under `accepted`, not applied under `absent`. Without
`voice.md` the check runs and says the personal-rules pass was skipped.
On a document somebody else wrote, their hits are listed under a heading
saying whose rules they are, and counted against nothing.

**The habits.** Filler, machine vocabulary, hedging that takes no position,
forced enthusiasm, antithesis and lists of three, sentences all the same
length, and, in anything that proposes, options with no recommendation. A
document that decides nothing is the most common shape of work produced by
something with no stake in the outcome.

**Claims the material cannot support.** Numbers, absolutes and superlatives
with nothing behind them in what was supplied. The finding is always
"unsupported in what you gave me", never "false": this skill cannot check
the world. It never supplies a smaller claim as true and never invents an
example. It offers the shape of a supportable sentence and asks for the
fact that fills it, or marks the line "needs verification".

## How to report

1. **Checkable problems first**: artefacts and unsupported claims, quoted.
2. **One aggregate line.** Distinct habit categories, not raw match counts;
   every habit here also appears in good human writing.
3. **The specific lines, quoted.** "There is filler" is useless; "this
   sentence is the filler" is actionable.
4. **One thing to do.** Their own work: offer the fix. Someone else's: one
   sendable sentence aimed at the missing review, such as "this reads as
   unreviewed and its numbers have no source". Never an accusation.

## When they want it fixed

Offer, do not assume. Cut filler outright, swap machine vocabulary for the
specific thing meant, and where the writing hedges symmetrically ask what
they actually think and write that. Keep their voice throughout; the goal
is their work with the tics removed.

## What this is not

It does not detect AI authorship and is never described as doing so. Plenty
of people write this way and plenty of generated text does not. The honest
claim is "consistent with work nobody reviewed", never "a machine wrote
this". And it cannot stop anyone shipping anything: prevention, such as it
is, lives in the project instructions `setup` hands over, which nothing in
Cowork can prove were read.
