/**
 * Points, streaks and stars. Deliberately gentle: never subtract points, no
 * leaderboards, no comparison with other children. A round always ends kindly.
 */
import type { Difficulty } from './tasks';

export const BASE_POINTS = 10;

/** Streak multiplier: from 3 correct in a row it grows, capped at 3×. */
export function streakMultiplier(streak: number): number {
  if (streak >= 7) return 3;
  if (streak >= 5) return 2;
  if (streak >= 3) return 1.5;
  return 1;
}

/**
 * Time bonus from 0..1 of the countdown remaining. In the untimed practice mode
 * `remainingRatio` is 1 so children are never penalized for taking their time.
 */
export function timeBonus(remainingRatio: number): number {
  const clamped = Math.max(0, Math.min(1, remainingRatio));
  return 1 + 0.5 * clamped; // 1.0 .. 1.5
}

export interface ScoreInput {
  difficulty: Difficulty;
  streak: number; // streak length *including* this answer
  remainingRatio: number;
  timed: boolean;
}

/** Points awarded for one correct answer. Always a positive integer. */
export function pointsForAnswer({
  difficulty,
  streak,
  remainingRatio,
  timed,
}: ScoreInput): number {
  const difficultyFactor = difficulty; // 1, 2 or 3
  const bonus = timed ? timeBonus(remainingRatio) : 1;
  const raw =
    BASE_POINTS * difficultyFactor * streakMultiplier(streak) * bonus;
  return Math.round(raw);
}

/** 1..3 stars from the share of correct answers in a round. */
export function starsForRound(correct: number, total: number): 0 | 1 | 2 | 3 {
  if (total === 0) return 0;
  const ratio = correct / total;
  if (ratio >= 0.9) return 3;
  if (ratio >= 0.7) return 2;
  if (ratio >= 0.5) return 1;
  return 0;
}
