/**
 * Block D – unit conversions:
 *   min -> h + min, fractions of an hour -> min,
 *   min + s -> s, s -> min + s.
 * Targets the classic "rechnet mit 100 statt 60" mistake in the explanations.
 */
import type { Rng } from '../rng';
import type { Difficulty, Task } from '../tasks';
import {
  fractionHoursToMinutes,
  formatDuration,
  formatSecondsDuration,
  minutesToHoursMinutes,
  secondsToMinutesSeconds,
} from '../time';
import { taskId } from './util';

type Kind = 'minToHm' | 'fractionToMin' | 'minSecToSec' | 'secToMinSec';

const FRACTIONS: Array<{ whole: number; num: number; den: number; label: string }> = [
  { whole: 0, num: 1, den: 2, label: '½ h' },
  { whole: 0, num: 1, den: 4, label: '¼ h' },
  { whole: 0, num: 3, den: 4, label: '¾ h' },
  { whole: 2, num: 3, den: 4, label: '2¾ h' },
  { whole: 3, num: 1, den: 2, label: '3½ h' },
  { whole: 4, num: 1, den: 2, label: '4½ h' },
  { whole: 5, num: 3, den: 4, label: '5¾ h' },
  { whole: 6, num: 1, den: 2, label: '6½ h' },
];

export function generateBlockD(rng: Rng, difficulty: Difficulty): Task {
  const kinds: Kind[] =
    difficulty === 1
      ? ['minToHm', 'secToMinSec']
      : ['minToHm', 'fractionToMin', 'minSecToSec', 'secToMinSec'];
  const kind = rng.pick(kinds);
  const base = { id: taskId(rng, 'D'), block: 'D' as const, difficulty };

  if (kind === 'minToHm') {
    const totalMinutes =
      difficulty === 1 ? rng.int(61, 180) : rng.pick([100, 275, 300, 319, 683]);
    const { hours, minutes } = minutesToHoursMinutes(totalMinutes);
    return {
      ...base,
      prompt: `${totalMinutes} min = ? h ? min`,
      input: { widget: 'hm' },
      solution: { type: 'hm', total: totalMinutes },
      solutionText: formatDuration(totalMinutes),
      explanation:
        `1 Stunde hat 60 Minuten (nicht 100!). ` +
        `${totalMinutes} : 60 = ${hours} Rest ${minutes}. ` +
        `Also ${formatDuration(totalMinutes)}.`,
    };
  }

  if (kind === 'fractionToMin') {
    const f = rng.pick(FRACTIONS);
    const value = fractionHoursToMinutes(f.whole, f.num, f.den);
    return {
      ...base,
      prompt: `${f.label} = ? min`,
      input: { widget: 'number', unit: 'min' },
      solution: { type: 'minutes', value },
      solutionText: `${value} min`,
      explanation:
        `½ h = 30 min, ¼ h = 15 min, ¾ h = 45 min. ` +
        `${f.label} sind ${value} min.`,
    };
  }

  if (kind === 'minSecToSec') {
    const minutes = rng.int(1, 5);
    const seconds = rng.pick([0, 5, 10, 27, 30, 35, 45]);
    const total = minutes * 60 + seconds;
    const label =
      seconds === 0 ? `${minutes} min` : `${minutes} min ${seconds} s`;
    return {
      ...base,
      prompt: `${label} = ? s`,
      input: { widget: 'number', unit: 's' },
      solution: { type: 'seconds', value: total },
      solutionText: `${total} s`,
      explanation:
        `1 Minute hat 60 Sekunden. ` +
        `${minutes} · 60${seconds ? ` + ${seconds}` : ''} = ${total} s.`,
    };
  }

  // secToMinSec
  const totalSeconds =
    difficulty === 1
      ? rng.int(61, 180)
      : rng.pick([59, 66, 87, 99, 125, 140, 180, 200]);
  const { minutes, seconds } = secondsToMinutesSeconds(totalSeconds);
  return {
    ...base,
    prompt: `${totalSeconds} s = ? min ? s`,
    input: { widget: 'minsec' },
    solution: { type: 'minsec', total: totalSeconds },
    solutionText: formatSecondsDuration(totalSeconds),
    explanation:
      `60 Sekunden sind 1 Minute. ` +
      `${totalSeconds} : 60 = ${minutes} Rest ${seconds}. ` +
      `Also ${formatSecondsDuration(totalSeconds)}.`,
  };
}
