# Repository Overview — Prodance FE

## Project
- **Package name**: Prodense-template
- **Display/brand**: Prodense/Prodance FE (per README branding)
- **Description**: Next.js app with Tailwind CSS and TypeScript
- **Version**: 2.1.0
- **Package manager**: npm (package-lock.json present)

## Tech Stack
- **Next.js**: 15.3.2 (App Router; see `src/app/*`)
- **React**: 19.1.0
- **TypeScript**: ^5.2.2
- **Tailwind CSS**: ^4.1.5
  - Plugins: `@tailwindcss/forms`, `@tailwindcss/typography`, `@tailwindcss/aspect-ratio`
  - PostCSS: `@tailwindcss/postcss`, `postcss`
- **Linting**: eslint ^9.29.0, `eslint-config-next` 15.3.2
- **Formatting**: prettier ^3.3.2 with `prettier-plugin-tailwindcss`, `prettier-plugin-organize-imports`
- **Images/Media**: assets in `public/` and `src/images/`; some large videos exist under `public/` and `/testimonial/`

## Scripts
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run start` — run production server
- `npm run lint` — lint with Next/ESLint

## Directory Highlights
- `src/app/` — App Router, `layout.tsx`, `not-found.tsx`, `theme-provider.tsx`
- `src/components/` — UI components (cards, sections, sliders, video, etc.)
- `src/shared/` — shared UI primitives (buttons, inputs, table, navbar, etc.)
- `src/utils/` — utilities (animations, formatting, viewport helpers)
- `src/hooks/` — custom hooks (carousel, smooth scroll, snap slider)
- `src/data/` — mock/data and types
- `src/styles/tailwind.css` — Tailwind entry
- `public/` — static assets (icons, images, videos, locales)
- `about/`, `testimonial/` — additional content/assets

## Environment
- Example file: `.env.local.example`
- Create a local env: `.env.local` (Next.js loads this automatically)

## How to Run
1. `npm install`
2. `npm run dev`
3. Build: `npm run build`
4. Start prod: `npm run start`

## Lint/Format
- Lint: `npm run lint`
- Format (suggested): `npx prettier --write .`

## Caches/Build Artifacts (safe to remove)
- `.next/`, `.turbo/`, `.eslintcache`, `coverage/`, `dist/`, `build/`, `tsconfig.tsbuildinfo`, `.parcel-cache/`, `.cache/`

## Notes
- Locales folder exists under `public/locales/` (i18n assets present; integration details TBD)
- Large media files present under `public/` and `testimonial/` — consider CDN/storage if deployment size matters.
- Tailwind v4 is used; ensure class scanning and PostCSS config are aligned.

## Potential Follow-ups
- Add `clean` script to `package.json` for removing caches (see above list)
- Confirm Node.js version and capture in `.nvmrc`/`engines` if needed
- Review `.gitignore` to ensure all cache/output paths are excluded