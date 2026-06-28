# AGENTS.md

## Project Shape

- pnpm workspace with a Vite React app package in `apps/frontend/` as `@pricoteka/app` and shared TypeScript types in `packages/core/` as `@pricoteka/core`.
- App entrypoint is `apps/frontend/src/main.tsx`; TanStack Router uses `createHashHistory()`, so browser URLs are hash-based.
- Routes are TanStack Router file routes under `apps/frontend/src/routes/`; `apps/frontend/src/routeTree.gen.ts` is generated and gitignored.
- Static files in `apps/frontend/public/` are served from the app web root, e.g. reference `apps/frontend/public/icons.svg` as `/icons.svg`.

## Commands

- Use pnpm workspaces; `pnpm-lock.yaml` is the committed root lockfile and CI installs with `pnpm install --frozen-lockfile` on Node `24.15.0`.
- Root scripts delegate app runtime checks to the app package: `pnpm app-dev`, `pnpm app-typecheck`, `pnpm app-build`, and `pnpm app-test`.
- Root owns repository-wide quality tools: `pnpm lint`, `pnpm format`, and `pnpm fallow:*`; compatibility aliases `pnpm app-lint` and `pnpm app-format` call the root scripts.
- App scripts can be run directly with `pnpm --filter @pricoteka/app <script>`.
- `pnpm app-dev` runs `prepare:checks` before starting Vite.
- `pnpm app-build` runs `prepare:checks && tsc -b && vite build`; this is the main local verification command.
- `pnpm app-typecheck` runs app `prepare:checks` plus `tsc -b` without bundling.
- `pnpm app-test` runs app `prepare:checks` plus `vitest run`; focused tests can use `pnpm --filter @pricoteka/app exec vitest run <file>` after `pnpm --filter @pricoteka/app prepare:checks`.
- `pnpm lint` runs app `prepare:checks` plus root `oxlint .`; use `pnpm fallow:changed` for a changed-since-HEAD fallow audit.
- `pnpm format` runs app `prepare:checks` plus root `oxfmt --check .`; `pnpm format:fix` rewrites with oxfmt.

## Generated Files

- Do not edit generated or build-output files: `apps/frontend/src/routeTree.gen.ts`, `apps/frontend/build/dist/`, `apps/frontend/dist/`, `apps/frontend/stats.html`, `apps/frontend/stats-sunburst.html`, or `apps/frontend/stats.json`.
- Edit translations in `apps/frontend/src/locales/<locale>/translation.json`; i18n resources and supported locales are hardcoded in `apps/frontend/src/lib/i18n.ts`.
- `validate:i18n` first compiles `apps/frontend/build/*.ts` to `apps/frontend/build/dist/`, then validates locale files with `apps/frontend/build/validate-i18n.ts`.
- Locale IDs must be lowercase; every non-default locale must match the default `en` message keys exactly.

## Tooling Quirks

- Vite plugins include Tailwind CSS v4, TanStack Router codegen with `autoCodeSplitting: true`, React, then React Compiler via `@rolldown/plugin-babel` and `reactCompilerPreset()`.
- React Compiler is enabled; avoid routine `useMemo`/`useCallback` unless there is a concrete need or existing pattern.
- Vitest uses `jsdom`, excludes `apps/frontend/build/dist`, and loads `apps/frontend/src/test/setup.ts` for jest-dom matchers.
- Test setup resets i18n to `en` before each test and mocks `matchMedia` and `scrollTo`.
- Tailwind is configured through the Vite plugin; `apps/frontend/src/index.css` also imports `tw-animate-css`, shadcn CSS, Geist font, and theme tokens.
- shadcn is configured by `apps/frontend/components.json` with `base-mira`, Base UI-style components, Phosphor icons, and aliases like `@/components`, `@/components/ui`, and `@/lib/utils`.
- Treat `apps/frontend/src/components/ui` as generated/vendor-style UI primitives; do not edit them unless explicitly asked.
- TypeScript uses project references from `apps/frontend/tsconfig.json`; app code is checked by `apps/frontend/tsconfig.app.json`, Vite config by `apps/frontend/tsconfig.node.json`.
- `allowImportingTsExtensions` is enabled, so imports with `.tsx`/`.ts` extensions are intentional.
- `erasableSyntaxOnly`, `noUnusedLocals`, and `noUnusedParameters` are enabled; unused code fails `pnpm app-build`.

## Verification

- CI runs `pnpm app-build`, `pnpm app-test`, `pnpm app-lint`, and `pnpm app-format` as separate workflows.
- For code changes, prefer `pnpm app-build` plus `pnpm app-test`, `pnpm app-lint`, and `pnpm app-format` when feasible.
- For formatting-only edits, `pnpm app-format` is the focused check.
