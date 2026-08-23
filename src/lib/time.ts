/**
 * Core time model for Uhrenheld.
 *
 * Two units of measure appear throughout:
 *  - `DayMinutes`: a point in time as minutes since midnight, 0..1439.
 *  - plain `number` minutes/seconds: a *duration*.
 *
 * Everything here is pure and framework-free so it can be unit-tested to 100 %.
 * We never use decimal notation for time (no "2.5 h") – durations are always
 * expressed as "h" + "min" or as fractions like "½ h", matching the workbook.
 */

export const MIN_PER_HOUR = 60;
export const HOURS_PER_DAY = 24;
export const MIN_PER_DAY = MIN_PER_HOUR * HOURS_PER_DAY; // 1440
export const SEC_PER_MIN = 60;

/** Minutes since midnight, normalized to 0..1439. */
export type DayMinutes = number;

/** Pad a non-negative integer to two digits ("9" -> "09"). */
export function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

/** Wrap any minute count into the 0..1439 range (handles day roll-over). */
export function wrapDayMinutes(m: number): DayMinutes {
  return ((m % MIN_PER_DAY) + MIN_PER_DAY) % MIN_PER_DAY;
}

/** Build a `DayMinutes` from a 24-hour clock reading. */
export function hm(hours: number, minutes: number): DayMinutes {
  return wrapDayMinutes(hours * MIN_PER_HOUR + minutes);
}

/** Split a `DayMinutes` into its 24-hour clock parts. */
export function toClockParts(m: DayMinutes): { hours: number; minutes: number } {
  const t = wrapDayMinutes(m);
  return { hours: Math.floor(t / MIN_PER_HOUR), minutes: t % MIN_PER_HOUR };
}

/** "09:54" (no unit word). */
export function formatHHMM(m: DayMinutes): string {
  const { hours, minutes } = toClockParts(m);
  return `${pad2(hours)}:${pad2(minutes)}`;
}

/** "09:54 Uhr" – the form used everywhere in the UI. */
export function formatClock(m: DayMinutes): string {
  return `${formatHHMM(m)} Uhr`;
}

/**
 * Add a signed number of minutes to a point in time, wrapping across midnight.
 * `addMinutes(hm(23, 52), 40)` -> 00:32.
 */
export function addMinutes(start: DayMinutes, delta: number): DayMinutes {
  return wrapDayMinutes(start + delta);
}

/**
 * Forward span in minutes from `start` to `end`. If `end` is earlier in the
 * day than `start`, the span wraps past midnight, so it is always 0..1439.
 */
export function spanForward(start: DayMinutes, end: DayMinutes): number {
  return wrapDayMinutes(end - start);
}

// ---------------------------------------------------------------------------
// Analog clock reading: a 12-hour face maps to two 24-hour times.
// ---------------------------------------------------------------------------

/**
 * Given an analog reading (hour on the 1..12 dial, minute 0..59), return the
 * two possible 24-hour times: the morning value first, then the afternoon /
 * evening value. This powers Block A's "double answer".
 *
 * The 12 position is the special case: it maps to 00:mm and 12:mm.
 */
export function twelveHourToDayMinutes(
  h12: number,
  minute: number,
): { morning: DayMinutes; afternoon: DayMinutes } {
  const base = h12 % 12; // 12 -> 0
  return {
    morning: hm(base, minute),
    afternoon: hm(base + 12, minute),
  };
}

/** Convert a 24-hour `DayMinutes` back to the 1..12 dial position. */
export function dayMinutesToTwelveHour(m: DayMinutes): {
  h12: number;
  minute: number;
} {
  const { hours, minutes } = toClockParts(m);
  const mod = hours % 12;
  return { h12: mod === 0 ? 12 : mod, minute: minutes };
}

// ---------------------------------------------------------------------------
// Duration formatting and unit conversion.
// ---------------------------------------------------------------------------

export interface HoursMinutes {
  hours: number;
  minutes: number;
}

/** 90 -> { hours: 1, minutes: 30 }. Input must be a non-negative duration. */
export function minutesToHoursMinutes(totalMinutes: number): HoursMinutes {
  return {
    hours: Math.floor(totalMinutes / MIN_PER_HOUR),
    minutes: totalMinutes % MIN_PER_HOUR,
  };
}

/** { hours: 1, minutes: 30 } -> 90. */
export function hoursMinutesToMinutes({ hours, minutes }: HoursMinutes): number {
  return hours * MIN_PER_HOUR + minutes;
}

/**
 * Human duration, workbook style:
 *   0        -> "0 min"
 *   45       -> "45 min"
 *   60       -> "1 h"
 *   90       -> "1 h 30 min"
 */
export function formatDuration(totalMinutes: number): string {
  const { hours, minutes } = minutesToHoursMinutes(totalMinutes);
  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} h`;
  return `${hours} h ${minutes} min`;
}

/**
 * Convert a mixed-fraction of hours to minutes.
 * `fractionHoursToMinutes(2, 3, 4)` = 2¾ h = 165 min.
 * `fractionHoursToMinutes(0, 1, 2)` = ½ h = 30 min.
 */
export function fractionHoursToMinutes(
  whole: number,
  numerator = 0,
  denominator = 1,
): number {
  return whole * MIN_PER_HOUR + (numerator * MIN_PER_HOUR) / denominator;
}

export interface MinutesSeconds {
  minutes: number;
  seconds: number;
}

/** 95 -> { minutes: 1, seconds: 35 }. */
export function secondsToMinutesSeconds(totalSeconds: number): MinutesSeconds {
  return {
    minutes: Math.floor(totalSeconds / SEC_PER_MIN),
    seconds: totalSeconds % SEC_PER_MIN,
  };
}

/** { minutes: 1, seconds: 35 } -> 95. */
export function minutesSecondsToSeconds({
  minutes,
  seconds,
}: MinutesSeconds): number {
  return minutes * SEC_PER_MIN + seconds;
}

/**
 * Human seconds duration: "1 min 27 s", "45 s", "2 min".
 */
export function formatSecondsDuration(totalSeconds: number): string {
  const { minutes, seconds } = secondsToMinutesSeconds(totalSeconds);
  if (minutes === 0) return `${seconds} s`;
  if (seconds === 0) return `${minutes} min`;
  return `${minutes} min ${seconds} s`;
}

/** Digital stopwatch display "mm:ss" for a duration in seconds. */
export function formatStopwatch(totalSeconds: number): string {
  const { minutes, seconds } = secondsToMinutesSeconds(totalSeconds);
  return `${pad2(minutes)}:${pad2(seconds)}`;
}
