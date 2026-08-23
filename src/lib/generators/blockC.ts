/**
 * Block C – multi-step time chains (course schedule style):
 *   14:45 ──15 min──> 15:00 ──30 min──> 15:30
 * Difficulty 1 asks for the total duration; higher difficulty hides one middle
 * time and asks the child to fill it in.
 */
import type { Rng } from '../rng';
import type { Difficulty, Task } from '../tasks';
import { addMinutes, formatClock, formatDuration } from '../time';
import { taskId } from './util';

const ACTIVITIES = [
  'Einrad',
  'Knobeln',
  'Flöte',
  'Akrobatik',
  'Schwimmen',
  'Malen',
  'Fußball',
] as const;

export function generateBlockC(rng: Rng, difficulty: Difficulty): Task {
  const steps = difficulty >= 2 ? 3 : 2;
  const stepDurations: number[] = [];
  for (let i = 0; i < steps; i++) {
    stepDurations.push(
      difficulty === 1 ? rng.pick([10, 15, 20, 30, 45]) : rng.int(8, 40),
    );
  }
  const activity = rng.pick(ACTIVITIES);

  const start = rng.int(9, 17) * 60 + rng.pick([0, 5, 15, 30, 45]);
  const times = [start];
  for (const d of stepDurations) {
    times.push(addMinutes(times[times.length - 1], d));
  }
  const total = stepDurations.reduce((a, b) => a + b, 0);

  const base = { id: taskId(rng, 'C'), block: 'C' as const, difficulty };

  if (difficulty === 1) {
    // Total-duration question.
    const rows = [
      times.map((t) => formatClock(t)),
      ['', ...stepDurations.map((d) => formatDuration(d))],
    ];
    return {
      ...base,
      prompt: `Wie lange dauert „${activity}" insgesamt?`,
      input: { widget: 'number', unit: 'min' },
      solution: { type: 'minutes', value: total },
      solutionText: formatDuration(total),
      explanation:
        `${stepDurations.map((d) => `${d} min`).join(' + ')} = ${formatDuration(total)}. ` +
        `Von ${formatClock(start)} bis ${formatClock(times[times.length - 1])}.`,
      visual: {
        kind: 'table',
        headers: ['Uhrzeit', ...stepDurations.map(() => 'Schritt')],
        rows,
      },
    };
  }

  // Hide one intermediate time (never the first or last).
  const hiddenIndex = rng.int(1, times.length - 2);
  const shown = times.map((t, i) =>
    i === hiddenIndex ? '?' : formatClock(t),
  );
  return {
    ...base,
    prompt: `Welche Uhrzeit fehlt bei „${activity}"?`,
    hint: shown.join('  →  '),
    input: { widget: 'time' },
    solution: { type: 'time', accepted: [times[hiddenIndex]] },
    solutionText: formatClock(times[hiddenIndex]),
    explanation:
      `${formatClock(times[hiddenIndex - 1])} + ` +
      `${formatDuration(stepDurations[hiddenIndex - 1])} = ` +
      `${formatClock(times[hiddenIndex])}.`,
    visual: {
      kind: 'table',
      headers: times.map((_, i) => `${i + 1}.`),
      rows: [shown],
    },
  };
}
