/**
 * Which stations and levels are unlocked. Stations open one after another along
 * the blocks A–H; within a station each difficulty opens once the previous one
 * earned at least one star. Block A / difficulty 1 is always open.
 */
import type { Block, Difficulty } from './tasks';
import { levelKey } from './progress';

export function starsFor(
  stars: Record<string, number>,
  block: Block,
  difficulty: Difficulty,
): number {
  return stars[levelKey(block, difficulty)] ?? 0;
}

/** A station is unlocked if the previous block earned a star at difficulty 1. */
export function isBlockUnlocked(
  stars: Record<string, number>,
  order: Block[],
  index: number,
): boolean {
  if (index <= 0) return true;
  const prev = order[index - 1];
  return starsFor(stars, prev, 1) >= 1;
}

/** A difficulty is unlocked if the previous difficulty in the block has a star. */
export function isLevelUnlocked(
  stars: Record<string, number>,
  block: Block,
  difficulties: Difficulty[],
  difficulty: Difficulty,
): boolean {
  const pos = difficulties.indexOf(difficulty);
  if (pos <= 0) return true;
  return starsFor(stars, block, difficulties[pos - 1]) >= 1;
}
