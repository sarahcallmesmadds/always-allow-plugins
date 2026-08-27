# always-allow-plugins

The `always-allow` plugin marketplace: skills for people who use AI a couple
of times a week and do not live in a terminal. The third marketplace, next to
`infra-plugins` (people building with AI) and `gtm-operator` (RevOps and B2B
SaaS process).

## Rules for this repo

- **Two rules govern every skill.** Never ask someone to type in what a skill
  could go and find. And a skill that has to be remembered does not exist: the
  default trigger is a schedule or something that already happens. A third
  test decides whether something is a skill at all: it has to do something you
  would not get by just asking.
- **Everything writes to files in the project folder. Nothing else.**
  No Notion, no database, no account. The default has to work for someone who
  has nothing. The nine shared files are markdown, machine-facing, and governed
  by the contract; `teach-me`'s brief is a Word document, the one deliberate
  human-facing exception, chosen after field testing showed a markdown brief is
  the wrong object for this marketplace's user.
- **The canonical file contract lives at
  `plugins/setup/skills/install/references/file-schemas.md`.** Skills read and
  write those files by that contract and nothing looser.
- **The marketplace is best-effort in Cowork and enforceable only in Claude
  Code.** Nothing in Cowork can prove a skill opened a file, a skill there
  cannot create a project or a scheduled task, nothing fires on a calendar
  event, and a skill cannot read another project's files. No skill may quietly
  assume otherwise.
- **`slop-check` and `say-it-simply` here are fresh builds** sharing a name
  with the `infra-plugins` versions, never copies. They diverge by design and
  nothing keeps them in sync.
- **Plans for unbuilt plugins live in `~/.planning/`, not in this repo.** The
  plan documents are private; this repo is written as if public.
- **Fixtures use fictional people only.** Nothing from real files, clients, or
  contacts goes into a fixture.
- **Tests run with `node tests/run-all.js`.** A change to a script lands with
  the suite green, and a defect fixed gets a check that would have caught it.
