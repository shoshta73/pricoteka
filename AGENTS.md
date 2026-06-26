# Agent Notes

## Project Shape

- Single-package Vite React app; there is no `pnpm-workspace.yaml` or package boundary.
- App entrypoint is `src/main.tsx`; TanStack Router uses `createHashHistory()`, so client URLs are hash-based.
- Routes are TanStack Router file routes in `src/routes/`; `src/routeTree.gen.ts` is generated and should not be edited.
- Static files in `public/` are served from the web root, e.g. reference `public/icons.svg` as `/icons.svg`.

## Commands

- Use pnpm; `pnpm-lock.yaml` is the committed lockfile.
- CI uses Node `24.15.0` and `pnpm install --frozen-lockfile`.
- `pnpm dev` runs `pnpm prepare:checks` before starting Vite.
- `pnpm build` runs `pnpm prepare:checks && tsc -b && vite build`; this is the main verification command.
- `pnpm typecheck` runs `pnpm prepare:checks` plus `tsc -b` without bundling.
- `pnpm test` runs `pnpm prepare:checks` plus `vitest run`; focused tests can use `pnpm prepare:checks && pnpm exec vitest run <file>`.
- `pnpm lint` runs `pnpm prepare:checks` plus `oxlint`; use `pnpm fallow:changed` for a changed-since-HEAD fallow audit.
- `pnpm format` runs `pnpm prepare:checks` plus `oxfmt --check .`; `pnpm format:fix` rewrites with oxfmt.

## Generated Files

- Edit translations in `public/locales/<locale>/translation.json`; i18n uses i18next with typed keys from the English translation file.
- `validate:i18n` first compiles `build/*.ts` to `build/dist/`, then validates locale files with `build/validate-i18n.ts`.
- Locale IDs must be lowercase and every non-default locale must match the default `en` message keys exactly.

## Tooling Quirks

- Vite plugins include Tailwind CSS v4, TanStack Router codegen with `autoCodeSplitting: true`, React, then React Compiler via `@rolldown/plugin-babel` and `reactCompilerPreset()`.
- React Compiler is enabled; avoid routine `useMemo`/`useCallback` unless there is a concrete need or existing pattern.
- Vitest uses `jsdom`, excludes `build/dist`, and loads `src/test/setup.ts` for jest-dom matchers.
- Tailwind is configured through the Vite plugin; `src/index.css` also imports `tw-animate-css`, shadcn CSS, Geist font, and theme tokens.
- shadcn is configured by `components.json` with `base-mira`, Base UI-style components, Phosphor icons, and aliases like `@/components`, `@/components/ui`, and `@/lib/utils`.
- Treat `src/components/ui` as generated/vendor-style UI primitives; do not edit them unless explicitly asked.
- TypeScript uses project references from `tsconfig.json`; app code is checked by `tsconfig.app.json`, Vite config by `tsconfig.node.json`.
- `allowImportingTsExtensions` is enabled, so imports with `.tsx`/`.ts` extensions are intentional.
- `erasableSyntaxOnly`, `noUnusedLocals`, and `noUnusedParameters` are enabled; unused code fails `pnpm build`.

## Verification

- CI runs `pnpm build`, `pnpm test`, `pnpm lint`, and `pnpm format` as separate workflows.
- For code changes, prefer `pnpm build` plus `pnpm test`, `pnpm lint`, and `pnpm format` when feasible.
- For formatting-only edits, `pnpm format` is the focused check.
