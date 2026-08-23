/**
 * Task model shared by every exercise generator and the game engine.
 *
 * A `Task` is plain, serializable data plus a `Solution`. The UI picks an input
 * widget from `input.widget`; the widget produces a `UserAnswer`; `checkAnswer`
 * decides correctness. Keeping this pure (no closures) makes the whole thing
 * trivial to unit-test.
 */
import type { DayMinutes } from './time';

export type Block = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';

export const BLOCK_TITLES: Record<Block, string> = {
  A: 'Uhr ablesen',
  B: 'Zeitspannen',
  C: 'Zeitketten',
  D: 'Umrechnen',
  E: 'Sekunden & Stoppuhr',
  F: 'Welche Einheit?',
  G: 'Fahrplan',
  H: 'Sachaufgaben',
};

export type Difficulty = 1 | 2 | 3;

// --- Visual payloads the task screens can render -----------------------------

export interface ClockVisual {
  kind: 'clock';
  /** 1..12 dial hour. */
  h12: number;
  minute: number;
  /** Optional second hand (Block E). */
  second?: number;
  showSecond?: boolean;
}

export interface TimelineVisual {
  kind: 'timeline';
  /** Segments drawn as `label ──arrow──> ...`. A null endpoint is the unknown. */
  start: DayMinutes | null;
  end: DayMinutes | null;
  /** Text on the arrow, e.g. "30 min" or "?". */
  arrowLabel: string;
}

export interface StopwatchVisual {
  kind: 'stopwatch';
  /** Displayed value in seconds. */
  seconds: number;
}

export interface TableVisual {
  kind: 'table';
  headers: string[];
  rows: string[][];
}

export type Visual =
  | ClockVisual
  | TimelineVisual
  | StopwatchVisual
  | TableVisual;

// --- Input widgets -----------------------------------------------------------

export type InputSpec =
  | { widget: 'time' } // one HH:MM -> DayMinutes
  | { widget: 'timeDouble' } // two HH:MM (morning + afternoon)
  | { widget: 'hm' } // hours + minutes -> total minutes
  | { widget: 'minsec' } // minutes + seconds -> total seconds
  | { widget: 'number'; unit: 's' | 'min' } // single integer
  | { widget: 'choice'; options: string[] } // multiple choice index
  | { widget: 'clockSet' }; // drag the hands to a dial position (h12 + minute)

// --- Solutions ---------------------------------------------------------------

export type Solution =
  | { type: 'time'; accepted: DayMinutes[] }
  | { type: 'timeDouble'; morning: DayMinutes; afternoon: DayMinutes }
  | { type: 'minutes'; value: number }
  | { type: 'seconds'; value: number }
  | { type: 'hm'; total: number } // total minutes, entered as h + min
  | { type: 'minsec'; total: number } // total seconds, entered as min + s
  | { type: 'choice'; correct: number }
  | { type: 'clockPosition'; h12: number; minute: number }; // dial position, no AM/PM

// --- User answers (produced by widgets) --------------------------------------

export type UserAnswer =
  | { widget: 'time'; value: DayMinutes | null }
  | { widget: 'timeDouble'; a: DayMinutes | null; b: DayMinutes | null }
  | { widget: 'hm'; total: number }
  | { widget: 'minsec'; total: number }
  | { widget: 'number'; value: number }
  | { widget: 'choice'; index: number }
  | { widget: 'clockSet'; h12: number; minute: number };

export interface Task {
  id: string;
  block: Block;
  /** Short heading such as "Wie spät ist es?". */
  prompt: string;
  input: InputSpec;
  solution: Solution;
  /** Correct answer as display text, e.g. "1 h 30 min". */
  solutionText: string;
  /** Kid-friendly explanation shown after answering. */
  explanation: string;
  difficulty: Difficulty;
  visual?: Visual;
  /** Optional secondary hint line shown under the prompt. */
  hint?: string;
}

/**
 * Decide whether the child's answer matches the task's solution.
 * Returns false for mismatched widget/solution pairings rather than throwing,
 * so the engine can never crash on unexpected input.
 */
export function checkAnswer(task: Task, answer: UserAnswer): boolean {
  const { solution } = task;
  switch (solution.type) {
    case 'time':
      return (
        answer.widget === 'time' &&
        answer.value !== null &&
        solution.accepted.includes(answer.value)
      );
    case 'timeDouble':
      if (answer.widget !== 'timeDouble') return false;
      if (answer.a === null || answer.b === null) return false;
      // Either order is accepted.
      return (
        (answer.a === solution.morning && answer.b === solution.afternoon) ||
        (answer.a === solution.afternoon && answer.b === solution.morning)
      );
    case 'minutes':
      return answer.widget === 'number' && answer.value === solution.value;
    case 'seconds':
      return answer.widget === 'number' && answer.value === solution.value;
    case 'hm':
      return answer.widget === 'hm' && answer.total === solution.total;
    case 'minsec':
      return answer.widget === 'minsec' && answer.total === solution.total;
    case 'choice':
      return answer.widget === 'choice' && answer.index === solution.correct;
    case 'clockPosition':
      return (
        answer.widget === 'clockSet' &&
        answer.h12 === solution.h12 &&
        answer.minute === solution.minute
      );
    default:
      return false;
  }
}
