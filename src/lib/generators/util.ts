import type { Rng } from '../rng';
import type { Block, Difficulty } from '../tasks';

/** Build a stable-ish unique task id from block + a random suffix. */
export function taskId(rng: Rng, block: Block): string {
  return `${block}-${rng.int(100000, 999999)}`;
}

/** A generator turns an RNG + difficulty into one Task. */
export type Generator = (rng: Rng, difficulty: Difficulty) => import('../tasks').Task;
