---
name: check
description: Tell the user which always-allow skills can run today and which are blocked by which file. Use when something that worked has stopped, when another skill stops on a missing or malformed file, when a skill that should be installed cannot be found, or when the user says "check my setup", "is this still working", "what's broken", "why won't good-morning run". Read-only. It changes nothing and repairs nothing; it says what is wrong and where to fix it.
allowed-tools: Read, Bash(node:*)
---

# check

Find out what state the shared files are in, say which skills that blocks,
and change nothing.

The file formats are in `../install/references/file-schemas.md`. The table
"Which skill stops without which file" in that contract is the whole basis
for the per-skill file answer, so read the contract before reporting, and
never answer from memory. One prerequisite lives outside that table and is
handled in step 4: the two learning skills that read the live web.

## Step 1. Find the files

Look in the project folder for the nine files `install` writes: the six
contract files (`about-me.md`, `people.md`, `priorities.md`, `voice.md`,
`personas.md`, `sources.md`) and the three records (`decisions.md`,
`wins.md`, `what-ive-tried.md`). If a `setup-staging/` folder exists, an
install was interrupted; say so first, and say which files are staged
against which are live.

## Step 2. Check them against the contract

In Claude Code, run the checker on the folder holding the files:

```bash
node "${CLAUDE_PLUGIN_ROOT}"/scripts/verify.js <folder>
```

Anywhere the checker cannot run, check by hand against the contract:
required fields, id formats, the skill roster, uniqueness, enums, dates,
and that every `person:` in `personas.md` resolves to a `people.md` id.

Missing, malformed and semantically empty are three states with three
meanings. Keep them apart in everything you report; the remedies differ.

## Step 3. Report in three lists

- **Broken.** A missing or malformed file, a dangling cross-reference, a
  duplicate id. These block skills, named in step 4.
- **Worth knowing.** Real, not a failure: stale entries past 90 days, a
  semantically empty file, unknown fields being carried, a record file that
  has never gained an entry. Say each once.
- **Not checked.** Whatever this run could not look at, named. Never fold
  this list into the first two, and never summarise it as everything being
  fine.

## Step 4. Say which skills can run, from the contract's own table

For each skill in the roster, apply the hard-stop table:

- A skill whose hard-stop files are all present and well-formed **can run**.
- A skill with a hard-stop file missing, malformed, or semantically empty
  where the contract says that stops it, **is blocked**, and the report
  names the file and the state.
- A skill whose optional files are missing or stale **runs and loses
  something**; say what it loses, in the contract's words.

Lead the whole report with this. The person asked whether things work, not
for a file inventory; the inventory is the evidence underneath.

`teach-me` and `best-in-class` also need live web access for their cited
product, which this check does not and cannot test: one open page proves
nothing about the page a brief will actually need. Their file verdict is
reported from the table like everyone else's, web access goes in
**Not checked** by name, and the report says the skills test it themselves
at run time and stop without it. Never convert a web tool being present,
or one page opening, into "web access works".

## Step 5. Check the sources that can be checked from here

For each entry in `sources.md` whose kind this session has a connector for:

- Compare the identity the connector reports against the entry's `account`.
  A mismatch is a configuration failure and goes in **Broken**: reading the
  wrong account must not count as the source being checked.
- A connector that does not respond goes in **Broken** for the skills that
  require it, with the seven-status vocabulary from the contract.
- A source whose kind has no connector in this session goes in
  **Not checked**, by name.

Do not read the contents of any source. Identity and reachability only;
reading is the other skills' job, under their own rules.

## Step 6. Count the installed skills against what each plugin ships

The marketplace ships these skills per plugin:

| Plugin | Ships |
|---|---|
| `setup` | `install`, `check` |
| `writing` | `sound-like-me`, `slop-check`, `review-as`, `say-it-simply` |
| `growth` | `time-spent`, `prioritize`, `wins`, `give-me-feedback` |
| `learning` | `teach-me`, `best-in-class`, `a-better-way` |

For each plugin the person has added at all, compare the skills actually
available in this session against its row. A plugin that was never added
is **Not checked**, not a failure. A skill whose row says it ships but
whose file is not available goes in **Broken**, by name, with the one
remedy: remove the plugin, add it back, start a new chat; and if that
does not restore it, the app's copy of the marketplace may be behind,
which its plugin page shows.

Each installed skill's own last line is a Version stamp. Report the
version per plugin, and if two skills from one plugin report different
versions, say so in **Broken**: the install is a mix of snapshots.

## What this skill does not do

- **It repairs nothing and writes nothing.** A wrong file is reported with
  where to fix it: rerun `install`, or edit the file by hand. A hand edit
  to `voice.md` needs `confidence: corrected` set, and the report says so
  whenever it points someone there.
- **It cannot see scheduled tasks.** If `good-morning` never fires, the
  task may be gone; only the person can look. Say that instead of guessing.
- **It cannot prove any skill reads these files.** In Cowork nothing can.
  A clean check means the files are right, not that the skills obey them.
- **It does not judge content.** A priority that no longer matters, a
  persona that reads wrong: those are the person's to change, and `check`
  only surfaces the dates that say when each was last confirmed.

## The judgment this skill carries

Whether a bad file is worth interrupting someone over. The rule: anything
that blocks a skill in the roster is led with; everything else waits at the
bottom of the report. A person who asked "is this working" and got a page
of warnings first will not read to the part that says the morning brief is
broken.

Version: setup 0.3.1, 2026-08-26.
