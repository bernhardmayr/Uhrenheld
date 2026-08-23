# CLAUDE.md

Guidance for any future Claude/Code session working on this repository.

## Purpose

Uhrenheld is a playful, offline web app that teaches German 3rd graders
(ages 8–9) to read analog clocks and to calculate with points in time and time
spans. It is a **game** (points, streaks, badges, timer), not a worksheet on a
screen. The UI is entirely in German; the code is in English.

## Architecture

- **Vite + React 18 + TypeScript (strict) + Tailwind CSS**, tested with Vitest +
  React Testing Library, shipped as a static PWA to GitHub Pages.
- `src/lib/` – framework-free, fully tested logic: time math (`time.ts`), task
  model (`tasks.ts`), generators (`generators/`), scoring, progress reducers,
  error classification, unlock rules.
- `src/store/gameStore.ts` – thin Zustand wrapper that persists to
  `localStorage`; all real logic lives in `src/lib`.
- `src/components/` – reusable UI (AnalogClock, Stopwatch, Timeline, Countdown,
  AnswerInput, indicators).
- `src/features/` – screens: `round`, `results`, `levelmap`, `profile`, `parent`.
- `src/data/` – block catalog and cosmetics.
- The eight learning blocks A–H are **data-driven** (`src/data/blocks.ts` +
  `src/lib/generators/*`) rather than one folder per block.

## Commands

```bash
npm run dev        # local dev server
npm run build      # typecheck + production build (PWA)
npm run test       # run all unit/component tests
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## Binding rules

- **German in the UI, English in code/comments/commits.** `docs/SPEC.md` stays
  German and is the fachliche source of truth.
- **No backend, no accounts, no tracking, no external fonts/CDNs.** Persistence
  is `localStorage` only.
- **No new dependency without asking.**
- **Tests for every logic change.** Time logic and generators must stay at 100 %.
- **Never commit directly to `main`.** One feature = one branch = one PR.
- **No decimal time** (never "2,5 h" → use "2 h 30 min" or "2½ h"). Units: `s`,
  `min`, `h`; clock times get a trailing "Uhr".

## Git workflow

- Branch names: `feat/…`, `fix/…`, `docs/…`, `chore/…`. Conventional Commits
  (e.g. `feat(clock): add second hand`). Squash merge into `main` triggers deploy.

## Definition of Done

Requirement from `docs/SPEC.md` met · strict TS, no `any`, lint clean · unit
tests for logic + at least one render test for UI · keyboard/screenreader OK ·
checked at tablet width · docs updated if behavior changed · CI green.

## Tone toward children

Encouraging, never punishing. Always explain *why*, address the specific
mistake, and end every round kindly.
