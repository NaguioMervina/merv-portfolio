# Merv Portfolio

Static portfolio built with React 19, TypeScript, Vite, and Tailwind CSS. The active deployment path does not require Laravel, PHP, MySQL, authentication, or an admin panel.

## Local Development

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Build

```bash
npm run build
npm run preview
```

The production build is written to `dist/`.

## Editing Content

Portfolio content is stored in:

```text
resources/js/data/portfolio.ts
```

Update profile details, skills, projects, and experience there before deploying.

Static images and public assets used by the Vite build live in `static/`.

GitLab contribution data is refreshed during the production build. To refresh it manually:

```bash
npm run refresh:gitlab
```

## Vercel

Vercel can deploy this as a normal Vite project:

- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install` or Vercel's default npm install

The checked-in `vercel.json` contains the same build and output settings.
