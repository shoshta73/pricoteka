## Project Shape

- pnpm workspace: `@pricoteka/app` in `apps/frontend/`, `@pricoteka/api` in `apps/api/`, `@pricoteka/website` in `website/`, shared schemas/types in `packages/core/`, and shadcn/theme primitives in `packages/ui-core/`.
- Frontend entrypoint is `apps/frontend/src/main.tsx`; TanStack Router uses `createHashHistory()`, so app URLs are hash-based.
- Frontend routes are file routes under `apps/frontend/src/routes/`; `apps/frontend/src/routeTree.gen.ts` is generated and gitignored.
- Frontend imports can use `@/*` for `apps/frontend/src/*`; `@pricoteka/ui-core` is imported only through per-component exports like `@pricoteka/ui-core/button` plus `@pricoteka/ui-core/styles.css`.
- API entrypoint is `apps/api/src/index.ts`; it is a Hono Node server on port `3000` with permissive CORS.
- API DB is Drizzle/libSQL in `apps/api/src/db/`; `DB_FILE_NAME` defaults to `file:local.db`, and `apps/api/local.db*` is gitignored.
- `packages/core` only publishes `src/index.ts` and `src/schema.ts`; add exports there deliberately.

## Commands

- Use pnpm `11.5.0`; CI uses Node `24.15.0` and `pnpm install --frozen-lockfile`.
- Root shortcuts: `pnpm dev` runs API and app together; `pnpm app-dev`, `pnpm app-build`, `pnpm app-test`, `pnpm app-typecheck`, `pnpm website-dev`, and `pnpm website-build` target common packages.
- Package filters: `pnpm --filter @pricoteka/app <script>`, `pnpm --filter @pricoteka/api <script>`, `pnpm --filter @pricoteka/core <script>`, `pnpm --filter @pricoteka/ui-core <script>`, `pnpm --filter @pricoteka/website <script>`.
- App `dev`, `build`, `typecheck`, `test`, `lint`, and `format` run `prepare:checks`, which concurrently validates i18n and regenerates TanStack routes.
- Focused app tests: run `pnpm --filter @pricoteka/app prepare:checks` once, then `pnpm --filter @pricoteka/app exec vitest run <file>`.
- Focused core tests can run directly with `pnpm --filter @pricoteka/core exec vitest run <file>`.
- `pnpm test` runs package test scripts that exist; API, UI core, and website currently have no test script.
- Root `pnpm lint` and `pnpm format` also run app `prepare:checks`; use `pnpm fallow:changed` for a changed-since-HEAD fallow audit.
- API DB commands are package-local: `pnpm --filter @pricoteka/api db:generate`, `db:migrate`, `db:push`, and `db:studio`.

## Generated And Vendor Files

- Do not edit generated/build output: `apps/frontend/src/routeTree.gen.ts`, `apps/frontend/build/dist/`, `apps/frontend/dist/`, frontend `stats*.html`/`stats.json`, or any package `dist/`.
- For DB schema changes, edit `apps/api/src/db/schema.ts` and regenerate Drizzle output; do not hand-edit `apps/api/drizzle/meta/` snapshots.
- Treat `packages/ui-core/src/components/ui` as shadcn/vendor-style primitives; avoid editing it unless explicitly asked.
- Edit translations in `apps/frontend/src/locales/<locale>/translation.json`; supported locales are hardcoded in `apps/frontend/src/lib/i18n.ts`.
- Locale IDs must be lowercase, and every non-default locale must match default `en` message keys exactly.

## Tooling Quirks

- Vite/TanStack Router codegen has `autoCodeSplitting: false`; React Compiler is enabled via `@rolldown/plugin-babel`, so avoid routine `useMemo`/`useCallback` unless needed or already patterned.
- Vitest for the app uses `jsdom`, excludes `**/build/dist/**`, and loads `apps/frontend/src/test/setup.ts` for jest-dom, i18n reset to `en`, `matchMedia`, and `scrollTo` mocks.
- Tailwind v4 is via the Vite plugin; shared shadcn CSS, `tw-animate-css`, Nunito font, and theme tokens live in `packages/ui-core/src/styles.css`.
- Frontend and UI core allow `@/*` path aliases; frontend `allowImportingTsExtensions` means `.ts`/`.tsx` import suffixes can be intentional.
- `erasableSyntaxOnly` is enabled in frontend/core/ui-core TS configs; `noUnusedLocals` and `noUnusedParameters` are enabled repo-wide.

## Verification

- CI builds in dependency order: core, then API/UI core, then app/website; app CI builds UI core first.
- CI tests core first, then builds core and UI core before `pnpm app-test`.
- CI lint/format runs package scripts in order: core, API, UI core, then app/website.
- Frontend changes: prefer `pnpm app-build` and `pnpm app-test`; add `pnpm lint` / `pnpm format` when touching broadly formatted code.
- API changes: run `pnpm --filter @pricoteka/api build`, `pnpm --filter @pricoteka/api lint`, and `pnpm --filter @pricoteka/api format`.
- Core changes: run `pnpm --filter @pricoteka/core build`, `pnpm --filter @pricoteka/core test`, `pnpm --filter @pricoteka/core lint`, and `pnpm --filter @pricoteka/core format`.
- UI core changes: run `pnpm --filter @pricoteka/ui-core build`, `pnpm --filter @pricoteka/ui-core lint`, `pnpm --filter @pricoteka/ui-core format`, plus `pnpm app-build` and `pnpm app-test` for consumer coverage.
