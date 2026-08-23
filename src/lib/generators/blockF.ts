/**
 * Block F – choose the fitting unit (s / min / h) for an everyday situation.
 * Multiple choice with three buttons, ideal for the timed mode.
 */
import type { Rng } from '../rng';
import type { Difficulty, Task } from '../tasks';
import { taskId } from './util';

interface Situation {
  text: string;
  unit: 's' | 'min' | 'h';
  why: string;
}

const SITUATIONS: Situation[] = [
  {
    text: 'Jana braucht für ihren Schulweg 20 ___.',
    unit: 'min',
    why: 'Ein Schulweg dauert einige Minuten – nicht Sekunden und nicht Stunden.',
  },
  {
    text: 'Familie Strauß fährt mit dem Auto 2½ ___ in den Urlaub.',
    unit: 'h',
    why: 'Eine lange Autofahrt misst man in Stunden.',
  },
  {
    text: 'Pias Handball-Training dauert 90 ___.',
    unit: 'min',
    why: '90 Minuten sind 1½ Stunden – hier passt „min".',
  },
  {
    text: 'Hannes schafft eine Blitzrechen-Aufgabe in 25 ___.',
    unit: 's',
    why: 'Eine einzelne Kopfrechenaufgabe dauert nur wenige Sekunden.',
  },
  {
    text: 'Niklas übt in der Woche 2 ___ Gitarre.',
    unit: 'h',
    why: 'Übezeit über eine ganze Woche misst man in Stunden.',
  },
  {
    text: 'Ein Wimpernschlag dauert ungefähr 1 ___.',
    unit: 's',
    why: 'Ein Wimpernschlag ist blitzschnell – das sind Sekunden.',
  },
  {
    text: 'Der Film im Kino läuft 2 ___.',
    unit: 'h',
    why: 'Ein Kinofilm dauert etwa zwei Stunden.',
  },
  {
    text: 'Zähneputzen soll 3 ___ dauern.',
    unit: 'min',
    why: 'Zähneputzen dauert ein paar Minuten.',
  },
  {
    text: 'Das Wasser kocht nach 4 ___.',
    unit: 'min',
    why: 'Wasser kochen dauert einige Minuten.',
  },
  {
    text: 'Ein Nachtschlaf dauert etwa 9 ___.',
    unit: 'h',
    why: 'Schlaf über die Nacht misst man in Stunden.',
  },
  {
    text: 'Sara atmet etwa 1 ___ pro Atemzug ein.',
    unit: 's',
    why: 'Ein Atemzug dauert nur wenige Sekunden.',
  },
  {
    text: 'Die Schulpause hat 15 ___.',
    unit: 'min',
    why: 'Eine Schulpause dauert ein paar Minuten.',
  },
  {
    text: 'Moritz springt 50 Mal im Seil – das dauert 2 ___.',
    unit: 'min',
    why: 'Mehrmaliges Seilspringen dauert ein paar Minuten.',
  },
  {
    text: 'Ein Konzert mit einer Band geht etwa 2 ___.',
    unit: 'h',
    why: 'Ein Musikkonzert dauert mehrere Stunden.',
  },
  {
    text: 'Zum Haare waschen braucht Lena 7 ___.',
    unit: 'min',
    why: 'Haare waschen dauert ein paar Minuten.',
  },
  {
    text: 'Ein Wettlauf über 100 m dauert weniger als 30 ___.',
    unit: 's',
    why: 'Ein Sprint ist sehr schnell – nur wenige Sekunden.',
  },
  {
    text: 'Eine Schulstunde mit Pause daheim dauert etwa 4 ___.',
    unit: 'h',
    why: 'Ein halber Schultag misst man in Stunden.',
  },
  {
    text: 'Eine Mathearbeit schreiben dauert 45 ___.',
    unit: 'min',
    why: 'Eine Klassenarbeit dauert etwa eine Schulstunde.',
  },
];

const UNIT_LABELS = ['s', 'min', 'h'];
const UNIT_WORDS: Record<string, string> = {
  s: 'Sekunden',
  min: 'Minuten',
  h: 'Stunden',
};

export function generateBlockF(rng: Rng, difficulty: Difficulty): Task {
  const s = rng.pick(SITUATIONS);
  const correct = UNIT_LABELS.indexOf(s.unit);
  return {
    id: taskId(rng, 'F'),
    block: 'F',
    prompt: 'Welche Einheit passt?',
    hint: s.text.replace('___', '____'),
    input: { widget: 'choice', options: UNIT_LABELS },
    solution: { type: 'choice', correct },
    solutionText: `${s.unit} (${UNIT_WORDS[s.unit]})`,
    explanation: s.why,
    difficulty,
  };
}
