# GitHub Project v2 Tracker Reference

## Prerequisites

- Install GitHub CLI (`gh`) and authenticate with required scopes.
- Minimum scope for project updates: `project`.
- Typical setup command:

```bash
gh auth login --scopes "repo,project"
```

- Verify access:

```bash
gh auth status
```

## Script Entry Point

Use:

```bash
python3 scripts/gh_project_tracker.py <command> [flags]
```

## Commands

### 1. Overview

List project issues and classify as `bug`, `feature`, or `other` from labels.

```bash
python3 scripts/gh_project_tracker.py overview \
  --owner your-org \
  --project-number 12 \
  --types bug,feature \
  --state open
```

JSON output:

```bash
python3 scripts/gh_project_tracker.py overview \
  --owner your-org \
  --project-number 12 \
  --state all \
  --json
```

### 2. Create Issue + Link to Project

```bash
python3 scripts/gh_project_tracker.py create-issue \
  --repo your-org/your-repo \
  --title "Dashboard crashes on mobile" \
  --body "Repro: open dashboard on iOS Safari" \
  --type bug \
  --project-owner your-org \
  --project-number 12 \
  --status "Todo"
```

Set additional project fields:

```bash
python3 scripts/gh_project_tracker.py create-issue \
  --repo your-org/your-repo \
  --title "Add usage analytics panel" \
  --type feature \
  --project-owner your-org \
  --project-number 12 \
  --field "Priority=P1" \
  --field "Estimate=5"
```

### 3. Update Existing Issue + Project Fields

```bash
python3 scripts/gh_project_tracker.py update-issue \
  --repo your-org/your-repo \
  --issue-number 184 \
  --state open \
  --add-label "customer-reported" \
  --project-owner your-org \
  --project-number 12 \
  --status "In Progress"
```

Dry-run example:

```bash
python3 scripts/gh_project_tracker.py update-issue \
  --repo your-org/your-repo \
  --issue-number 184 \
  --type bug \
  --status "Done" \
  --dry-run
```

## Field Value Rules

- `SINGLE_SELECT`: pass the option display text exactly as shown in the project.
- `TEXT`: pass any string.
- `NUMBER`: pass numeric value (`3`, `5.5`).
- `DATE`: pass `YYYY-MM-DD`.

Unsupported field types fail fast with a clear error.

## Label-Based Classification

- Bug labels recognized: `bug`, `type:bug`, `kind/bug`, `defect`
- Feature labels recognized: `enhancement`, `feature`, `type:feature`, `kind/feature`

Use `--type bug` or `--type feature` during create/update to apply canonical labels.
