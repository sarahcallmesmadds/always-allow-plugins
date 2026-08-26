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
| `writing` | `sound-like-me`, `slop-check`, `review-as`, `say-it-simply` | Built. Four review rounds, the last one eight live executions |
| `growth` | `time-spent`, `prioritize`, `wins`, `give-me-feedback` | Built against the amended contract after its Codex round; not yet live-tested |
| `learning` | `teach-me`, `best-in-class`, `a-better-way` | Built. Two plan rounds and three build rounds, the last one clean; needs no contract change; not yet live-tested |

Two more plugins are planned (`daily-hq`, `meetings`) and one
(`decisions`) is parked; their plans live outside this repo until they
are built.

Install:

```
/plugin marketplace add sarahcallmesmadds/always-allow-plugins
```

## Where everything gets written

Markdown files in the project folder. Nothing else. No Notion, no database,
no account. The file formats every skill reads by are in
`plugins/setup/skills/install/references/file-schemas.md`.

## Tests

```bash
node tests/run-all.js
```
