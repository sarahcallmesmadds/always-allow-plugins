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
| `learning` | `teach-me`, `best-in-class`, `a-better-way` | Built and field-tested 2026-08-26: five scripted tests in the desktop app, five passes |

Two more plugins are planned (`daily-hq`, `meetings`) and one
(`decisions`) is parked; their plans live outside this repo until they
are built.

## Install, and how updating actually works

In Claude Code:

```
/plugin marketplace add sarahcallmesmadds/always-allow-plugins
```

In the Claude desktop app, add this repository as a skill source
(Skills, then Add), then add the plugins you want.

Three things about installs that nothing in a session will tell you:

- **Installing copies a snapshot.** You run the copy you got at install
  time, not this repository. New commits change nothing you have already
  installed.
- **Updating in the desktop app is three steps: remove the plugin, add
  it back, start a new chat.** The app refreshes its own copy of this
  repository on its own schedule (the plugin page shows when it last
  did), so a re-add is only as fresh as that copy. And a chat only gets
  the skill files that existed when it was opened, which is why the new
  chat is not optional. **In Claude Code**, update the marketplace and
  the plugin from the `/plugin` menu, then start a new session.
- **Every skill can say which version it is running.** Ask in any chat:
  "which version of teach-me are you running?" The answer is the Version
  line at the bottom of the skill itself. If it does not match this
  repository, you are running an old snapshot; update as above.

## Where everything gets written

Files in the project folder. Nothing else. No Notion, no database, no
account. The nine shared files are markdown, and the formats every skill
reads them by are in
`plugins/setup/skills/install/references/file-schemas.md`. The one
exception is `teach-me`'s brief, which saves as a Word document, because
its reader is a person rather than a skill.

## Tests

```bash
node tests/run-all.js
```
