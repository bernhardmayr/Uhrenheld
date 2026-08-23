# Contributing to Uhrenheld

Thanks for helping! A few conventions keep this repo healthy.

## Workflow

- One feature = one branch = one PR. Branch names: `feat/…`, `fix/…`, `docs/…`,
  `chore/…`.
- [Conventional Commits](https://www.conventionalcommits.org/), e.g.
  `feat(clock): add draggable minute hand`.
- Never commit directly to `main`. Squash-merge PRs into `main`; that triggers
  the GitHub Pages deploy.

## Before you open a PR

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

All must pass. The PR template has a checklist.

## Ground rules

- German in the UI and tasks; English in code, comments, commits and docs
  (except `docs/SPEC.md`, which stays German and is the fachliche source of
  truth).
- No backend, no accounts, no tracking, no external fonts/CDNs. Persistence is
  `localStorage` only.
- No new dependency without discussing it first (open an issue).
- Every logic change needs tests; time logic and generators stay at 100 %.
- No decimal time notation. Units `s`, `min`, `h`; clock times get "Uhr".
- Keep it kid-friendly and accessible (keyboard, screenreader, ≥ 48 px targets).

## Tests

- Logic lives in `src/lib` and is unit-tested.
- UI needs at least one render test per component/screen.
