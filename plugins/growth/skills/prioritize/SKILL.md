---
name: prioritize
description: Rank a set of things against the user's confirmed priorities. Works on the coming week, a pasted list, or one new request ("should I take this on?"). Use when the user says "prioritize this", "rank these", "what should I do first", "should I say yes to this", "where does this fit", or accepts the offer time-spent makes at the end of its weekly run. Never writes anything and never invents a priority.
---

# prioritize

Rank what is in front of you against what you said mattered, and show the
work.

The standard is `priorities.md` at the top level of the project folder, as
the contract defines it
(`../../../setup/skills/install/references/file-schemas.md`). It is the
hard stop: missing, unreadable, or holding no entries each stop this
skill, named apart but in the user's language: "you haven't confirmed any
priorities, so there's nothing to rank against. Want to set them up?"
`people.md` is optional and supplies wording only: an ask from an entry
there can be named by relationship ("from your manager"), never weighted
by it.

## What it ranks

1. **A list.** Pasted, dictated, or the coming week's asks as the person
   states them. Each item is ranked, not rewritten.
2. **One request.** The item is placed against every priority and the
   answer is where it lands and why, including "this matches nothing you
   said mattered", which is a legitimate answer and often the useful one.

The invocation is the ask. When nothing was handed over, ask for the list
in one line; never scrape one together from sources this skill has no
contract to read.

## The ranking

1. Match each item against every priority's `include` and `exclude` by the
   contract's rules: lowercased, punctuation to spaces, whole words, quoted
   phrases in order, **no inflections**, and an entry's `exclude` blocks
   that entry only. Every placement names the term that made it.
2. An item matching several priorities takes the highest rank; ties break
   by id, alphabetically. An item matching nothing goes in its own section
   at the bottom, plainly labelled, never forced under the nearest
   priority.
3. Output order is priority rank, then the unmatched section. For one
   request: where it landed, the term, and what currently ranked above it
   would have to give way.
4. When a placement looks wrong, the terms are the likeliest cause; say
   which term to add or exclude to fix it, so the correction lands in
   `priorities.md` where it holds, not in this one answer.

## Someone else's projects

Ranking a report's projects **against their goals, not yours**, needs
their goals written down, and nothing in these files can hold another
person's goals yet. Say exactly that when asked, offer the honest
substitute, ranking their list against **your** priorities with the
substitution named in the output, and do not fake their side. This is a
deliberate v1 limit, not a missing feature to improvise around.

## What it does not do

- Write to any file, `priorities.md` included; it proposes term changes
  and the person makes them.
- Read mail, calendar or chat. What it ranks is what it was handed.
- Invent, reorder or retire a priority. It applies the ranks that exist.
- Pretend to know another person's goals.

## The honest limit

The ranking is only as good as the include terms, and word matching does
not handle inflections: "renewals" misses `renewal`. The output names
every matched term precisely so a bad match is visible and fixable in the
file where the terms live.
