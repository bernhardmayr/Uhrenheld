import { describe, expect, it } from 'vitest';
import {
  addMinutes,
  dayMinutesToTwelveHour,
  formatClock,
  formatDuration,
  formatHHMM,
  formatSecondsDuration,
  formatStopwatch,
  fractionHoursToMinutes,
  hm,
  minutesSecondsToSeconds,
  minutesToHoursMinutes,
  secondsToMinutesSeconds,
  spanForward,
  toClockParts,
  twelveHourToDayMinutes,
  wrapDayMinutes,
} from './time';

describe('wrapDayMinutes', () => {
  it('keeps values in range and wraps both directions', () => {
    expect(wrapDayMinutes(0)).toBe(0);
    expect(wrapDayMinutes(1439)).toBe(1439);
    expect(wrapDayMinutes(1440)).toBe(0);
    expect(wrapDayMinutes(1441)).toBe(1);
    expect(wrapDayMinutes(-1)).toBe(1439);
    expect(wrapDayMinutes(-60)).toBe(1380);
  });
});

describe('formatting', () => {
  it('pads hours and minutes', () => {
    expect(formatHHMM(hm(9, 54))).toBe('09:54');
    expect(formatHHMM(hm(0, 0))).toBe('00:00');
    expect(formatClock(hm(11, 19))).toBe('11:19 Uhr');
  });

  it('toClockParts splits correctly', () => {
    expect(toClockParts(hm(13, 35))).toEqual({ hours: 13, minutes: 35 });
  });
});

describe('addMinutes / spanForward', () => {
  it('adds and wraps across midnight', () => {
    expect(formatHHMM(addMinutes(hm(23, 52), 40))).toBe('00:32');
    expect(formatHHMM(addMinutes(hm(9, 54), 24))).toBe('10:18');
  });

  it('measures forward spans, wrapping past midnight', () => {
    expect(spanForward(hm(16, 15), hm(16, 45))).toBe(30);
    expect(spanForward(hm(15, 6), hm(15, 25))).toBe(19);
    expect(spanForward(hm(2, 26), hm(2, 59))).toBe(33);
    expect(spanForward(hm(21, 9), hm(21, 43))).toBe(34);
    expect(spanForward(hm(23, 52), hm(0, 30))).toBe(38);
  });
});

describe('twelve/24 hour reading', () => {
  it('maps a dial reading to morning and afternoon times', () => {
    expect(twelveHourToDayMinutes(1, 35)).toEqual({
      morning: hm(1, 35),
      afternoon: hm(13, 35),
    });
  });

  it('handles the 12 position as midnight and noon', () => {
    expect(twelveHourToDayMinutes(12, 50)).toEqual({
      morning: hm(0, 50),
      afternoon: hm(12, 50),
    });
  });

  it('round-trips back to the dial', () => {
    expect(dayMinutesToTwelveHour(hm(13, 35))).toEqual({ h12: 1, minute: 35 });
    expect(dayMinutesToTwelveHour(hm(0, 5))).toEqual({ h12: 12, minute: 5 });
    expect(dayMinutesToTwelveHour(hm(12, 0))).toEqual({ h12: 12, minute: 0 });
  });
});

describe('minute <-> hour conversion', () => {
  it('splits minutes into h + min', () => {
    expect(minutesToHoursMinutes(90)).toEqual({ hours: 1, minutes: 30 });
    expect(minutesToHoursMinutes(100)).toEqual({ hours: 1, minutes: 40 });
    expect(minutesToHoursMinutes(275)).toEqual({ hours: 4, minutes: 35 });
    expect(minutesToHoursMinutes(300)).toEqual({ hours: 5, minutes: 0 });
    expect(minutesToHoursMinutes(319)).toEqual({ hours: 5, minutes: 19 });
    expect(minutesToHoursMinutes(683)).toEqual({ hours: 11, minutes: 23 });
  });

  it('formats durations the workbook way (never decimal)', () => {
    expect(formatDuration(90)).toBe('1 h 30 min');
    expect(formatDuration(60)).toBe('1 h');
    expect(formatDuration(45)).toBe('45 min');
    expect(formatDuration(0)).toBe('0 min');
    expect(formatDuration(300)).toBe('5 h');
  });
});

describe('fractions of an hour', () => {
  it('converts mixed fractions to minutes', () => {
    expect(fractionHoursToMinutes(0, 1, 2)).toBe(30); // ½ h
    expect(fractionHoursToMinutes(0, 1, 4)).toBe(15); // ¼ h
    expect(fractionHoursToMinutes(0, 3, 4)).toBe(45); // ¾ h
    expect(fractionHoursToMinutes(2, 3, 4)).toBe(165); // 2¾ h
    expect(fractionHoursToMinutes(3, 1, 2)).toBe(210); // 3½ h
    expect(fractionHoursToMinutes(6, 1, 2)).toBe(390); // 6½ h
    expect(fractionHoursToMinutes(5)).toBe(300); // whole only
  });
});

describe('seconds conversion', () => {
  it('splits seconds into min + s', () => {
    expect(secondsToMinutesSeconds(95)).toEqual({ minutes: 1, seconds: 35 });
    expect(secondsToMinutesSeconds(87)).toEqual({ minutes: 1, seconds: 27 });
    expect(secondsToMinutesSeconds(59)).toEqual({ minutes: 0, seconds: 59 });
    expect(secondsToMinutesSeconds(200)).toEqual({ minutes: 3, seconds: 20 });
  });

  it('combines min + s into seconds', () => {
    expect(minutesSecondsToSeconds({ minutes: 1, seconds: 35 })).toBe(95);
    expect(minutesSecondsToSeconds({ minutes: 5, seconds: 30 })).toBe(330); // 5½ min
    expect(minutesSecondsToSeconds({ minutes: 2, seconds: 30 })).toBe(150); // 2½ min
  });

  it('formats second durations and stopwatch display', () => {
    expect(formatSecondsDuration(87)).toBe('1 min 27 s');
    expect(formatSecondsDuration(45)).toBe('45 s');
    expect(formatSecondsDuration(120)).toBe('2 min');
    expect(formatStopwatch(60)).toBe('01:00');
    expect(formatStopwatch(59)).toBe('00:59');
    expect(formatStopwatch(300)).toBe('05:00');
    expect(formatStopwatch(299)).toBe('04:59');
  });
});
