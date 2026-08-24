/**
 * The persisted progress model and the *pure* reducers that evolve it.
 * Keeping the logic here (not in the store) means points, stars, streaks and
 * badges are all unit-tested; the Zustand store is a thin wrapper that persists.
 */
import { isNextDay } from './persistence';
import { starsForRound } from './scoring';
import type { Block } from './tasks';
import type { ErrorTag } from './errors';

export interface BlockStat {
  attempts: number;
  correct: number;
}

export interface Settings {
  sound: boolean;
  timed: boolean;
}

export interface Streak {
  current: number;
  best: number;
  lastPlayed: string | null;
}

export interface Progress {
  version: 1;
  totalPoints: number;
  /** Best stars per level, keyed `${block}${difficulty}`. */
  stars: Record<string, number>;
  stats: Record<Block, BlockStat>;
  errorCounts: Record<ErrorTag, number>;
  roundsPlayed: number;
  perfectRounds: number;
  badges: string[];
  settings: Settings;
  streak: Streak;
  clockFace: string;
  avatar: string;
}

const ALL_BLOCKS: Block[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export function emptyStats(): Record<Block, BlockStat> {
  return Object.fromEntries(
    ALL_BLOCKS.map((b) => [b, { attempts: 0, correct: 0 }]),
  ) as Record<Block, BlockStat>;
}

export function defaultProgress(): Progress {
  return {
    version: 1,
    totalPoints: 0,
    stars: {},
    stats: emptyStats(),
    errorCounts: { 'hands-swapped': 0, 'used-100': 0, 'minute-rolldown': 0, other: 0 },
    roundsPlayed: 0,
    perfectRounds: 0,
    badges: [],
    settings: { sound: true, timed: true },
    streak: { current: 0, best: 0, lastPlayed: null },
    clockFace: 'classic',
    avatar: 'fox',
  };
}

export function levelKey(block: Block, difficulty: number): string {
  return `${block}${difficulty}`;
}

// --- Reducers ----------------------------------------------------------------

export interface AnswerOutcome {
  block: Block;
  correct: boolean;
  points: number;
  errorTag?: ErrorTag;
}

/** Fold a single answer into progress (immutably). */
export function applyAnswer(p: Progress, outcome: AnswerOutcome): Progress {
  const stat = p.stats[outcome.block];
  const stats = {
    ...p.stats,
    [outcome.block]: {
      attempts: stat.attempts + 1,
      correct: stat.correct + (outcome.correct ? 1 : 0),
    },
  };
  const errorCounts = { ...p.errorCounts };
  if (!outcome.correct && outcome.errorTag) {
    errorCounts[outcome.errorTag] += 1;
  }
  return {
    ...p,
    totalPoints: p.totalPoints + Math.max(0, outcome.points),
    stats,
    errorCounts,
  };
}

export interface RoundResult {
  block: Block;
  difficulty: number;
  correct: number;
  total: number;
  today: string;
}

/** Fold a finished round into progress: stars, streak, rounds, badges. */
export function applyRoundResult(p: Progress, r: RoundResult): Progress {
  const stars = starsForRound(r.correct, r.total);
  const key = levelKey(r.block, r.difficulty);
  const bestStars = Math.max(p.stars[key] ?? 0, stars);

  // Streak: same day keeps it, next day increments, a gap resets to 1.
  let current = p.streak.current;
  const last = p.streak.lastPlayed;
  if (last === r.today) {
    current = Math.max(current, 1);
  } else if (last && isNextDay(last, r.today)) {
    current = current + 1;
  } else {
    current = 1;
  }

  const next: Progress = {
    ...p,
    stars: { ...p.stars, [key]: bestStars },
    roundsPlayed: p.roundsPlayed + 1,
    perfectRounds: p.perfectRounds + (r.correct === r.total ? 1 : 0),
    streak: {
      current,
      best: Math.max(p.streak.best, current),
      lastPlayed: r.today,
    },
  };
  return { ...next, badges: recomputeBadges(next) };
}

// --- Badges ------------------------------------------------------------------

export interface BadgeDef {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: (p: Progress) => boolean;
}

export const BADGES: BadgeDef[] = [
  {
    id: 'first-round',
    title: 'Erste Runde',
    description: 'Du hast deine erste Runde gespielt.',
    icon: '🎉',
    earned: (p) => p.roundsPlayed >= 1,
  },
  {
    id: 'perfect',
    title: 'Volltreffer',
    description: 'Eine Runde ganz ohne Fehler.',
    icon: '🎯',
    earned: (p) => p.perfectRounds >= 1,
  },
  {
    id: 'perfect-5',
    title: 'Perfektionist',
    description: '5 fehlerfreie Runden.',
    icon: '✨',
    earned: (p) => p.perfectRounds >= 5,
  },
  {
    id: 'points-200',
    title: 'Punktesammler',
    description: 'Über 200 Punkte gesammelt.',
    icon: '⭐',
    earned: (p) => p.totalPoints >= 200,
  },
  {
    id: 'points-500',
    title: 'Aufsteiger',
    description: 'Über 500 Punkte gesammelt.',
    icon: '📈',
    earned: (p) => p.totalPoints >= 500,
  },
  {
    id: 'points-1000',
    title: 'Zeitmeister',
    description: 'Über 1000 Punkte gesammelt.',
    icon: '🏆',
    earned: (p) => p.totalPoints >= 1000,
  },
  {
    id: 'points-2000',
    title: 'Zeit-Legende',
    description: 'Über 2000 Punkte gesammelt.',
    icon: '👑',
    earned: (p) => p.totalPoints >= 2000,
  },
  {
    id: 'streak-3',
    title: 'Drei Tage dabei',
    description: '3 Tage hintereinander geübt.',
    icon: '🔥',
    earned: (p) => p.streak.best >= 3,
  },
  {
    id: 'streak-7',
    title: 'Wochenmeister',
    description: '7 Tage hintereinander geübt.',
    icon: '🌟',
    earned: (p) => p.streak.best >= 7,
  },
  {
    id: 'clock-master',
    title: 'Uhren-Profi',
    description: '3 Sterne beim Uhr-Ablesen (Stufe 3).',
    icon: '🕐',
    earned: (p) => (p.stars['A3'] ?? 0) >= 3,
  },
  {
    id: 'hard-mode-hero',
    title: 'Schwierigkeits-Held',
    description: 'Mind. 1 Stern in schwierigster Stufe (3) in jedem Bereich.',
    icon: '⚡',
    earned: (p) =>
      ALL_BLOCKS.every((b) => (p.stars[`${b}3`] ?? 0) >= 1),
  },
  {
    id: 'all-blocks',
    title: 'Alleskönner',
    description: 'In jedem Bereich mindestens 1 Stern.',
    icon: '🌈',
    earned: (p) =>
      ALL_BLOCKS.every((b) =>
        Object.entries(p.stars).some(
          ([k, v]) => k.startsWith(b) && v >= 1,
        ),
      ),
  },
  {
    id: 'block-h-pro',
    title: 'Geschichte-Meister',
    description: '3 Sterne bei Sachaufgaben (Block H, Stufe 3).',
    icon: '📖',
    earned: (p) => (p.stars['H3'] ?? 0) >= 3,
  },
  {
    id: 'rounds-50',
    title: 'Spieler',
    description: '50 Runden absolviert.',
    icon: '🎮',
    earned: (p) => p.roundsPlayed >= 50,
  },
  {
    id: 'rounds-100',
    title: 'Meisterschüler',
    description: '100 Runden absolviert.',
    icon: '🏅',
    earned: (p) => p.roundsPlayed >= 100,
  },
];

/** Union of previously earned badges and any newly satisfied ones. */
export function recomputeBadges(p: Progress): string[] {
  const earned = new Set(p.badges);
  for (const b of BADGES) {
    if (b.earned(p)) earned.add(b.id);
  }
  return [...earned];
}
