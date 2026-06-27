# Product

This file records current user-visible behavior for the portfolio.

## Public Portfolio Surface

- The public portfolio is a single static page at `/`.
- The landing experience is recruiter-facing and emphasizes positioning, project proof, stack breadth, and contact clarity.
- The hero section highlights the developer's role, summary, primary actions, and quick credibility metrics.
- The portfolio includes skills, featured projects, experience history, a GitLab contribution snapshot, and contact details.
- Public identity fields shown on the portfolio, including name, email, tagline, bio, location, photo, and primary social links, are edited in `resources/js/data/portfolio.ts`.

## Project Exploration

- Projects are shown as recruiter-friendly case-study cards instead of simple link blocks.
- One spotlight project can occupy the larger lead slot, with supporting projects rendered beside it.
- Project entries may show ownership context such as contributor role and collaborator credit when that context helps represent shared work accurately.
- Selecting any project opens an in-page modal with:
  - larger visual treatment,
  - full description,
  - role and collaborator credit when provided,
  - technology tags,
  - live link when present,
  - and source code link when present.
- The modal supports Escape dismissal, backdrop dismissal, and focus return to the triggering card.

## Contact Workflow

- Visitors can use the contact form to open a prefilled email draft.
- The deployed site does not write contact submissions to a backend or database.
- The direct email address is also shown as a mail link.

## GitLab Contribution Showcase

- The portfolio shows a GitLab contribution section with summary metrics and a 365-day heatmap.
- GitLab data is fetched during `npm run build` and written to `resources/js/data/gitlab-contributions.json`.
- The deployed site renders the generated snapshot and does not need a database or runtime backend for GitLab data.
- If GitLab is unavailable during build, the portfolio still builds and shows an unavailable state.

## Current User Groups

- Recruiters and hiring managers evaluating portfolio fit
- Technical reviewers assessing implementation quality and project experience
- The portfolio owner editing static content before deployment

## Explicitly Removed From The Active Product

- Admin dashboard and CRUD screens
- Authenticated settings/profile management
- Database-backed portfolio content
- Server-side contact submission storage
- Runtime server-side GitLab scraping or contribution caching
