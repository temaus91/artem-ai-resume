---
name: github-project-tracker
description: Track and update bug/feature work in GitHub Project v2 boards and linked GitHub issues. Use when users ask Codex to triage project backlog, summarize bug vs feature status, create new bug/feature issues, move project items between statuses, or update labels/state/fields from Codex.
---

# GitHub Project Tracker

Use this skill to manage GitHub Project v2 work with repeatable `gh` commands.

## Run Workflow

1. Confirm authentication.
- Run `gh auth status`.
- If scopes are missing, run `gh auth login --scopes "repo,project"`.

2. Confirm project context.
- Capture project owner and project number.
- Run:

```bash
python3 scripts/gh_project_tracker.py overview --owner <owner> --project-number <number>
```

3. Analyze bug/feature workload.
- Use `overview` with `--types bug,feature` and `--state open`.
- Use `--json` when Codex needs structured output for summaries or follow-up edits.

4. Apply updates.
- Use `create-issue` for new bugs/features and optional project linking.
- Use `update-issue` to edit issue state/labels/body/title and project fields.
- Use `--dry-run` before multi-field or bulk edits.

5. Verify updates.
- Re-run `overview` after mutations.
- Report updated issue URLs, status values, and any partial failures.

## Command Patterns

### Project Overview

```bash
python3 scripts/gh_project_tracker.py overview \
  --owner <owner> \
  --project-number <number> \
  --types bug,feature \
  --state open
```

### Create Bug or Feature

```bash
python3 scripts/gh_project_tracker.py create-issue \
  --repo <owner/repo> \
  --title "<title>" \
  --body "<details>" \
  --type bug \
  --project-owner <owner> \
  --project-number <number> \
  --status "Todo"
```

### Update Existing Item

```bash
python3 scripts/gh_project_tracker.py update-issue \
  --repo <owner/repo> \
  --issue-number <number> \
  --state open \
  --add-label "customer-reported" \
  --project-owner <owner> \
  --project-number <number> \
  --status "In Progress"
```

## Guardrails

- Do not mutate issues or project fields until repo and project identifiers are explicit.
- Prefer canonical type labels: `bug` for defects and `enhancement` for features.
- Surface partial success clearly if issue updates succeed but project field updates fail.
- Prefer small, reversible edits over broad changes.

## References

- Read [references/github-project-v2.md](references/github-project-v2.md) for detailed command examples and field-value rules.
