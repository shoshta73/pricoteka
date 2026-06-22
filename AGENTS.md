# Agent Notes

## Project Shape

- Single-package Vite React app; no `pnpm-workspace.yaml` or monorepo boundaries are present.
- App entrypoint is `src/main.tsx`; the visible UI currently lives in `src/App.tsx` with global styles in `src/index.css` and component/page styles in `src/App.css`.
- Static files in `public/` are served from the web root, for example `public/icons.svg` is referenced as `/icons.svg`.

## Commands

- Use pnpm; `pnpm-lock.yaml` is the committed lockfile.
- `pnpm dev` starts the Vite dev server.
- `pnpm build` runs `tsc -b` before `vite build`; this is the main typecheck/build verification.
- `pnpm lint` runs oxlint; `pnpm lint:fix` applies oxlint fixes.
- `pnpm format` checks formatting with oxfmt; `pnpm format:fix` rewrites formatting.
- No test runner is configured in `package.json`; do not invent `pnpm test` unless a test setup is added.

## Tooling Quirks

- Vite config enables React Compiler through `@rolldown/plugin-babel` and `reactCompilerPreset()`; avoid adding routine `useMemo`/`useCallback` unless there is a concrete need.
- TypeScript uses project references from `tsconfig.json`; app code is checked by `tsconfig.app.json`, Vite config by `tsconfig.node.json`.
- `allowImportingTsExtensions` is enabled, so existing imports like `./App.tsx` are intentional.
- `erasableSyntaxOnly`, `noUnusedLocals`, and `noUnusedParameters` are enabled; unused code fails the TypeScript build.
- CSS files use native nested selectors and media queries inside rules; preserve that style when editing nearby CSS.
- `.editorconfig` sets 2-space indentation, LF endings, final newline, trimmed trailing whitespace, and 120 character max line length.

## Verification

- For code changes, prefer `pnpm build` plus `pnpm lint` and `pnpm format` when feasible.
- For formatting-only edits, `pnpm format` is the focused check.
