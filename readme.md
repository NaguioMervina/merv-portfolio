# Merv Portfolio

`Merv Portfolio` is a static React + Vite portfolio intended for Vercel's free hosting tier.

This repository uses a root control-document system called `Mnemosyne`. Those docs are the durable references for product scope, workflow expectations, roadmap, security, runbook operations, code style, design, architecture, and execution planning.

## Root Control Documents

- `MNEMOSYNE.md` definition and index for the root control-document system
- `AGENTS.md` repository-specific contributor and agent instructions
- `PRODUCT.md` current user-visible behavior and scope
- `WORKFLOW.md` standard execution and validation flow
- `ROADMAP.md` intended direction and priorities
- `SECURITY.md` workflow-level security expectations
- `RUNBOOK.md` operational commands and repeatable verification patterns
- `CODESTYLE.md` coding conventions
- `DESIGN.md` stable UI and interaction guidance
- `ARCHITECTURE.md` system boundaries and major workflow structure
- `PLANS.md` ExecPlan requirements and maintenance rules

## Runtime Notes

- Supported runtime: Node.js with Vite
- Primary persistence layer: static TypeScript data in `resources/js/data/portfolio.ts`
- Preferred local environment: host Node.js or Vercel's standard Vite build image
- Backend/admin runtime: not required for deployment

## Common Commands

```bash
npm install
npm run dev
npm run build
npm run preview
npm run lint
```

## Repository Layout

- `index.html` static Vite HTML entrypoint
- `resources/js/main.tsx` React mount entrypoint
- `resources/js/pages/portfolio.tsx` public portfolio page
- `resources/js/data/portfolio.ts` editable portfolio content
- `resources/js/data/gitlab-contributions.json` generated GitLab contribution snapshot
- `scripts/build-gitlab-contributions.mjs` build-time GitLab snapshot generator
- `resources/css/app.css` Tailwind CSS entrypoint
- `static/` public assets copied into the Vite build
- `plans/` ordered ExecPlans for substantial work

## Deployment

Deploy to Vercel with:

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

The checked-in `vercel.json` records those defaults.
