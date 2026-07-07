# Contribution Heatmap Range Polish

## Purpose / User-Visible Outcome

Keep GitHub and GitLab contribution metric cards truthful while restoring a compact heatmap range that does not show years of sparse empty columns. The visible heatmap should represent the recent one-year activity window, while Contributions, Active days, and Longest streak remain calculated from the full available provider snapshot.

## Progress

- [x] Confirmed current GitLab JSON can render a huge 2010-present empty/sparse heatmap.
- [x] Update GitHub and GitLab snapshot builders to separate metric range from heatmap range.
- [x] Update durable docs that describe contribution behavior.
- [x] Refresh available snapshots where possible.
- [x] Validate TypeScript/build behavior.
- [x] Commit and push.

## Surprises and Discoveries

- The checked-in GitHub snapshot is unavailable because no build-time `GITHUB_TOKEN` is present locally.
- The checked-in GitLab snapshot currently uses `rbriones`, matching the documented workflow mismatch, and can produce a very large all-zero heatmap.

## Decision Log

- Use the full fetched provider data for metric cards.
- Use the most recent 12 months / 365 days through build date for heatmaps, matching the more familiar compact contribution-calendar UI.
- Keep the active deployment static and backend-free.

## Context and Orientation

Relevant files:

- `scripts/build-github-contributions.mjs`
- `scripts/build-gitlab-contributions.mjs`
- `resources/js/components/portfolio/github-contributions.tsx`
- `resources/js/components/portfolio/gitlab-contributions.tsx`
- `PRODUCT.md`, `DESIGN.md`

## Plan of Work

1. Add a helper for resolving the heatmap start date as 365 days before the build date.
2. Keep summary calculations on the full range from first contribution through today.
3. Build `weeks` from the recent heatmap range only.
4. Adjust range labels/docs so they do not imply the heatmap is all-time.
5. Run focused validation and push.

## Concrete Steps

- Edit both contribution build scripts.
- Update control docs for current contribution behavior.
- Attempt `npm run refresh:gitlab`; note if GitHub cannot refresh without token.
- Run `git diff --check`, `npx tsc --noEmit`, and relevant build/lint if practical.
- Commit and push.

## Validation and Acceptance

Accepted when:

- Heatmap JSON no longer spans many years.
- Metric fields are still based on all fetched provider counts.
- TypeScript passes.
- Commit is pushed, or push failure is clearly reported.

## Outcomes and Retrospective

GitHub and GitLab builders now calculate metric cards from the full fetched range, but render only the most recent 365 days in the heatmap. GitLab was refreshed successfully for `NaguioMervina`; GitHub remains unavailable locally because no `GITHUB_TOKEN` is configured.

## Idempotence and Recovery Notes

Rerunning refresh scripts should deterministically rewrite snapshots for the current date/provider availability. If a provider is unavailable, existing fallback behavior writes an unavailable payload and the site still builds.

## Security Check

No runtime secrets are added. `GITHUB_TOKEN` remains build-time only and must not use a `VITE_` prefix. Public data is rendered through React escaping.
