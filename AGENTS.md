## Project Shape

- pnpm workspace: `@pricoteka/app` in `apps/frontend/`, `@pricoteka/api` in `apps/api/`, and shared exports in `packages/core/` as `@pricoteka/core`.
- Frontend entrypoint is `apps/frontend/src/main.tsx`; TanStack Router uses `createHashHistory()`, so app URLs are hash-based.
- Frontend routes are file routes under `apps/frontend/src/routes/`; `apps/frontend/src/routeTree.gen.ts` is generated and gitignored.
- Frontend imports can use `@/*` for `apps/frontend/src/*`; static assets in `apps/frontend/public/` are served from `/`.
- API entrypoint is `apps/api/src/index.ts`; it is a Hono Node server on port `3000` with permissive CORS.
- API DB is Drizzle/libSQL in `apps/api/src/db/`; `DB_FILE_NAME` defaults to `file:local.db` and local DB files under `apps/api/local.db*` are gitignored.
- Core public surface is intentionally small: `packages/core/src/index.ts` and `packages/core/src/schema.ts` are the only included source files.

## Commands

- Use pnpm workspaces; root `packageManager` is `pnpm@11.5.0`, and CI uses Node `24.15.0` with `pnpm install --frozen-lockfile`.
- Root shortcuts: `pnpm dev` runs API and frontend together; `pnpm app-dev`, `pnpm app-typecheck`, `pnpm app-build`, and `pnpm app-test` target the frontend.
- Package filters: `pnpm --filter @pricoteka/app <script>`, `pnpm --filter @pricoteka/api <script>`, `pnpm --filter @pricoteka/core <script>`.
- Frontend `dev`, `typecheck`, `build`, `lint`, `format`, and `test` first run `prepare:checks`, which concurrently validates i18n and regenerates TanStack routes.
- Focused frontend tests: run `pnpm --filter @pricoteka/app prepare:checks` once, then `pnpm --filter @pricoteka/app exec vitest run <file>`.
- Focused core tests can run directly with `pnpm --filter @pricoteka/core exec vitest run <file>`.
- `pnpm test` runs package test scripts that exist; API currently has no test script.
- Root `pnpm lint` and `pnpm format` run app `prepare:checks` before `oxlint .` / `oxfmt --check .`; root `pnpm format:fix` uses `oxfmt --write .`.
- API DB commands are package-local: `pnpm --filter @pricoteka/api db:generate`, `db:migrate`, `db:push`, and `db:studio`.
- Use `pnpm fallow:changed` for a changed-since-HEAD fallow audit.

## Generated Files

- Do not edit generated or build-output files: `apps/frontend/src/routeTree.gen.ts`, `apps/frontend/build/dist/`, `apps/frontend/dist/`, frontend `stats*.html`/`stats.json`, or package `dist/` directories.
- API migrations live in `apps/api/drizzle/`; edit `apps/api/src/db/schema.ts` and regenerate with Drizzle Kit instead of hand-editing generated snapshots under `apps/api/drizzle/meta/`.
- Edit translations in `apps/frontend/src/locales/<locale>/translation.json`; supported locales and resources are hardcoded in `apps/frontend/src/lib/i18n.ts`.
- `validate:i18n` compiles `apps/frontend/build/*.ts` to `apps/frontend/build/dist/` before running `apps/frontend/build/validate-i18n.ts`.
- Locale IDs must be lowercase, and every non-default locale must match default `en` message keys exactly.

## Tooling Quirks

- Vite plugins include TanStack Devtools, Tailwind CSS v4, TanStack Router codegen with `autoCodeSplitting: true`, React, React Compiler via `@rolldown/plugin-babel`, and bundle visualizer outputs.
- React Compiler is enabled; avoid routine `useMemo`/`useCallback` unless there is a concrete need or an existing pattern.
- Vitest uses `jsdom`, excludes `**/build/dist/**`, and loads `apps/frontend/src/test/setup.ts` for jest-dom matchers.
- Frontend test setup resets i18n to `en` before each test and mocks `matchMedia` and `scrollTo`.
- Tailwind is configured through the Vite plugin; `apps/frontend/src/index.css` also imports `tw-animate-css`, shadcn CSS, Geist font, and theme tokens.
- shadcn is configured by `apps/frontend/components.json` with `base-mira`, Base UI-style components, Phosphor icons, and aliases like `@/components`, `@/components/ui`, and `@/lib/utils`.
- Treat `apps/frontend/src/components/ui` as generated/vendor-style UI primitives; do not edit it unless explicitly asked.
- Frontend `allowImportingTsExtensions` means imports with `.tsx`/`.ts` extensions can be intentional.
- `erasableSyntaxOnly` is enabled in frontend/core TypeScript configs; `noUnusedLocals` and `noUnusedParameters` are enabled repo-wide.

## Verification

- CI builds/lints/formats in dependency order: core, API, then app; tests run core, then app.
- Frontend changes: prefer `pnpm app-build` and `pnpm app-test`; add `pnpm lint` / `pnpm format` when touching broadly formatted code.
- API changes: run `pnpm --filter @pricoteka/api build`, `pnpm --filter @pricoteka/api lint`, and `pnpm --filter @pricoteka/api format`.
- Core changes: run `pnpm --filter @pricoteka/core build`, `pnpm --filter @pricoteka/core test`, `pnpm --filter @pricoteka/core lint`, and `pnpm --filter @pricoteka/core format`.
