import { describe, expect, it } from 'vitest';
import { isNextDay, todayKey } from './persistence';

describe('date helpers', () => {
  it('todayKey formats an ISO day', () => {
    expect(todayKey(new Date('2026-08-23T14:00:00Z'))).toBe('2026-08-23');
  });

  it('isNextDay recognises consecutive days including month boundaries', () => {
    expect(isNextDay('2026-01-01', '2026-01-02')).toBe(true);
    expect(isNextDay('2026-01-31', '2026-02-01')).toBe(true);
    expect(isNextDay('2026-01-01', '2026-01-03')).toBe(false);
    expect(isNextDay('2026-01-02', '2026-01-01')).toBe(false);
  });
});
