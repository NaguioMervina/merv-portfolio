# Workflow

This file is the durable reference for how changes are typically executed in this repository.

## Purpose

The goal is to keep future work consistent, reviewable, and safe.

## Standard Change Flow

1. Read `Mnemosyne` before substantial work.
2. Identify the owning route, service, module, job, CLI command, UI surface, or data flow first.
3. Decide whether the task needs an ExecPlan.
4. Prefer the smallest change that safely solves the actual problem.
5. Validate the exact workflow that changed plus nearby regression risks.
6. Update the durable docs when current behavior, workflow boundaries, or contributor expectations materially change.

## When An ExecPlan Is Expected

Use an ExecPlan for:

- multi-file features,
- refactors,
- UI changes that alter layout or interaction flow,
- data-writing changes with recovery or integrity risk,
- high-risk workflow changes in `[[HIGH_RISK_AREAS]]`,
- and any task where the safe sequence is not obvious.

## Common Workflow Types

### Write Paths

- Validate the exact target scope before writing.
- Prefer explicit user choices over stale defaults.
- Check adjacent workflows when shared state or handoff parameters are involved.

### UI And Interaction Changes

- Preserve established workflow speed and clarity unless redesign is intentional.
- Review empty, loading, error, and changed-selection states, not only the happy path.
- Capture UI evidence when practical.
- If the repo is being run through Docker and the change affects built assets, finish with the documented Docker refresh sequence so the running app reflects the new build.

### Reports, Exports, And Background Tasks

- Keep filter semantics explicit and stable.
- Check output structure, target rows, and runtime safety.
- Prefer timeout-safe generation paths when output is large or slow.

### Documentation-Only Changes

- Update the root control docs when repeated practice is no longer obvious from the durable docs.
- Prefer one document per concern instead of burying process rules in old plans.

## Standard Validation Flow

Match validation to the risk of the change:

- syntax, lint, or type checks for touched files,
- focused runtime validation in the supported environment,
- data inspection when integrity is involved,
- screenshot or browser review for UI changes,
- review the relevant GitHub Actions workflow files when a change can affect CI assumptions, especially `.github/workflows/tests.yml` and `.github/workflows/lint.yml`,
- and a short regression checklist for nearby affected workflows.

If a meaningful validation step could not be run, record that explicitly.

## Standard Closeout

Before calling work complete:

- confirm the changed behavior,
- note residual risks or unvalidated areas,
- update affected durable docs,
- run any required environment refresh steps from `RUNBOOK.md`,
- commit and push completed coding changes to the configured remote when the workspace has usable Git access and remote authentication,
- clearly state when commit or push could not be completed,
- and record outcomes in the ExecPlan when one exists.
