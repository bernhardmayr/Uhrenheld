/**
 * Pure geometry shared by every clock-face SVG (the read-only AnalogClock and
 * the draggable SettableClock), so the two stay pixel-compatible and the angle
 * math can be unit-tested without touching the DOM.
 */

/** Dial radius in the shared 0..240 viewBox. */
export const CLOCK_R = 100;
/** Center of the dial in the shared 0..240 viewBox. */
export const CLOCK_CENTER = 120;

/** Point on a circle of radius `radius`, angle in degrees clockwise from top (12 o'clock). */
export function polarPoint(angleDeg: number, radius: number): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CLOCK_CENTER + radius * Math.cos(rad),
    y: CLOCK_CENTER + radius * Math.sin(rad),
  };
}

/**
 * Convert an (dx, dy) offset from the dial center into a clockwise angle in
 * degrees, 0 at the top (12 o'clock), 0..360. Used to turn a pointer position
 * into a clock-hand angle while dragging.
 */
export function angleFromOffset(dx: number, dy: number): number {
  const deg = (Math.atan2(dx, -dy) * 180) / Math.PI;
  return deg < 0 ? deg + 360 : deg;
}

/** Snap a clockwise angle to the nearest of the 12 hour marks, returning 1..12. */
export function angleToHour12(angleDeg: number): number {
  const raw = Math.round(angleDeg / 30) % 12;
  return raw === 0 ? 12 : raw;
}

/** Snap a clockwise angle to the nearest minute mark, returning 0..59. */
export function angleToMinute(angleDeg: number): number {
  return Math.round(angleDeg / 6) % 60;
}
