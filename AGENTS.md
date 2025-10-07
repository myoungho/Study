# Repository Guidelines

## Project Structure & Module Organization
All application code lives in `my-first-react-app/`; the numbered markdown files in the repository root capture study notes and should be left intact. Within the app, `src/pages/` holds route-level views, `src/components/` contains reusable UI (with `components/ui/` for design-system wrappers and `components/auth/` for guards), and `src/store/` encapsulates Zustand slices. API helpers sit in `src/api/`, hooks in `src/hooks/`, and shared types in `src/types/`. Static assets belong in `public/`; build artifacts land in `dist/` and must not be committed.

## Build, Test, and Development Commands
Run commands from `my-first-react-app/`:
- `npm install` – hydrate dependencies after cloning or pulling.
- `npm run dev` – launch the Vite dev server with hot reloading.
- `npm run lint` – run ESLint using `eslint.config.js` to enforce project rules.
- `npm run build` – type-check via `tsc -b` and create a production bundle in `dist/`.
- `npm run preview` – serve the built assets locally for smoke testing.

## Coding Style & Naming Conventions
- Follow 2-space indentation, keep semicolons, and prefer double quotes to match existing modules; rely on ESLint to flag strays.
- Write React components and pages in `PascalCase` (e.g., `TodoList.tsx`), prefix hooks with `use` in `camelCase`, and name Zustand stores `useThingStore.ts`.
- Type everything: reuse models from `src/types/`, extend them in feature files, and import shared utilities through the `@/` alias instead of deep relatives.
- Keep UI logic lean; push formatting helpers to `src/lib/utils.ts`, and reuse primitives from `components/ui/` before adding new third-party widgets.

## Testing Guidelines
Automated tests are not wired up yet; until the team adds Vitest, describe manual verification steps for each change. When you introduce automated coverage, add dev dependencies (`npm install -D vitest @testing-library/react @testing-library/user-event`), expose them via an `npm run test` script, and colocate specs as `ComponentName.test.tsx` under `src/__tests__/` or beside the component. Exercise edge cases—auth redirects, todo CRUD flows, and error boundaries—and document remaining gaps in the PR.

## Commit & Pull Request Guidelines
Recent history relies on terse numeric commits (`10`, `9`); replace them with scoped, imperative messages such as `feat(todos): gate detail route behind auth`. Keep commits lint-clean and focused on one concern. Pull requests must link a tracking issue when available, summarize behaviour changes, list manual or automated checks, and attach screenshots for UI-impacting work. Verify `npm run lint` (and tests once added) before requesting review.

## Security & Configuration Tips
Copy `.env` to `.env.local` for developer-specific overrides and never commit secrets—only public defaults like `VITE_API_URL` belong in version control. Consume environment variables through `import.meta.env` with the `VITE_` prefix, and avoid reading `process.env` directly in browser code. Rotate URLs or tokens promptly if accidental exposure occurs.
