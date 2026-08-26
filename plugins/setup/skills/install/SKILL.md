---
name: install
description: The first run. Sets up the always-allow skills for a new person by finding out who they are, showing them what it found, and writing the files every other skill reads. Use when the user says "set me up", "run setup", "install", "get this working", or has just installed the marketplace and nothing is configured yet.
allowed-tools: Read, Write, Bash(node:*)
---

# install

Runs once. Gets someone from "I installed this" to "it knows who I am, and
something runs tomorrow morning without me."

The file formats are in `references/file-schemas.md`, next to this file. Read
it before writing anything. It is the contract every other skill reads by, and
nothing in this skill overrides it.

## What this makes

Six files the other skills read:

| File | What is in it |
|---|---|
| `about-me.md` | Your name, your job, what you do |
| `voice.md` | How you write, so drafts sound like you |
| `people.md` | Who you deal with most, and how |
| `priorities.md` | What you are working on now |
| `personas.md` | The two or three whose opinion you care about |
| `sources.md` | Where your work lives. Which inbox, which channels |

Plus three records that start empty and fill up over time: `decisions.md`,
`wins.md`, `what-ive-tried.md`. The contract's record section governs them:
each record has exactly one skill allowed to append to it, and `wins.md`
has an entry schema. This run writes each record as the two header lines,
dated the day of this run, and never touches it again.

## Rules

- Never ask for what you can go and find. Search first, show what you found,
  ask them to confirm or correct.
- Never overwrite a file this run did not write. If one of the nine is
  already there from somewhere else, stop and say which.
- Never delete anything.
- Check every file for conflicts before writing any of them.
- An interrupted run picks up where it stopped. On starting, look for an
  aside set from a previous run (step 7) and for any of the nine files
  already present. If found, say what exists and offer to continue from
  there rather than starting over.

## The run

### 1. Explain

Say what this makes, in a few sentences. Say once, here, that anyone they
share this project with can read `people.md` and `priorities.md`, because
there is no warning later. Then move on.

### 2. Show what is connected

List the connectors actually available in this session: calendar, mail, chat,
meeting notes. For each skill family, say what will not work without what.
For example: no mail connection means the inbox skill has nothing to read.
Do not present a connector as available without seeing it respond.

### 3. Ask per source

For each connected source, two questions before reading anything:

- May I read this to set things up?
- Is there anything in it that should never be written down?

Whatever they name as off-limits stays out of every file this run writes.

### 4. Go and find it

For each of the following, search what they allowed, then show what was found,
one category at a time, and ask them to confirm or correct. Never present a
blank box to fill in.

- **Name, role, company**: from the mail account, the calendar owner, chat
  profile.
- **People**: the handful they exchange the most mail and messages with over
  the last few weeks. Propose each with the handles actually observed, typed
  per the contract (`email:`, `slack:workspace:id`). An address that shows up
  under two spellings is one person with two handles, confirmed, not two
  entries.
- **Voice**: from sent mail they allowed. Propose a short `Never` list, a
  `Prefer` list, and two or three sentences of `How I sound`. Mark the file
  `confidence: corrected` only if they actually edit it; waved through is
  `accepted`; nothing gathered is `absent`.
- **Priorities**: from recent calendar and mail subjects, propose two or three,
  each with `include` terms taken from words that actually appear. Remind them
  matching is literal: `renewal` does not match "renewals", list both.
- **Personas**: propose from the people they confirmed. A persona with a blank
  `pushes back on` is not useful; say so rather than writing one.
- **Sources**: one entry per allowed connector, with the `account` the
  connector actually reports, sensible windows (calendar gets `look ahead`),
  and `required for` filled from the roster in the contract.

### 5. Ask the two things nothing can find

- What are you trying to get better at? (goes in `about-me.md`)
- Which project does this live in? (they name it; you cannot see their
  projects)

### 6. Show the whole suggestion

All nine files, the project instructions, and the scheduled tasks, in one
pass. Take it as is, or change any part. **This is the step that makes it
theirs rather than ours.** Do not write anything until they have said yes to
the whole picture.

### 7. Write the files

True atomic replacement of nine files does not exist here. Do what the
contract says instead:

1. Write the full new set aside, in a `setup-staging/` folder in the project.
2. Verify the six contract files and every cross-reference. In Claude Code,
   run the checker:

   ```bash
   node "${CLAUDE_PLUGIN_ROOT}"/scripts/verify.js <staging-folder>
   ```

   Anywhere the checker cannot run, verify by hand against
   `references/file-schemas.md`: required fields, id formats, the skill
   roster, uniqueness, enums, dates, and that every `person:` in
   `personas.md` resolves to a `people.md` id. The checker covers all nine
   files: the six contract files in full, `wins.md` against its entry
   schema, and the other two records by their header lines.
3. Only when the staged set verifies clean, move the files into place one at
   a time, then verify the live set the same way.
4. If anything fails mid-replacement, report which files are new and which
   are old, by name, and keep the staged set so a person can finish by hand.
5. Report success only after the live set verifies. Then delete the staging
   folder, and nothing else.

### 8. Hand over the paste

A skill cannot make a project or a scheduled task. They can. Hand over, as
ready-to-paste text:

- **Project instructions** naming each of the nine files and asking every
  skill to read the ones it needs before answering. In Cowork this ask is
  the whole lever; nothing can force a skill to open a file there. In Claude
  Code a hook can enforce it, and that hook is not part of this skill.
  **With the `learning` plugin installed, the same paste carries its three
  nudge lines**: offer `teach-me` when they ask to learn, be briefed on, or
  stay current on a topic, or when a brief file with a `refreshed:` date
  over 90 days old comes up; offer `best-in-class` when they ask how they
  measure up or what to learn next; offer `a-better-way` when a sizeable
  ask is forming. These lines are learning's only triggers, so leaving them
  out leaves that plugin dormant, and a project set up before learning was
  installed does not have them until a learning skill hands them over.
- **One scheduled task per schedule-default skill they have installed**, each
  with a name, a frequency, and a one-line description. The defaults:
  `good-morning` daily before their working hours start, `follow-ups` daily
  at end of day, `why-we-decided` weekly, `time-spent` weekly, `wins` weekly
  at the end of the week, `give-me-feedback` monthly. The unnamed inbox
  skill gets no task, because it has no name yet.

Offer to run `good-morning` if it is installed, so the last thing that
happens is it working. If nothing can run at the end, say so plainly. That
is a finished run, not a failed one.

## The honest limits

- **In Cowork nothing can force a skill to open a file.** The project
  instructions name each file and ask. That is the whole lever.
- **One project holds everything**, because a skill cannot read another
  project's files. So sharing the project shares `people.md`.
- **This skill cannot see their scheduled tasks.** They can. It hands over
  the text and they do the pasting.
