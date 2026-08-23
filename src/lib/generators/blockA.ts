/**
 * Block A – reading an analog clock (minute-precise), with the workbook's
 * "double answer" (morning + afternoon) and targeted feedback on the classic
 * mistake of swapping the hour and minute hands.
 */
import type { Rng } from '../rng';
import type { Difficulty, Task } from '../tasks';
import {
  dayMinutesToTwelveHour,
  formatClock,
  twelveHourToDayMinutes,
} from '../time';
import { taskId } from './util';

function readingSentence(h12: number, minute: number): string {
  return (
    `Der blaue Stundenzeiger steht kurz nach der ${h12}, ` +
    `der rote Minutenzeiger zeigt ${minute} Minuten an.`
  );
}

export function generateBlockA(rng: Rng, difficulty: Difficulty): Task {
  const h12 = rng.int(1, 12);
  // Difficulty 1 keeps the minute on a 5-minute mark; 2 and 3 are exact.
  const minute = difficulty === 1 ? rng.int(0, 11) * 5 : rng.int(0, 59);
  const { morning, afternoon } = twelveHourToDayMinutes(h12, minute);

  if (difficulty >= 3) {
    return {
      id: taskId(rng, 'A'),
      block: 'A',
      prompt: 'Wie spät ist es? Schreibe die Vormittags- und die Nachmittagszeit.',
      hint: readingSentence(h12, minute),
      input: { widget: 'timeDouble' },
      solution: { type: 'timeDouble', morning, afternoon },
      solutionText: `${formatClock(morning)} / ${formatClock(afternoon)}`,
      explanation:
        `Die Uhr kann zwei Zeiten meinen: ${formatClock(morning)} am Vormittag ` +
        `und ${formatClock(afternoon)} am Nachmittag. Tipp: Der kurze blaue Zeiger ` +
        `ist die Stunde, der lange rote Zeiger die Minute – vertausche sie nicht!`,
      difficulty,
      visual: { kind: 'clock', h12, minute },
    };
  }

  // Single-answer variants: accept both the morning and afternoon reading so a
  // child who writes 13:35 for a 1:35 dial is still correct.
  return {
    id: taskId(rng, 'A'),
    block: 'A',
    prompt: 'Wie spät ist es? Lies die Uhr genau ab.',
    hint: readingSentence(h12, minute),
    input: { widget: 'time' },
    solution: { type: 'time', accepted: [morning, afternoon] },
    solutionText: `${formatClock(morning)} (oder ${formatClock(afternoon)})`,
    explanation:
      `Der kurze blaue Zeiger ist die Stunde (${dayMinutesToTwelveHour(morning).h12}), ` +
      `der lange rote Zeiger die Minute (${minute}). ` +
      `Also ${formatClock(morning)} oder ${formatClock(afternoon)}.`,
    difficulty,
    visual: { kind: 'clock', h12, minute },
  };
}
