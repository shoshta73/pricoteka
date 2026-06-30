# AGENTS.md

## Project Shape

- pnpm workspace with `@pricoteka/app` in `apps/frontend/`, `@pricoteka/api` in `apps/api/`, and shared TypeScript exports in `packages/core/` as `@pricoteka/core`.
- Frontend entrypoint is `apps/frontend/src/main.tsx`; TanStack Router uses `createHashHistory()`, so browser URLs are hash-based.
- Routes are TanStack Router file routes under `apps/frontend/src/routes/`; `apps/frontend/src/routeTree.gen.ts` is generated and gitignored.
- Static files in `apps/frontend/public/` are served from the app web root, e.g. reference `apps/frontend/public/icons.svg` as `/icons.svg`.
- API entrypoint is `apps/api/src/index.ts`; it is a Hono Node server that listens on port `3000`.

## Commands

- Use pnpm workspaces; `pnpm-lock.yaml` is the root lockfile and CI installs with `pnpm install --frozen-lockfile` on Node `24.15.0`.
- Root shortcuts: `pnpm app-dev`, `pnpm app-typecheck`, `pnpm app-build`, `pnpm app-test`; `pnpm dev` runs API and frontend together.
- Run package scripts directly with `pnpm --filter @pricoteka/app <script>`, `pnpm --filter @pricoteka/api <script>`, or `pnpm --filter @pricoteka/core <script>`.
- Frontend `dev`, `typecheck`, `build`, `lint`, `format`, and `test` all run `prepare:checks` first.
- `pnpm app-build` runs `prepare:checks && tsc -b && vite build`; this is the main local verification command.
- `pnpm app-test` runs app `prepare:checks` plus `vitest run`; focused app tests can use `pnpm --filter @pricoteka/app exec vitest run <file>` after `pnpm --filter @pricoteka/app prepare:checks`.
- `pnpm test` runs every package test script that exists; currently API has no test script.
- `pnpm lint` and `pnpm format` are root-wide checks that run app `prepare:checks` before `oxlint .` / `oxfmt --check .`; `pnpm format:fix` rewrites with oxfmt.
- Use `pnpm fallow:changed` for a changed-since-HEAD fallow audit.

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
- Frontend TypeScript uses project references from `apps/frontend/tsconfig.json`; app code is checked by `apps/frontend/tsconfig.app.json`, Vite config by `apps/frontend/tsconfig.node.json`.
- `allowImportingTsExtensions` is enabled in frontend/core, so imports with `.tsx`/`.ts` extensions can be intentional.
- `erasableSyntaxOnly`, `noUnusedLocals`, and `noUnusedParameters` are enabled in shared TS config; unused code fails builds/typechecks.

## Verification

- CI builds/lints/formats packages in dependency order: core, API, then app; tests run core, then app.
- For frontend changes, prefer `pnpm app-build` plus `pnpm app-test`, `pnpm lint`, and `pnpm format` when feasible.
- For API changes, run `pnpm --filter @pricoteka/api build`, `pnpm --filter @pricoteka/api lint`, and `pnpm --filter @pricoteka/api format`.
- For core changes, run `pnpm --filter @pricoteka/core build`, `pnpm --filter @pricoteka/core test`, `pnpm --filter @pricoteka/core lint`, and `pnpm --filter @pricoteka/core format`.
