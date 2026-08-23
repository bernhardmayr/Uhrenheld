import { describe, expect, it } from 'vitest';
import {
  pointsForAnswer,
  starsForRound,
  streakMultiplier,
  timeBonus,
} from './scoring';

describe('streakMultiplier', () => {
  it('grows in steps and caps at 3x', () => {
    expect(streakMultiplier(0)).toBe(1);
    expect(streakMultiplier(2)).toBe(1);
    expect(streakMultiplier(3)).toBe(1.5);
    expect(streakMultiplier(5)).toBe(2);
    expect(streakMultiplier(7)).toBe(3);
    expect(streakMultiplier(20)).toBe(3);
  });
});

describe('timeBonus', () => {
  it('ranges from 1 to 1.5 and clamps', () => {
    expect(timeBonus(0)).toBe(1);
    expect(timeBonus(1)).toBe(1.5);
    expect(timeBonus(-5)).toBe(1);
    expect(timeBonus(5)).toBe(1.5);
  });
});

describe('pointsForAnswer', () => {
  it('never returns a negative value and is an integer', () => {
    const p = pointsForAnswer({
      difficulty: 1,
      streak: 1,
      remainingRatio: 0,
      timed: true,
    });
    expect(p).toBeGreaterThan(0);
    expect(Number.isInteger(p)).toBe(true);
  });

  it('rewards difficulty, streak and speed', () => {
    const easy = pointsForAnswer({
      difficulty: 1,
      streak: 1,
      remainingRatio: 0,
      timed: false,
    });
    const hard = pointsForAnswer({
      difficulty: 3,
      streak: 1,
      remainingRatio: 0,
      timed: false,
    });
    expect(hard).toBeGreaterThan(easy);

    const withStreak = pointsForAnswer({
      difficulty: 1,
      streak: 5,
      remainingRatio: 0,
      timed: false,
    });
    expect(withStreak).toBeGreaterThan(easy);

    const fast = pointsForAnswer({
      difficulty: 1,
      streak: 1,
      remainingRatio: 1,
      timed: true,
    });
    expect(fast).toBeGreaterThan(easy);
  });

  it('ignores the time bonus in untimed practice mode', () => {
    const timedSlow = pointsForAnswer({
      difficulty: 2,
      streak: 1,
      remainingRatio: 0,
      timed: true,
    });
    const untimed = pointsForAnswer({
      difficulty: 2,
      streak: 1,
      remainingRatio: 0,
      timed: false,
    });
    expect(untimed).toBe(timedSlow);
  });
});

describe('starsForRound', () => {
  it('awards 0..3 stars by ratio', () => {
    expect(starsForRound(10, 10)).toBe(3);
    expect(starsForRound(8, 10)).toBe(2);
    expect(starsForRound(5, 10)).toBe(1);
    expect(starsForRound(4, 10)).toBe(0);
    expect(starsForRound(0, 0)).toBe(0);
  });
});
