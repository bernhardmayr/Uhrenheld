/**
 * Catalog of the eight learning blocks A–H. This is the single source that the
 * level map, the round runner and the parent view all read from, so the app is
 * data-driven rather than hard-coding one screen per block.
 */
import type { Block, Difficulty } from '../lib/tasks';

export interface BlockInfo {
  block: Block;
  title: string;
  /** One-line description for the level map. */
  subtitle: string;
  /** Emoji used as the station marker (no external image assets). */
  icon: string;
  /** Seconds per task in timed mode. */
  timePerTask: number;
  /** Which difficulties this block offers, in order of the level path. */
  difficulties: Difficulty[];
}

export const BLOCKS: BlockInfo[] = [
  {
    block: 'A',
    title: 'Uhr ablesen',
    subtitle: 'Lies die Uhr genau ab – Vormittag und Nachmittag.',
    icon: '🕐',
    timePerTask: 30,
    difficulties: [1, 2, 3],
  },
  {
    block: 'B',
    title: 'Zeitspannen',
    subtitle: 'Wie viel Zeit liegt dazwischen?',
    icon: '⏳',
    timePerTask: 30,
    difficulties: [1, 2],
  },
  {
    block: 'C',
    title: 'Zeitketten',
    subtitle: 'Mehrere Schritte hintereinander.',
    icon: '🔗',
    timePerTask: 40,
    difficulties: [1, 2],
  },
  {
    block: 'D',
    title: 'Umrechnen',
    subtitle: 'Zwischen s, min und h umrechnen.',
    icon: '🔄',
    timePerTask: 25,
    difficulties: [1, 2],
  },
  {
    block: 'E',
    title: 'Sekunden & Stoppuhr',
    subtitle: 'Sekundenzeiger lesen und Stoppuhr knobeln.',
    icon: '⏱️',
    timePerTask: 25,
    difficulties: [1, 2],
  },
  {
    block: 'F',
    title: 'Welche Einheit?',
    subtitle: 's, min oder h – was passt?',
    icon: '🤔',
    timePerTask: 15,
    difficulties: [1],
  },
  {
    block: 'G',
    title: 'Fahrplan',
    subtitle: 'Abfahrt, Fahrzeit und Ankunft.',
    icon: '🚆',
    timePerTask: 40,
    difficulties: [1, 2],
  },
  {
    block: 'H',
    title: 'Sachaufgaben',
    subtitle: 'Kleine Geschichten mit Zeit.',
    icon: '📖',
    timePerTask: 45,
    difficulties: [1, 2],
  },
];

export const BLOCK_BY_ID: Record<Block, BlockInfo> = Object.fromEntries(
  BLOCKS.map((b) => [b.block, b]),
) as Record<Block, BlockInfo>;

/** Number of tasks in one round. */
export const TASKS_PER_ROUND = 6;

/** Hearts a child starts a round with. */
export const START_HEARTS = 3;
