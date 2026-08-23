/**
 * Small, deterministic pseudo-random number generator.
 *
 * Task generators take an `Rng` so tests can pin a seed and assert on the
 * generated task, while the running app just seeds it from `Date.now()`.
 */
export interface Rng {
  /** Float in [0, 1). */
  next(): number;
  /** Integer in [min, max] (both inclusive). */
  int(min: number, max: number): number;
  /** Pick one element of a non-empty array. */
  pick<T>(items: readonly T[]): T;
  /** True with the given probability (default 0.5). */
  chance(p?: number): boolean;
}

/** Mulberry32 – tiny, fast, good enough for gameplay and reproducible tests. */
export function createRng(seed: number): Rng {
  let a = seed >>> 0;
  const next = (): number => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    int: (min, max) => min + Math.floor(next() * (max - min + 1)),
    pick: (items) => items[Math.floor(next() * items.length)],
    chance: (p = 0.5) => next() < p,
  };
}

/** Convenience RNG seeded from the current time, for production use. */
export function createTimeSeededRng(): Rng {
  return createRng(Date.now() % 2147483647);
}
