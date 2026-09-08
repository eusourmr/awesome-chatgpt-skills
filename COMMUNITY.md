# Community

This project is an independent community catalog for skills used with ChatGPT, Codex, and related OpenAI developer workflows.

## Discord

Community server: [Invite Link]

## Submit a skill

1. Read `CONTRIBUTING.md` and the Agent Skills specification at https://agentskills.io/.
2. Create a folder with a valid `SKILL.md` and only the scripts/references/assets the workflow actually needs.
3. Add or update the relevant catalog metadata.
4. Run both validators locally.
5. Run `$catalog-curator` against the candidate before opening the pull request.
6. Open a focused PR using the repository template.

### Submission template

```markdown
## Skill
- Name:
- Canonical source:
- Publisher:
- License:
- Category:
- Intended surfaces:

## Problem solved
Describe one repeatable job this skill performs.

## Evidence
- Source inspected:
- Tests/examples:
- Compatibility evidence:
- Last verified:

## Risk & permissions
- External services:
- Data accessed:
- Side effects:
- Secrets required:

## Regenerative/systemic note
Which human, social, knowledge, resource, or ecological effects matter? What feedback loop or safeguard should reviewers inspect?
```

## Review outcomes

A submission may be `accepted`, `needs-evidence`, `duplicate`, `unsafe`, or `out-of-scope`. Rejection is not a permanent label on a contributor; it is a decision about the submitted artifact and evidence at that point in time.

## Hall of Fame

| Contributor | Contribution | Recognition |
|---|---|---|
| _Open_ | First external skill accepted under the new quality system | 🥇 Founding Contributor |
| _Open_ | First substantial validator/security improvement | 🛡️ Trust Builder |
| _Open_ | First awarded community bundle | 🌱 System Builder |

The Hall of Fame is contribution-based, never paid placement.
