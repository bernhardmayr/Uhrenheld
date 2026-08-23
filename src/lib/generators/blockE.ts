/**
 * Block E – the second hand and the digital stopwatch.
 *  - "How many seconds since the last full minute?" (read the second hand)
 *  - "What did the stopwatch show one second earlier?" including the tricky
 *    01:00 -> 00:59 and 05:00 -> 04:59 roll-downs.
 */
import type { Rng } from '../rng';
import type { Difficulty, Task } from '../tasks';
import { formatStopwatch, secondsToMinutesSeconds } from '../time';
import { taskId } from './util';

export function generateBlockE(rng: Rng, difficulty: Difficulty): Task {
  const kind = rng.pick(['secondHand', 'stopwatchBack'] as const);
  const base = { id: taskId(rng, 'E'), block: 'E' as const, difficulty };

  if (kind === 'secondHand') {
    // Second hand shows some seconds past the last full minute.
    const seconds = difficulty === 1 ? rng.int(1, 11) * 5 : rng.int(1, 59);
    const h12 = rng.int(1, 12);
    const minute = rng.int(0, 59);
    return {
      ...base,
      prompt: 'Wie viele Sekunden sind seit der letzten vollen Minute vergangen?',
      input: { widget: 'number', unit: 's' },
      solution: { type: 'seconds', value: seconds },
      solutionText: `${seconds} s`,
      explanation:
        `Der dünne Sekundenzeiger zeigt auf ${seconds}. ` +
        `Seit der letzten vollen Minute sind ${seconds} Sekunden vergangen.`,
      visual: {
        kind: 'clock',
        h12,
        minute,
        second: seconds,
        showSecond: true,
      },
    };
  }

  // stopwatchBack: show mm:ss, ask for one second earlier.
  // Bias toward the exact-minute edge cases the workbook highlights.
  let totalSeconds: number;
  if (difficulty >= 2 && rng.chance(0.5)) {
    totalSeconds = rng.pick([60, 120, 300]); // 01:00, 02:00, 05:00
  } else {
    totalSeconds = rng.int(1, 359);
  }
  const before = totalSeconds - 1;
  const { minutes: bm, seconds: bs } = secondsToMinutesSeconds(before);
  const isEdge = totalSeconds % 60 === 0;
  return {
    ...base,
    prompt: 'Was zeigte die Stoppuhr eine Sekunde vorher?',
    input: { widget: 'minsec' },
    solution: { type: 'minsec', total: before },
    solutionText: formatStopwatch(before),
    explanation: isEdge
      ? `Achtung, Minutenwechsel! Eine Sekunde vor ${formatStopwatch(totalSeconds)} ` +
        `war es ${formatStopwatch(before)} – die Sekunden springen von 00 auf 59 ` +
        `zurück und die Minute wird um 1 kleiner.`
      : `Eine Sekunde weniger: ${formatStopwatch(totalSeconds)} → ` +
        `${formatStopwatch(before)} (${bm} min ${bs} s).`,
    visual: { kind: 'stopwatch', seconds: totalSeconds },
  };
}
