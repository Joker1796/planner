# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Vite dev server (served under /planner/ base path, not /)
npm run build     # vue-tsc -b (typecheck) && vite build — this is the pre-commit gate, run it after any change
npm run lint      # eslint .
npm run format    # prettier --write .
npm run preview   # serve the production build locally
```

There is no test suite/framework configured in this project (no `test` script, no vitest/jest). Correctness is verified via `npm run build` (type checking) + `npm run lint`, plus manually driving the app in a running dev/preview server.

No CI beyond the GitHub Pages deploy workflow (`.github/workflows/deploy.yml`) — it runs on every push to `main`: `npm ci && npm run build`, then deploys `dist/` via `actions/deploy-pages`. The site is public at `https://joker1796.github.io/planner/`. `vite.config.ts` hardcodes `base: '/planner/'` for this, so local dev/preview URLs are also rooted at `/planner/`, not `/`.

## Architecture

Single-page Vue 3 (`<script setup>` + Composition API) + Pinia + Vue Router app, Russian-language UI, no backend — everything persists to a single `localStorage` key via a versioned local repository layer. PWA-enabled (installable, offline-capable via `vite-plugin-pwa`).

### Persistence layer (`src/lib/storage/`)

All app state lives in **one Pinia store** (`src/store/usePlannerStore.ts`), which is the only thing that reads/writes storage. The shape is `PersistedState` (`src/types/index.ts`), versioned:

- `schema.ts` — `STORAGE_KEY`, `CURRENT_VERSION`, `createEmptyState()`.
- `migrations.ts` — `Record<number, (old) => new>` keyed by the version being migrated **from**. `repository.ts`'s `loadState()` applies these in a loop until `CURRENT_VERSION` is reached.
- **Whenever you add a new top-level array to `PersistedState` (a new domain concept), you must**: bump `CURRENT_VERSION`, add a migration entry initializing the new array to `[]`, and update `createEmptyState()`. Purely additive *optional* fields on existing records (e.g. `TaskType.icon?`) do **not** need a migration — old records simply have it `undefined`.
- `saveState()` always stamps the current `CURRENT_VERSION` on write; there's no partial-save, the whole state tree is written on every mutation.

### The store (`usePlannerStore`)

A single Pinia *setup store* holding five parallel top-level arrays (`taskTypes`, `entries`, `familyMembers`, `listItems`, `budgetGoals`/`budgetTransactions`) plus derived `computed` lookup Maps (`taskTypeById`, `familyMemberById`, `entriesByDate`, `budgetTotalsByGoal`, etc.). Every mutating action ends with a call to the local `persist()` closure. There is no batching/debouncing — each action is a full read-modify-write of localStorage.

Key domain concepts and their non-obvious behaviors:

- **`TaskType`** (created in Settings) is *soft-deleted*: `removeTaskType()` sets `archivedAt` rather than removing it or its `PlanEntry` history. `taskTypeById` resolves from the full `taskTypes` array (including archived) so History/Calendar can still show a deleted type's name/color/icon; `activeTaskTypes` (archived filtered out) is what pickers (Settings list, "add task" chips) actually iterate.
- **Recurrence** (`TaskType.recurrence`): `startDate` is `null` until the task type is first placed on an actual calendar day — *that* day becomes the anchor the pattern counts from (not the day the recurrence was configured in Settings). See `ensureEntry()` in the store and `matchesRecurrence()` in `src/lib/recurrence.ts` (which also excludes the anchor day itself — the first *virtual* occurrence lands one full interval later, since the anchor day already has a real entry).
- **Virtual entries**: `getEffectiveEntriesForDate()` / `buildEffectiveEntriesByDate()` merge real `PlanEntry` rows with synthetic ones (`id: "virtual:<taskTypeId>:<date>"`) for recurring task types whose pattern matches a date and that have no real entry yet. These virtual entries are never persisted — UI code must check `id.startsWith('virtual:')` before calling `toggleEntryDone`/`setEntryTime` on one; instead call `upsertPlanEntry`/`materializeEntry` to turn it into a real row first (see `AddPlanModal.vue`/`TodayReminders.vue` for the pattern). `excludeRecurrenceDate()` lets a user "skip" one occurrence without disturbing the rest of the pattern. History only ever shows real entries — virtual occurrences are a calendar/reminders-only concept.
- **`BudgetGoal`** is hard-deleted (cascades to its `BudgetTransaction`s) — unlike task types, nothing else needs a deleted goal's id to resolve, so there's no soft-delete/archive concept here.
- Dates are plain `yyyy-MM-dd` ISO strings throughout (`toISODate()`/`formatFullDate()` in `src/lib/date/dateUtils.ts`). Always parse them with date-fns `parseISO`, never `new Date(isoString)` — the latter parses as UTC midnight and can shift the displayed day by one for users west of UTC.
- `src/lib/date/useToday.ts` provides a reactive "today" ISO ref that refreshes on a midnight timer and on tab visibility change — use this (not a one-off `toISODate(new Date())` captured at setup) anywhere "today" needs to stay correct in a long-lived open tab.

### Feature/UI conventions

- One folder per feature under `src/features/` (`calendar`, `history`, `lists`, `budget`, `settings`), each with its own page component wired into `src/router/index.ts` and a tab in `src/components/Layout.vue`'s nav (order: Календарь, Списки, Бюджет, История, Настройки — nav is horizontally scrollable, `overflow-x-auto`, to fit on narrow phones).
- Colors: fixed literal Tailwind class palette in `src/lib/colors.ts` (`TASK_COLORS`/`TASK_COLOR_CLASSES`/`isTaskColor`). Never build Tailwind class names dynamically (e.g. `` `bg-${color}-500` ``) — Tailwind's static scanner requires literal strings, so any new color-driven UI must extend this same lookup-table pattern.
- Icons: fixed emoji preset in `src/lib/icons.ts` (`TASK_ICONS`), plain literal strings rendered as text content — not a Tailwind class concern.
- Reusable primitives: `src/components/Chip.vue` (label + optional icon + color + selected/removable) and `src/components/Modal.vue` (Teleport-based bottom-sheet/dialog with focus trap + Escape + backdrop close). Reuse these rather than rewriting chip/modal markup in a new feature.
- No dark mode, no design tokens/CSS variables — styling is inline Tailwind utilities only (`slate` neutrals, `indigo` as the sole chrome/accent color, task/goal colors from the fixed palette).
- All UI copy is Russian.

### PWA / icons

`public/pwa/*.png` + `public/apple-touch-icon.png` are the installed-app icons (referenced from `vite.config.ts`'s `VitePWA` manifest and `index.html`'s `apple-touch-icon` link). They're generated PNGs (a red square with a white "R"), not hand-edited — regenerate with ImageMagick if the branding changes rather than trying to hand-author a bitmap.
