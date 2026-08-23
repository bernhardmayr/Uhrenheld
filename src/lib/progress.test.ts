import { describe, expect, it } from 'vitest';
import {
  applyAnswer,
  applyRoundResult,
  defaultProgress,
  recomputeBadges,
} from './progress';

describe('applyAnswer', () => {
  it('accumulates points and per-block stats', () => {
    let p = defaultProgress();
    p = applyAnswer(p, { block: 'A', correct: true, points: 15 });
    p = applyAnswer(p, { block: 'A', correct: false, points: 0, errorTag: 'hands-swapped' });
    expect(p.totalPoints).toBe(15);
    expect(p.stats.A).toEqual({ attempts: 2, correct: 1 });
    expect(p.errorCounts['hands-swapped']).toBe(1);
  });

  it('never lets points go negative', () => {
    let p = defaultProgress();
    p = applyAnswer(p, { block: 'B', correct: false, points: -50 });
    expect(p.totalPoints).toBe(0);
  });
});

describe('applyRoundResult', () => {
  it('records best stars and keeps the highest', () => {
    let p = defaultProgress();
    p = applyRoundResult(p, {
      block: 'A',
      difficulty: 1,
      correct: 3,
      total: 6,
      today: '2026-01-01',
    });
    expect(p.stars.A1).toBe(1);
    // A better run raises stars; a worse later run does not lower them.
    p = applyRoundResult(p, {
      block: 'A',
      difficulty: 1,
      correct: 6,
      total: 6,
      today: '2026-01-01',
    });
    expect(p.stars.A1).toBe(3);
    p = applyRoundResult(p, {
      block: 'A',
      difficulty: 1,
      correct: 0,
      total: 6,
      today: '2026-01-01',
    });
    expect(p.stars.A1).toBe(3);
  });

  it('advances the streak across consecutive days but resets on a gap', () => {
    let p = defaultProgress();
    p = applyRoundResult(p, { block: 'A', difficulty: 1, correct: 6, total: 6, today: '2026-01-01' });
    expect(p.streak.current).toBe(1);
    p = applyRoundResult(p, { block: 'A', difficulty: 1, correct: 6, total: 6, today: '2026-01-02' });
    expect(p.streak.current).toBe(2);
    // Same day does not double-count.
    p = applyRoundResult(p, { block: 'A', difficulty: 1, correct: 6, total: 6, today: '2026-01-02' });
    expect(p.streak.current).toBe(2);
    // A skipped day resets.
    p = applyRoundResult(p, { block: 'A', difficulty: 1, correct: 6, total: 6, today: '2026-01-05' });
    expect(p.streak.current).toBe(1);
    expect(p.streak.best).toBe(2);
  });

  it('awards the perfect-round and first-round badges', () => {
    let p = defaultProgress();
    p = applyRoundResult(p, { block: 'A', difficulty: 1, correct: 6, total: 6, today: '2026-01-01' });
    expect(p.badges).toContain('first-round');
    expect(p.badges).toContain('perfect');
  });
});

describe('recomputeBadges', () => {
  it('is monotonic – it never removes an earned badge', () => {
    const p = defaultProgress();
    p.badges = ['first-round'];
    expect(recomputeBadges(p)).toContain('first-round');
  });
});
