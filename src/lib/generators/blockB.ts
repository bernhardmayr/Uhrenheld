/**
 * Block B – time spans on an arrow (`16:15 Uhr ──?── 16:45 Uhr`).
 * Three shapes: find the duration, the end time, or the start time.
 * Difficulty 1 uses 5/15/30-minute steps; 2 and 3 are minute-precise and cross
 * the full hour.
 */
import type { Rng } from '../rng';
import type { Difficulty, Task } from '../tasks';
import { addMinutes, formatClock, formatDuration } from '../time';
import { taskId } from './util';

type Variant = 'duration' | 'end' | 'start';

function pickStep(rng: Rng, difficulty: Difficulty): number {
  if (difficulty === 1) return rng.pick([5, 10, 15, 20, 30, 45]);
  if (difficulty === 2) return rng.int(6, 55);
  // Difficulty 3: longer, still under an hour but always crossing a full hour.
  return rng.int(20, 58);
}

export function generateBlockB(rng: Rng, difficulty: Difficulty): Task {
  const variant: Variant = rng.pick(['duration', 'end', 'start']);
  const duration = pickStep(rng, difficulty);

  // Choose a start so difficulty >= 2 crosses an hour boundary.
  let start: number;
  if (difficulty === 1) {
    start = rng.int(6, 20) * 60 + rng.pick([0, 15, 30, 45]);
  } else {
    const hour = rng.int(6, 21);
    const minuteBeforeHour = rng.int(60 - Math.min(duration, 59), 59);
    start = hour * 60 + minuteBeforeHour;
  }
  const end = addMinutes(start, duration);

  const base = {
    id: taskId(rng, 'B'),
    block: 'B' as const,
    difficulty,
  };

  if (variant === 'duration') {
    const fraction =
      difficulty === 1 && duration === 30
        ? ' Das ist auch ½ h.'
        : difficulty === 1 && duration === 15
          ? ' Das ist auch ¼ h.'
          : difficulty === 1 && duration === 45
            ? ' Das ist auch ¾ h.'
            : '';
    return {
      ...base,
      prompt: `Wie viel Zeit ist vergangen?`,
      input: { widget: 'number', unit: 'min' },
      solution: { type: 'minutes', value: duration },
      solutionText: formatDuration(duration),
      explanation:
        `Von ${formatClock(start)} bis ${formatClock(end)} sind es ` +
        `${formatDuration(duration)}.` +
        fraction,
      visual: {
        kind: 'timeline',
        start,
        end,
        arrowLabel: '?',
      },
    };
  }

  if (variant === 'end') {
    return {
      ...base,
      prompt: 'Wie spät ist es am Ende?',
      input: { widget: 'time' },
      solution: { type: 'time', accepted: [end] },
      solutionText: formatClock(end),
      explanation:
        `${formatClock(start)} + ${formatDuration(duration)} = ${formatClock(end)}. ` +
        `Denke an die volle Stunde: ${formatClock(start)} zuerst bis zur nächsten ` +
        `vollen Stunde, dann weiter.`,
      visual: {
        kind: 'timeline',
        start,
        end: null,
        arrowLabel: formatDuration(duration),
      },
    };
  }

  // variant === 'start'
  return {
    ...base,
    prompt: 'Wann hat es angefangen?',
    input: { widget: 'time' },
    solution: { type: 'time', accepted: [start] },
    solutionText: formatClock(start),
    explanation:
      `${formatClock(end)} − ${formatDuration(duration)} = ${formatClock(start)}. ` +
      `Rechne von hinten: von ${formatClock(end)} ` +
      `${formatDuration(duration)} zurück.`,
    visual: {
      kind: 'timeline',
      start: null,
      end,
      arrowLabel: formatDuration(duration),
    },
  } satisfies Task;
}
