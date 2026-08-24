# Testing Guide – Uhrenheld

Uhrenheld maintains three levels of testing to ensure quality and reliability:

## 1. Unit Tests (src/lib/**/*.test.ts)

**Purpose**: Verify core game logic in isolation.

### Coverage
- ✅ **100% coverage** on `src/lib/`: time math, generators, scoring, progress, errors
- **99 tests** across 17 test files
- Zero external dependencies

### Key Test Suites

#### Time Logic (src/lib/time.test.ts)
- 14 tests verifying all time math operations
- Edge cases: hour boundaries, midnight wrapping, stopwatch rollovers (01:00 → 00:59)
- Examples: `addMinutes()`, `spanForward()`, `twelveHourToDayMinutes()`

#### Task Generators (src/lib/generators/generators.test.ts)
- 32 tests covering all 8 blocks (A–H) at 3 difficulty levels
- **Self-consistency check**: Every generator's correct answer must pass, wrong answer must fail
- Block-specific tests (Block H subtraction variant, Block A double answer, etc.)

#### Game Mechanics
- Scoring system: points, stars, perfect rounds
- Progress reducers: round results, badge unlocking
- Error classification: hands-swapped, used-100, minute-rolldown
- Unlock rules: cosmetics (avatars, clock faces) by points

### Run Unit Tests
```bash
npm test              # Run once (CI mode)
npm run test:watch   # Watch mode during development
npm run test:coverage # Generate HTML coverage report
```

## 2. Component Tests (src/**/*.test.tsx)

**Purpose**: Verify UI components render and interact correctly.

### Coverage
- ✅ **6 test files** using Vitest + React Testing Library
- Render tests for all screens (LevelMap, RoundScreen, ResultScreen, ProfileScreen, ParentView)
- Interactive tests: button clicks, input changes, keyboard navigation
- Accessibility checks: role attributes, ARIA labels, focusable elements

### Key Component Tests

#### AnswerInput (src/components/AnswerInput.test.tsx)
- All 7 input widget types tested: time, timeDouble, hm, minsec, number, choice, clockSet
- User interactions: typing, clicking, submitting

#### SettableClock (src/components/SettableClock.test.tsx)
- Interactive clock with mouse/touch dragging simulation
- Keyboard control (arrow keys for fine-tuning)
- Pointer snapping to hour/minute marks

#### Screen Integration Tests
- LevelMap: block grid, difficulty buttons, unlock status
- RoundScreen: task display, input, submit flow
- ResultScreen: stars, points, feedback
- ProfileScreen: settings, cosmetics selection, stats

### Run Component Tests
```bash
npm test              # Included in main test run
npm run test:watch   # Watch mode
```

## 3. End-to-End Tests (e2e/*.e2e.ts)

**Purpose**: Verify complete user flows work from start to finish, across devices and network states.

### Coverage
- ✅ **2 test modules** with 15+ test scenarios
- **Desktop & Mobile** testing (Chromium on Desktop Chrome + Pixel 5)
- Service Worker & offline functionality verified

### Test Scenarios

#### game-flow.e2e.ts (Main User Journeys)
1. Load app and see level map
2. Start round and answer a question
3. Complete full 5-question round
4. Verify progress persists across page reloads
5. Toggle sound/timed mode in settings
6. Responsive layout on mobile (375×667)
7. Clock visualization renders
8. Cosmetics unlock through progression

#### features.e2e.ts (Feature-Specific Tests)
1. Interactive clock drag interaction
2. Keyboard navigation (Tab, Enter)
3. All 3 difficulty levels load
4. Block F (multiple choice) works
5. Block B (time span) input widgets
6. Block G (timetable) visualization
7. Error explanations are helpful
8. Offline mode works (PWA cache)

### Run E2E Tests
```bash
npm run test:e2e      # Headless (CI mode)
npm run test:e2e:ui   # Interactive Playwright inspector
```

**First-time setup**:
```bash
npx playwright install  # Downloads Chromium (one-time)
```

