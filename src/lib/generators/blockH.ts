/**
 * Block H – short word problems with one or two calculation steps and
 * kid-friendly contexts (multi-day bike tour, reading, baking …).
 * Answers are durations in hours, so the "h" unit stays present.
 */
import type { Rng } from '../rng';
import type { Difficulty, Task } from '../tasks';
import { formatDuration } from '../time';
import { taskId } from './util';

const NAMES = ['Ulrich', 'Mira', 'Jonas', 'Lena', 'Tom', 'Frida', 'Kolja'];

export function generateBlockH(rng: Rng, difficulty: Difficulty): Task {
  const base = { id: taskId(rng, 'H'), block: 'H' as const, difficulty };
  const name = rng.pick(NAMES);

  if (difficulty >= 2 && rng.chance()) {
    // Multi-day tour: total known, day 1 = day 3, day 2 is one less than day 1.
    // total = day1 + (day1 - 1) + day1 + day4  -> solve for day4.
    const totalHours = rng.pick([20, 22, 24, 26]);
    const day1 = rng.int(5, 7);
    const day2 = day1 - 1;
    const day3 = day1;
    const day4 = totalHours - (day1 + day2 + day3);
    return {
      ...base,
      prompt:
        `${name} fährt bei der Tour insgesamt ${totalHours} Stunden Fahrrad. ` +
        `Am ersten Tag fährt ${name} ${day1} Stunden. Am zweiten und dritten Tag ` +
        `sitzt ${name} jeweils eine Stunde weniger auf dem Rad als am ersten Tag. ` +
        `Wie lange fährt ${name} am vierten Tag?`,
      hint: 'Rechne zuerst die ersten drei Tage zusammen.',
      input: { widget: 'hm' },
      solution: { type: 'hm', total: day4 * 60 },
      solutionText: `${day4} h`,
      explanation:
        `Tag 1: ${day1} h, Tag 2: ${day2} h, Tag 3: ${day3} h. ` +
        `Zusammen ${day1 + day2 + day3} h. ` +
        `${totalHours} h − ${day1 + day2 + day3} h = ${day4} h am vierten Tag.`,
    };
  }

  // Single-step: two activities added together.
  const a = rng.int(1, 4);
  const b = rng.int(1, 4);
  const totalMin = (a + b) * 60;
  return {
    ...base,
    prompt:
      `${name} liest am Samstag ${a} Stunden und am Sonntag ${b} Stunden. ` +
      `Wie lange liest ${name} am Wochenende insgesamt?`,
    input: { widget: 'hm' },
    solution: { type: 'hm', total: totalMin },
    solutionText: formatDuration(totalMin),
    explanation: `${a} h + ${b} h = ${a + b} h.`,
  };
}
