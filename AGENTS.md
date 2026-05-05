# UnLog — Agent Guidelines

## What this project is

A browser-based text processing tool (React + Redux + Vite + TypeScript). The user loads a file or pastes text, then builds a pipeline of filters (grep, replace, sort, sample, roundtrip, chart…) similar to a Unix shell pipeline. The pipeline configuration is serialised into the URL query string.

## Tech stack

| Layer | Choice |
|-------|--------|
| Bundler | Vite 8 (`vite.config.ts`) |
| Language | TypeScript 5 (strict), `tsconfig.json` |
| UI | React 19, functional components + hooks only |
| State | Redux via `@reduxjs/toolkit` 2, `react-redux` 9 |
| Selectors | `reselect` 5 |
| Charts | `recharts` 3 |
| Time parsing | `dayjs` (replaces moment) |

## Build & dev commands

```bash
yarn install
yarn start        # Vite dev server
yarn build        # tsc -b && vite build  → dist/
yarn deploy       # gh-pages -d dist
```

## Critical gotcha — pipe subclass fields must use `declare`

The `Pipe` base class (`src/api/pipe.ts`) uses `Object.assign(this, filter)` in its constructor to copy all filter properties onto `this`. Vite/esbuild uses native ES2020 class-field "define" semantics regardless of `tsconfig.json`, so any field declaration in a subclass (`text?: string`) compiles to a hidden `this.text = undefined` initializer that runs **after** `super()` returns and silently erases the assigned value.

**Rule:** Every field in a `Pipe` subclass that comes from the filter object MUST be declared with `declare`:

```ts
// ✅ correct — no emitted initializer
declare pattern?: string

// ❌ wrong — esbuild emits `this.pattern = undefined` after super()
pattern?: string
```

This applies to all files in `src/api/`: `text.ts`, `grep.ts`, `replace.ts`, `sort.ts`, `sample.ts`, `roundtrip.ts`, and any new pipes.

## Redux state serialisation

Redux Toolkit's `serializableCheck` middleware is active. **Never** store non-serializable values (e.g. `File`, `FileReader`, functions) in state. The `cat` filter stores the loaded file's text in `_text` and its name in `fileName`; the raw `File` object is never put in state.

Fields prefixed with `_` are stripped before URL serialisation (see `removePrivateFields` in `src/actions/filterActions.ts`).

## Architecture overview

```
src/
  api/          Pipe classes (Text, Grep, Replace, Sort, Sample, Roundtrip, Show, Chart, Dummy)
  actions/      Redux thunks (filterActions.ts, fileSelection.ts)
  reducers/     fileSelection, filters, settings  →  combined in index.ts
  selectors/    result.ts  (getChainedFilters, getResult via reselect)
  containers/   Filters.tsx, Result.tsx, FileSelection.tsx  (connected UI)
  components/   Checkbox, InputText, Select, TextArea  (dumb components)
  forks/        react-simple-file-input.tsx  (rewritten as functional component)
  store/        configureStore.ts  (exports store, RootState, AppDispatch)
  types.ts      Shared Filter, ChainedFilter, FileSelectionState, SettingsState interfaces
  constants/    actions.ts  (action type string constants)
  util/         download.ts, enumerate.ts, guessTimeFormat.ts
```

## URL persistence

`updateQuery()` in `filterActions.ts` serialises `state.filters` (minus `_`-prefixed fields) into the `filters` query param using `encodeURIComponent`/`JSON.stringify`. `initFilters()` restores them on load.

## No routing library

`react-router` was removed during the 2026 migration. Navigation state is managed entirely via `window.history.replaceState` in `updateQuery()`.
