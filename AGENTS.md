# AGENTS.md

## Project Shape

- pnpm workspace with a single Vite React app package in `app/` as `@pricoteka/app`.
- App entrypoint is `app/src/main.tsx`; TanStack Router uses `createHashHistory()`, so browser URLs are hash-based.
- Routes are TanStack Router file routes under `app/src/routes/`; `app/src/routeTree.gen.ts` is generated and gitignored.
- Static files in `app/public/` are served from the app web root, e.g. reference `app/public/icons.svg` as `/icons.svg`.

## Commands

- Use pnpm workspaces; `pnpm-lock.yaml` is the committed root lockfile and CI installs with `pnpm install --frozen-lockfile` on Node `24.15.0`.
- Root scripts delegate to the app package: `pnpm app-dev`, `pnpm app-typecheck`, `pnpm app-build`, `pnpm app-test`, `pnpm app-lint`, and `pnpm app-format`.
- App scripts can be run directly with `pnpm --filter @pricoteka/app <script>`.
- `pnpm app-dev` runs `prepare:checks` before starting Vite.
- `pnpm app-build` runs `prepare:checks && tsc -b && vite build`; this is the main local verification command.
- `pnpm app-typecheck` runs app `prepare:checks` plus `tsc -b` without bundling.
- `pnpm app-test` runs app `prepare:checks` plus `vitest run`; focused tests can use `pnpm --filter @pricoteka/app exec vitest run <file>` after `pnpm --filter @pricoteka/app prepare:checks`.
- `pnpm app-lint` runs app `prepare:checks` plus `oxlint`; use `pnpm --filter @pricoteka/app fallow:changed` for a changed-since-HEAD fallow audit.
- `pnpm app-format` runs app `prepare:checks` plus `oxfmt --check .`; `pnpm --filter @pricoteka/app format:fix` rewrites with oxfmt.

## Generated Files

- Do not edit generated or build-output files: `app/src/routeTree.gen.ts`, `app/build/dist/`, `app/dist/`, `app/stats.html`, `app/stats-sunburst.html`, or `app/stats.json`.
- Edit translations in `app/src/locales/<locale>/translation.json`; i18n resources and supported locales are hardcoded in `app/src/lib/i18n.ts`.
- `validate:i18n` first compiles `app/build/*.ts` to `app/build/dist/`, then validates locale files with `app/build/validate-i18n.ts`.
- Locale IDs must be lowercase; every non-default locale must match the default `en` message keys exactly.

## Tooling Quirks

- Vite plugins include Tailwind CSS v4, TanStack Router codegen with `autoCodeSplitting: true`, React, then React Compiler via `@rolldown/plugin-babel` and `reactCompilerPreset()`.
- React Compiler is enabled; avoid routine `useMemo`/`useCallback` unless there is a concrete need or existing pattern.
- Vitest uses `jsdom`, excludes `app/build/dist`, and loads `app/src/test/setup.ts` for jest-dom matchers.
- Test setup resets i18n to `en` before each test and mocks `matchMedia` and `scrollTo`.
- Tailwind is configured through the Vite plugin; `app/src/index.css` also imports `tw-animate-css`, shadcn CSS, Geist font, and theme tokens.
- shadcn is configured by `app/components.json` with `base-mira`, Base UI-style components, Phosphor icons, and aliases like `@/components`, `@/components/ui`, and `@/lib/utils`.
- Treat `app/src/components/ui` as generated/vendor-style UI primitives; do not edit them unless explicitly asked.
- TypeScript uses project references from `app/tsconfig.json`; app code is checked by `app/tsconfig.app.json`, Vite config by `app/tsconfig.node.json`.
- `allowImportingTsExtensions` is enabled, so imports with `.tsx`/`.ts` extensions are intentional.
- `erasableSyntaxOnly`, `noUnusedLocals`, and `noUnusedParameters` are enabled; unused code fails `pnpm app-build`.

## Verification

- CI runs `pnpm app-build`, `pnpm app-test`, `pnpm app-lint`, and `pnpm app-format` as separate workflows.
- For code changes, prefer `pnpm app-build` plus `pnpm app-test`, `pnpm app-lint`, and `pnpm app-format` when feasible.
- For formatting-only edits, `pnpm app-format` is the focused check.
