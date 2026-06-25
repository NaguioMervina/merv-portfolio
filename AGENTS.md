# Repository Guidelines

This repository uses `Mnemosyne` as its durable, version-controlled project memory and control-document system.

## Start Here

- Read `MNEMOSYNE.md` first.
- Then read `readme.md`, `PRODUCT.md`, `WORKFLOW.md`, `ROADMAP.md`, `SECURITY.md`, `RUNBOOK.md`, `CODESTYLE.md`, `DESIGN.md`, `ARCHITECTURE.md`, and `PLANS.md` before substantial changes.
- Update the relevant control docs when a change materially affects current behavior, workflow expectations, repo standards, or runtime instructions.

## Runtime Rules

- Treat `RUNBOOK.md` as the source of truth for supported commands and environments.
- Prefer the repository's supported runtime over host-level assumptions.
- Do not change usernames, passwords, secrets, API keys, or other credentials unless the user explicitly requested that exact credential change.
- For schema or infrastructure changes, follow the repo's documented rollout path instead of improvising.

## ExecPlans

Use an ExecPlan for:

- multi-file features,
- refactors,
- high-risk write paths,
- UI changes that alter workflow or layout,
- and any task where the safe sequence is not obvious.

Store plans under `plans/` with the next `NN-kebab-case-name.md` prefix.

## Visual Review

- When a change affects UI, capture evidence when practical.
- Review desktop plus any relevant narrow/mobile state.
- If automation is unavailable, say so plainly and use the best available manual review.

## Risk Areas

Treat these as high risk unless the new repo documents otherwise:

- authentication and authorization,
- payments or other sensitive financial writes,
- data imports and exports,
- background jobs and notifications,
- and any workflow that mutates official records.

## Validation

At minimum, use the smallest relevant validation for what changed:

- `git diff --check`
- `git status --short`
- focused syntax, lint, test, or runtime checks from `RUNBOOK.md`
- focused regression checks for nearby workflows when shared code was touched

If you could not run a meaningful validation step, say so clearly.
