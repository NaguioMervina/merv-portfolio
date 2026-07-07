# Design

This file captures stable UI and interaction guidance for the portfolio.

## Public Portfolio Direction

- The public surface is intentionally recruiter-first rather than blog-like or dashboard-like.
- Layout should prioritize fast scanning:
  - positioning first,
  - proof second,
  - contact path last.
- Visual treatment can be polished and modern, but it should still read as professional software work rather than a decorative landing page.

## Stable Portfolio Sections

- Keep these sections in a clear top-to-bottom narrative:
  - hero,
  - about / positioning,
  - skills,
  - projects,
  - experience,
  - GitLab activity,
  - GitHub activity,
  - contact.
- Navigation anchors should map to those sections directly.

## Project Card Interaction

- Public project cards use the whole card as the details trigger.
- Project section cards should read like concise professional case-study previews with clear project status, technology tags, and delivery context.
- External live and source links stay inside the project modal so the card has one predictable action.
- The spotlight project card label reads "Open live site" rather than "Open case study".
- Project dialogs must remain scrollable on short screens, preserve contrast in dark mode, support keyboard dismissal, and return focus to the selected card.

## Contact Interaction

- The contact form opens a prefilled email draft instead of sending to a backend.
- Form copy should avoid promising that a message was stored or delivered by the site.
- The email address should remain visible as a direct fallback.

## Contribution Section Rules

- GitLab and GitHub data should feel like proof, not decoration.
- Contribution metric cards should represent the full fetched provider range when provider data is available.
- Contribution heatmaps should show the most recent 365-day window through the build date to avoid years of sparse empty columns.
- Heatmaps must stay horizontally scrollable on narrow screens instead of clipping cells.
- Month labels and Monday / Wednesday / Friday row labels should remain visible.
- The sections may mention that the data is a build snapshot, but they should not imply live backend storage.

## Visual Review Expectations

- Review desktop and narrow/mobile layout when practical.
- Check spacing, contrast, overflow, sticky navigation behavior, and modal readability.
- Check that project thumbnails crop acceptably and that the contact form remains usable on narrow screens.
- Check that GitLab and GitHub heatmaps scroll horizontally on narrow screens.
