import { describe, expect, it } from 'vitest';
import {
  angleFromOffset,
  angleToHour12,
  angleToMinute,
  polarPoint,
} from './clockGeometry';

describe('angleFromOffset', () => {
  it('reads the four cardinal clock positions', () => {
    expect(angleFromOffset(0, -1)).toBeCloseTo(0); // 12 o'clock (up)
    expect(angleFromOffset(1, 0)).toBeCloseTo(90); // 3 o'clock (right)
    expect(angleFromOffset(0, 1)).toBeCloseTo(180); // 6 o'clock (down)
    expect(angleFromOffset(-1, 0)).toBeCloseTo(270); // 9 o'clock (left)
  });

  it('always returns a value in [0, 360)', () => {
    for (let a = 0; a < 360; a += 15) {
      const rad = (a * Math.PI) / 180;
      const angle = angleFromOffset(Math.sin(rad), -Math.cos(rad));
      expect(angle).toBeGreaterThanOrEqual(0);
      expect(angle).toBeLessThan(360.0001);
    }
  });
});

describe('angleToHour12', () => {
  it('snaps to the nearest hour mark, 1..12', () => {
    expect(angleToHour12(0)).toBe(12);
    expect(angleToHour12(29)).toBe(1);
    expect(angleToHour12(31)).toBe(1);
    expect(angleToHour12(90)).toBe(3);
    expect(angleToHour12(345)).toBe(12);
    expect(angleToHour12(315)).toBe(11); // never 0
  });
});

describe('angleToMinute', () => {
  it('snaps to the nearest minute, 0..59', () => {
    expect(angleToMinute(0)).toBe(0);
    expect(angleToMinute(6)).toBe(1);
    expect(angleToMinute(90)).toBe(15);
    expect(angleToMinute(357)).toBe(0); // wraps back to 0, not 60
    expect(angleToMinute(354)).toBe(59);
  });
});

describe('polarPoint', () => {
  it('places 12 o\'clock straight up and 3 o\'clock to the right of center', () => {
    const top = polarPoint(0, 100);
    expect(top.x).toBeCloseTo(120);
    expect(top.y).toBeCloseTo(20);

    const right = polarPoint(90, 100);
    expect(right.x).toBeCloseTo(220);
    expect(right.y).toBeCloseTo(120);
  });
});