**Configuration**: `playwright.config.ts`
- Base URL: `http://localhost:5173`
- Auto-starts dev server
- Screenshots on failure
- HTML report: `playwright-report/index.html`

## Test Stack Overview

| Layer | Tool | Coverage | Commands |
|-------|------|----------|----------|
| **Unit** | Vitest + jsdom | 100% (src/lib) | `npm test` |
| **Component** | RTL + Vitest | All screens | `npm test` |
| **E2E** | Playwright | User flows | `npm run test:e2e` |

## Running Tests Locally

### Quick Check (All Tests)
```bash
npm run lint        # ESLint
npm run typecheck   # TypeScript strict mode
npm test            # Unit + component tests
npm run test:e2e    # E2E tests (requires npm run dev in another terminal)
```

### Full CI Simulation
```bash
npm run build       # Verify production build works
npm run test        # All unit/component tests
npm run test:e2e    # E2E tests
```

## Debugging Tests

### Unit/Component Tests
```bash
npm run test:watch
# Then press 'p' to filter by filename, 't' to filter by test name
```

### E2E Tests
```bash
npm run test:e2e:ui
# Interactive Playwright Inspector opens in browser
# Pause, step through, inspect elements, edit locators
```

### Record New E2E Tests
```bash
npx playwright codegen http://localhost:5173
# Opens recording mode – click UI to generate test code
```

## Performance & CI

### GitHub Actions (`.github/workflows/`)
- Runs on every push
- Lint, typecheck, unit tests, E2E tests
- Reports results back to PR

### Lighthouse / PWA Audit
- Manual audit: See `docs/PWA-AUDIT.md`
- Tests offline functionality
- Verifies service worker caching

## Best Practices

1. **Keep unit tests focused**: Test one function/logic path at a time
2. **Use `prefers-reduced-motion` in animation tests**: Verify animations respect accessibility settings
3. **Mock expensive operations**: Audio context, localStorage (when needed)
4. **Test edge cases in time logic**: Midnight, hour boundaries, month rollover
5. **E2E tests should mirror real user journeys**: Click through the whole flow, not just isolated steps
6. **Test responsive layout at actual device sizes**: Playwright includes Pixel 5 profile (375×667)

## Maintenance

### Adding Tests

**Unit test for new generator**:
```typescript
// src/lib/generators/blockX.test.ts
it('generates valid tasks at all difficulties', () => {
  for (let d = 1; d <= 3; d++) {
    const task = generateBlockX(createRng(seed), d);
    expect(task.block).toBe('X');
    expect(checkAnswer(task, correctAnswer(task))).toBe(true);
    expect(checkAnswer(task, wrongAnswer(task))).toBe(false);
  }
});
```

**Component test for new widget**:
```typescript
// src/components/NewWidget.test.tsx
it('accepts user input and submits', () => {
  render(<NewWidget onSubmit={onSubmit} />);
  const input = screen.getByRole('textbox');
  fireEvent.change(input, { target: { value: 'test' } });
  fireEvent.click(screen.getByRole('button', { name: 'Prüfen' }));
  expect(onSubmit).toHaveBeenCalled();
});
```

**E2E test for new user flow**:
```typescript
// e2e/new-feature.e2e.ts
test('new feature flow works end-to-end', async ({ page }) => {
  await page.goto('/');
  // ... click through UI, verify outcomes
});
```

### Updating Tests

When changing game logic:
1. Update the relevant unit test first
2. Verify component tests still pass
3. Run E2E tests to confirm user-facing behavior
4. Update documentation if behavior changed

## CI/CD Integration

Tests run automatically on:
- **Push to any branch**: Lint, unit tests, build
- **Pull request**: Full suite (lint, typecheck, unit, E2E)
- **Merge to main**: Deploy to GitHub Pages only if all tests pass

---

**Summary**: Uhrenheld maintains production-grade test coverage across three levels:
- **Unit (100% on core logic)** ensures correctness
- **Component tests** verify UI works
- **E2E tests** confirm real user journeys succeed

This three-tier approach catches bugs early, prevents regressions, and enables confident refactoring.
