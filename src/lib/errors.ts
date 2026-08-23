/**
 * Best-effort classification of a *wrong* answer into a didactic error type.
 * These tags feed the parent/teacher view ("which mistakes recur?") and let the
 * feedback address the specific misconception instead of a bare "falsch".
 *
 * Heuristics are conservative: when nothing matches we return 'other'.
 */
import type { Task, UserAnswer } from './tasks';
import {
  MIN_PER_HOUR,
  twelveHourToDayMinutes,
} from './time';

export type ErrorTag =
  | 'hands-swapped' // read hour and minute hand the wrong way round
  | 'used-100' // divided by 100 instead of 60
  | 'minute-rolldown' // botched the mm:ss minute change (01:00 -> 00:59)
  | 'other';

export const ERROR_LABELS: Record<ErrorTag, string> = {
  'hands-swapped': 'Zeiger vertauscht',
  'used-100': 'Mit 100 statt 60 gerechnet',
  'minute-rolldown': 'Minutenwechsel übersehen',
  other: 'Sonstiger Fehler',
};

function usedHundred(correctTotalIn60: number, answerTotal: number): boolean {
  // If the child treated the value as base-100 (e.g. 100 min -> "1 h 0 min"
  // read off the digits), reconstruct that mistaken total and compare.
  const hundreds = Math.floor(correctTotalIn60 / 100);
  const rest = correctTotalIn60 % 100;
  const mistaken = hundreds * MIN_PER_HOUR + rest;
  return mistaken !== correctTotalIn60 && answerTotal === mistaken;
}

/** Classify a wrong answer. Assumes the answer is already known to be wrong. */
export function classifyError(task: Task, answer: UserAnswer): ErrorTag {
  const { solution } = task;

  // Block A: hour/minute hands swapped.
  if (
    task.block === 'A' &&
    task.visual?.kind === 'clock' &&
    (answer.widget === 'time' || answer.widget === 'timeDouble')
  ) {
    const { h12, minute } = task.visual;
    const swapH12 = ((Math.round(minute / 5) % 12) || 12) as number;
    const swapMinute = (h12 % 12) * 5;
    const swapped = twelveHourToDayMinutes(swapH12, swapMinute);
    const candidates = [swapped.morning, swapped.afternoon];
    const given =
      answer.widget === 'time' ? [answer.value] : [answer.a, answer.b];
    if (given.some((v) => v !== null && candidates.includes(v))) {
      return 'hands-swapped';
    }
  }

  // Block D: base-100 instead of base-60.
  if (solution.type === 'hm' && answer.widget === 'hm') {
    if (usedHundred(solution.total, answer.total)) return 'used-100';
  }
  if (solution.type === 'minsec' && answer.widget === 'minsec') {
    if (usedHundred(solution.total, answer.total)) return 'used-100';
  }

  // Block E: mishandled the stopwatch minute roll-down.
  if (
    task.block === 'E' &&
    task.visual?.kind === 'stopwatch' &&
    task.visual.seconds % MIN_PER_HOUR === 0
  ) {
    return 'minute-rolldown';
  }

  return 'other';
}
