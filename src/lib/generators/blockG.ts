/**
 * Block G – timetables. Two shapes:
 *  - departure + travel time = arrival (with travel times over 60 min)
 *  - travel time for a leg / for the whole route (result in "h min").
 *
 * All place names and times are invented (no workbook data is copied).
 */
import type { Rng } from '../rng';
import type { Difficulty, Task } from '../tasks';
import { addMinutes, formatClock, formatDuration } from '../time';
import { taskId } from './util';

const TOWNS = [
  'Ahornstadt',
  'Birkenbach',
  'Kirschau',
  'Lindenfeld',
  'Moosgrün',
  'Nussberg',
  'Rosental',
  'Tannheim',
  'Ulmenhof',
  'Weidenau',
  'Eichenried',
  'Fichtendorf',
  'Hainbach',
  'Kastanienhof',
  'Pappelhausen',
];

const VEHICLES = [
  { name: 'Zug', verb: 'fährt' },
  { name: 'Bus', verb: 'fährt' },
  { name: 'Bahn', verb: 'fährt' },
  { name: 'Auto', verb: 'fährt' },
] as const;

function pickRoute(rng: Rng, count: number): string[] {
  const pool = [...TOWNS];
  const route: string[] = [];
  for (let i = 0; i < count; i++) {
    const idx = rng.int(0, pool.length - 1);
    route.push(pool.splice(idx, 1)[0]);
  }
  return route;
}

export function generateBlockG(rng: Rng, difficulty: Difficulty): Task {
  const base = { id: taskId(rng, 'G'), block: 'G' as const, difficulty };

  if (difficulty >= 2 && rng.chance()) {
    // Departure + travel time (> 60 min) = arrival.
    const [from, to] = pickRoute(rng, 2);
    const departure = rng.int(6, 18) * 60 + rng.pick([0, 15, 30, 45]);
    const travel = rng.pick([60, 75, 90, 105, 120]);
    const arrival = addMinutes(departure, travel);
    const vehicle = rng.pick(VEHICLES);
    return {
      ...base,
      prompt: `${vehicle.name.charAt(0).toUpperCase() + vehicle.name.slice(1)} ${vehicle.verb} um ${formatClock(departure)} in ${from} ab und braucht ${formatDuration(travel)} bis ${to}. Wann kommt ${vehicle.name} an?`,
      input: { widget: 'time' },
      solution: { type: 'time', accepted: [arrival] },
      solutionText: formatClock(arrival),
      explanation:
        `${formatClock(departure)} + ${formatDuration(travel)} = ${formatClock(arrival)}. ` +
        `Erst die volle Stunde voll machen, dann die restlichen Minuten dazu.`,
    };
  }

  // Timetable with stops; ask for a leg time or the whole-route time.
  const stops = pickRoute(rng, 4);
  const legTimes = stops.slice(1).map(() => rng.int(6, 25));
  const start = rng.int(7, 17) * 60 + rng.pick([0, 4, 12, 24, 38]);
  const times = [start];
  for (const t of legTimes) times.push(addMinutes(times[times.length - 1], t));

  const rows = stops.map((s, i) => [s, formatClock(times[i])]);
  const askWhole = rng.chance(0.6);

  if (askWhole) {
    const total = legTimes.reduce((a, b) => a + b, 0);
    return {
      ...base,
      prompt: `Wie lange dauert die ganze Fahrt von ${stops[0]} bis ${stops[stops.length - 1]}?`,
      input: { widget: 'number', unit: 'min' },
      solution: { type: 'minutes', value: total },
      solutionText: formatDuration(total),
      explanation:
        `Von ${formatClock(start)} bis ${formatClock(times[times.length - 1])} ` +
        `sind es ${formatDuration(total)}.`,
      visual: { kind: 'table', headers: ['Haltestelle', 'Ankunft'], rows },
    };
  }

  const legIndex = rng.int(0, legTimes.length - 1);
  const leg = legTimes[legIndex];
  return {
    ...base,
    prompt: `Wie lange fährt der Zug von ${stops[legIndex]} nach ${stops[legIndex + 1]}?`,
    input: { widget: 'number', unit: 'min' },
    solution: { type: 'minutes', value: leg },
    solutionText: formatDuration(leg),
    explanation:
      `${stops[legIndex]} ab ${formatClock(times[legIndex])}, ` +
      `${stops[legIndex + 1]} an ${formatClock(times[legIndex + 1])}: ` +
      `${formatDuration(leg)}.`,
    visual: { kind: 'table', headers: ['Haltestelle', 'Ankunft'], rows },
  };
}
