/**
 * Zustand store: a thin, persistent wrapper around the pure progress reducers.
 * All non-trivial logic lives in `src/lib` and is unit-tested; this file only
 * holds state, calls the reducers and saves to localStorage.
 */
import { create } from 'zustand';
import type { ErrorTag } from '../lib/errors';
import { loadState, saveState, todayKey } from '../lib/persistence';
import {
  applyAnswer,
  applyRoundResult,
  defaultProgress,
  type Progress,
} from '../lib/progress';
import type { Block } from '../lib/tasks';

interface GameState {
  progress: Progress;
  recordAnswer: (input: {
    block: Block;
    correct: boolean;
    points: number;
    errorTag?: ErrorTag;
  }) => void;
  finishRound: (input: {
    block: Block;
    difficulty: number;
    correct: number;
    total: number;
  }) => void;
  toggleSound: () => void;
  toggleTimed: () => void;
  setClockFace: (face: string) => void;
  setAvatar: (avatar: string) => void;
  resetProgress: () => void;
}

function persist(progress: Progress): Progress {
  saveState(progress);
  return progress;
}

export const useGameStore = create<GameState>((set) => ({
  progress: loadState<Progress>(defaultProgress()),

  recordAnswer: (input) =>
    set((s) => ({ progress: persist(applyAnswer(s.progress, input)) })),

  finishRound: (input) =>
    set((s) => ({
      progress: persist(
        applyRoundResult(s.progress, { ...input, today: todayKey() }),
      ),
    })),

  toggleSound: () =>
    set((s) => ({
      progress: persist({
        ...s.progress,
        settings: { ...s.progress.settings, sound: !s.progress.settings.sound },
      }),
    })),

  toggleTimed: () =>
    set((s) => ({
      progress: persist({
        ...s.progress,
        settings: { ...s.progress.settings, timed: !s.progress.settings.timed },
      }),
    })),

  setClockFace: (face) =>
    set((s) => ({ progress: persist({ ...s.progress, clockFace: face }) })),

  setAvatar: (avatar) =>
    set((s) => ({ progress: persist({ ...s.progress, avatar }) })),

  resetProgress: () => set(() => ({ progress: persist(defaultProgress()) })),
}));
