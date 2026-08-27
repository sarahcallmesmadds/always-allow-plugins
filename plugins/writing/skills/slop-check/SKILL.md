---
name: slop-check
description: Check a draft, document, or deck for the habits that mean nobody edited it before shipping, plus claims the material cannot support. Names the specific lines so each finding can be fixed or sent back. Use when the user says "does this sound like AI", "does this look AI-generated", "can people tell AI wrote this", "make this less AI", "is this okay to send", "check this before I send it", "did anyone review this", "slop-check this". Reports by default; fixes in the same reply when the ask itself requests changes.
---

# slop-check

Report how much a piece of writing looks generated and shipped unedited,
and point at exactly where. This is the always-allow version: prose, not
code. It shares a name with the `infra-plugins` skill for people who
write code, and they diverge by design.

Given an empty or trivial input, say so and stop.

## First, whose document is this

The report's shape pivots on ownership. The ask usually says: "is this
okay to send", "make this less AI", "does this sound like AI" and "check
this before I send it" are the user's own work; "someone sent me this",
"did anyone review this thing from X" is someone else's. When the ask says neither, ask once
before reporting. Their own work gets fixes; someone else's gets findings
they could forward, with their personal rules listed separately and
counted against nothing, because a rule the writer never agreed to is not
a fault in the writer's draft.

**When the ask itself requests change** ("make this less AI"), the
invocation authorizes the fixes: report and apply them in the same reply,
under the fix rules below. Otherwise report only, and offer.

## What it looks for

**Leftovers, first.** Machine citation markers (`oaicite`, `[cite: 1]`)
and phrases like "As of my last update". One is enough; these are facts,
not taste, and they are reported wherever they sit, **inside quoted
material included**.

**The person's own rules.** If `voice.md` exists at the top level of the
project folder, its `Never` list is checked as their standing rules under
the contract
(`../../../setup/skills/install/references/file-schemas.md`), read-time
checks included: `corrected` applies plainly; `accepted` applies,
labelled once as unconfirmed; `absent` applies nothing; missing,
unreadable, and unknown-version are told apart, each earning one plain
line. Without the file: "I couldn't check your personal writing rules;
you haven't set up a voice guide. Want to?" An empty `Never` list is said
too, since silence would read as the rules passing. **A hit that the
`How I sound` section arguably endorses** (a banned intensifier inside
exactly the kind of qualifier the guide says to leave in) **is reported
as a tension in the guide, never asserted as a violation.** **Never counted as a
violation of a Never rule**: material attributed to another speaker,
proper nouns, numbers, dates, amounts, and a sentence citing or restating
the rule, per the contract's reporting exemptions.

**The habits.** Filler, machine vocabulary, hedging that takes no
position, forced enthusiasm, antithesis and its cousins that pattern
tools missed on real rejected drafts: the **bridge sentence**, whose only
job is to assert a connection the reader already sees ("This agenda is
built around that same question"); the **fragment beat** ("And the
people."); the **negating reversal** split over two sentences and the
**mirrored parallel closer**; the **paragraph tricolon**, three
identically shaped paragraphs in a row; **runs of same-shaped short
declaratives**, near-uniform in length even when not identical; the
**rhetorical rule of three**, three items shaped for effect rather than
counted from content (a genuine enumeration of 3 real things the writer
actually means is not this habit, and is at most a note); and the **label
bullet**: every point a bolded label plus explanatory clause in brochure
phrasing. The label-bullet test
is the observable pattern itself; fire when it saturates a document or
fights the document's own plainer style.

**Claims the material cannot support.** Numbers, absolutes and
superlatives with nothing behind them in the draft, the conversation, or
the project's files, and which a reader would actually challenge:
superlatives, comparisons, causal claims, suspiciously round totals. An
ordinary figure in a routine status is not a finding. The finding is
always "unsupported in what I can see", never "false": this skill cannot
check the world. It never supplies a smaller claim as true and never
invents an example; it offers the shape of a supportable sentence with a
visible blank for every fact, direction of change included, and asks for
what fills it.

**Whether it decides anything, asked, never guessed.** When the text
carries plan furniture (options, phases, dates, commitments to build or
change something), end the report with one question: "is this a plan or
proposal? If yes I'll also check three things plans need." On a yes, add:
options with no recommendation; no owner and no date; and no cut line,
nothing saying what it is not doing. That last one is the most useful
question to ask of any proposal. The author answers what the document is; a
classifier cannot reliably settle that from the text alone. Text without plan
furniture gets no question.

## How to report

1. **Checkable problems first**: leftovers and unsupported claims, quoted.
2. **One aggregate line**, counting distinct habit categories rather than
   raw matches, with two riders: a document saturated wall-to-wall by a
   single habit is a strong reading, not a low one, and when exemptions
   put much of the text out of reach, the line says what share the checks
   could examine, so an all-quoted draft never reads as a clean pass.
3. **The specific lines, quoted.** "There is filler" is useless.
4. **One thing to do**: the single highest-leverage fix or, for someone
   else's work, one sendable sentence aimed at the missing review, never
   an accusation.
5. **On work that is not the user's own, the report body itself carries
   one line**: "this checks for signs of missing review, not authorship;
   it is not evidence a machine wrote it." The disclaimer travels with
   the text because the text gets forwarded.

All status notices (voice-guide state, empty list, share examined) fold
into at most two lines of the report, never one line each.

## When fixing

Cut filler outright; swap machine vocabulary for the specific thing meant
when the material names it, and ask when it does not; where the writing
hedges symmetrically, ask what they actually think and write that. Keep
their voice throughout. Fix only on the invocation's authority or an
explicit yes, never assumed from a bare "check this".

## What this is not

It does not detect AI authorship and is never described as doing so, in
the report body included. Plenty of people write this way and plenty of
generated text does not. And it cannot stop anyone shipping anything; it
reports, and the sending stays theirs.

Version: writing 0.1.2, 2026-08-27.
