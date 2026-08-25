---
name: prioritize
description: Rank a set of things against the user's confirmed priorities. Works on the coming week, a pasted list, or one new request ("should I take this on?"). Needs priorities the user has confirmed; without them it stops and offers to set them up. Use when the user says "prioritize this", "rank these", "what should I do first", "should I say yes to this", "where does this fit", or accepts the offer time-spent makes at the end of its weekly run. Never writes anything and never invents a priority.
---

# prioritize

Rank what is in front of you against what you said mattered, and show the
work.

The contract is `../../../setup/skills/install/references/file-schemas.md`.
If it cannot be opened, say so and do only what this text itself
specifies, nothing more. `priorities.md` is the hard stop; `people.md` is
optional and supplies wording only: an ask from an entry there can be
named by relationship ("from your manager"), never weighted by it.

## Priorities file states, told apart, spoken plainly

- **Missing:** stop; say where you looked, offer setup.
- **Malformed (will not read per its shape):** stop; name what is wrong
  in plain words, never the contract's vocabulary.
- **Semantically empty:** stop; "you haven't confirmed any priorities, so
  there's nothing to rank against. Want to set them up?"
- **Unknown schema version:** stop; "this file says it's a newer version
  than I know how to read."
- **One malformed entry:** skip it, name it, rank against the rest.

## What it ranks

1. **A list.** Pasted, dictated, or the coming week's asks as the person
   states them. Each item is ranked, not rewritten.
2. **One request.** The item is placed against every priority and the
   answer is where it lands and why, including "this matches nothing you
   said mattered", which is a legitimate answer and often the useful one.

The invocation is the ask. When nothing was handed over, ask for the list
in one line; never scrape one together from sources this skill has no
contract to read. A direct ranking has no source window and does not
claim one.

## The ranking

1. Match each item against every priority's `include` and `exclude` by
   the contract's rules: lowercased, punctuation to spaces, whole words,
   quoted phrases in order, **no inflections**. **An entry's `exclude`
   blocks that entry only**; when include and exclude both match within
   one entry, the item is excluded there and the output records that it
   was. Every placement names the term that made it, and when several
   terms in the same entry match, every one of them.
2. An item matching several priorities takes the highest rank; ties break
   by id, alphabetically. An item matching nothing goes in its own
   section at the bottom, plainly labelled, never forced under the
   nearest priority.
3. Output order is fixed: priorities in rank order, items under each in
   the order they were handed over, then the unmatched section in
   handed-over order. For one request: where it landed, the term, and
   what currently ranked above it would have to give way.
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
