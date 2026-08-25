# always-allow

Skills for people who use AI a couple of times a week and do not live in a
terminal. The general marketplace, and the one taught in the workshops.

Two rules govern every skill here:

- **Never ask someone to type in what a skill could go and find.** Search
  first, show what was found, ask them to confirm or correct.
- **A skill that has to be remembered does not exist.** The default trigger is
  a schedule or something that already happens, usually the calendar. Invoking
  by hand is the fallback, not the design.

## What is here so far

| Plugin | Skills | State |
|---|---|---|
| `setup` | `install`, `check` | Built. The verifier is fixture-tested; three review rounds answered |
| `writing` | `sound-like-me`, `slop-check`, `review-as`, `say-it-simply` | Built. One plan review round settled at build |

Five more plugins are planned (`daily-hq`, `meetings`, `growth`, `learning`,
`decisions`); their plans live outside this repo until they are built.

This repo is not yet published, so there is no install command to give you
yet.

## Where everything gets written

Markdown files in the project folder. Nothing else. No Notion, no database,
no account. The file formats every skill reads by are in
`plugins/setup/skills/install/references/file-schemas.md`.

## Tests

```bash
node tests/run-all.js
```
