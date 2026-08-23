import { describe, expect, it } from 'vitest';
import type { Block, Difficulty } from './tasks';
import { isBlockUnlocked, isLevelUnlocked } from './unlock';

const ORDER: Block[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const DIFFS: Difficulty[] = [1, 2, 3];

describe('isBlockUnlocked', () => {
  it('opens the first station and gates the rest on the previous block', () => {
    expect(isBlockUnlocked({}, ORDER, 0)).toBe(true);
    expect(isBlockUnlocked({}, ORDER, 1)).toBe(false);
    expect(isBlockUnlocked({ A1: 1 }, ORDER, 1)).toBe(true);
    expect(isBlockUnlocked({ A1: 0 }, ORDER, 1)).toBe(false);
  });
});

describe('isLevelUnlocked', () => {
  it('opens the first difficulty and gates later ones', () => {
    expect(isLevelUnlocked({}, 'A', DIFFS, 1)).toBe(true);
    expect(isLevelUnlocked({}, 'A', DIFFS, 2)).toBe(false);
    expect(isLevelUnlocked({ A1: 2 }, 'A', DIFFS, 2)).toBe(true);
    expect(isLevelUnlocked({ A1: 2 }, 'A', DIFFS, 3)).toBe(false);
    expect(isLevelUnlocked({ A1: 2, A2: 1 }, 'A', DIFFS, 3)).toBe(true);
  });
});
