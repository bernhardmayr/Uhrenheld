/**
 * Block A – reading an analog clock (minute-precise), with the workbook's
 * "double answer" (morning + afternoon), targeted feedback on the classic
 * mistake of swapping the hour and minute hands, and – as an extra task type
 * beyond the workbook – the reverse direction: dragging the hands to set the
 * clock to a given digital time.
 */
import type { Rng } from '../rng';
import type { Difficulty, Task } from '../tasks';
import {
  dayMinutesToTwelveHour,
  formatClock,
  hm,
  twelveHourToDayMinutes,
} from '../time';
import { taskId } from './util';

function readingSentence(h12: number, minute: number): string {
  return (
    `Der blaue Stundenzeiger steht kurz nach der ${h12}, ` +
    `der rote Minutenzeiger zeigt ${minute} Minuten an.`
  );
}

/**
 * "Stelle die Uhr ein" – the inverse of reading the clock: given a digital
 * 24-hour time, the child drags the hands to the matching dial position.
 * The target minute uses the same difficulty-based precision as the reading
 * variant; the hour is drawn from the full day so the exercise also trains
 * the 24 h -> 12 h dial mapping.
 */
function generateSetClockTask(rng: Rng, difficulty: Difficulty): Task {
  const hour24 = rng.int(0, 23);
  const minute = difficulty === 1 ? rng.int(0, 11) * 5 : rng.int(0, 59);
  const target = hm(hour24, minute);
  const { h12, minute: dialMinute } = dayMinutesToTwelveHour(target);

  return {
    id: taskId(rng, 'A'),
    block: 'A',
    prompt: `Stelle die Uhr auf ${formatClock(target)} ein.`,
    hint: 'Ziehe die Zeiger oder wähle sie aus und nutze die Pfeiltasten.',
    input: { widget: 'clockSet' },
    solution: { type: 'clockPosition', h12, minute: dialMinute },
    solutionText: `Stundenzeiger auf die ${h12}, Minutenzeiger auf ${dialMinute}`,
    explanation:
      `${formatClock(target)}: Der blaue Stundenzeiger zeigt auf die ${h12}, ` +
      `der rote Minutenzeiger auf ${dialMinute} Minuten.`,
    difficulty,
  };
}

export function generateBlockA(rng: Rng, difficulty: Difficulty): Task {
  // The setting exercise doesn't fit the double-answer format, so it's only
  // offered alongside the two reading variants at difficulty 1 and 2.
  if (difficulty < 3 && rng.chance(0.35)) {
    return generateSetClockTask(rng, difficulty);
  }

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
