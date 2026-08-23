/**
 * Drives one round: a fixed number of generated tasks, hearts, an in-round
 * streak multiplier and points. The round always ends kindly – running out of
 * hearts finishes the round with encouragement, never a hard "game over".
 */
import { useMemo, useState } from 'react';
import { START_HEARTS, TASKS_PER_ROUND, BLOCK_BY_ID } from '../data/blocks';
import { classifyError, type ErrorTag } from '../lib/errors';
import { generateTask } from '../lib/generators';
import { createTimeSeededRng } from '../lib/rng';
import { pointsForAnswer } from '../lib/scoring';
import { checkAnswer, type Block, type Difficulty, type Task, type UserAnswer } from '../lib/tasks';
import { useGameStore } from '../store/gameStore';

export type RoundPhase = 'answering' | 'feedback' | 'done';

export interface LastResult {
  correct: boolean;
  points: number;
  errorTag?: ErrorTag;
  answered: boolean;
}

export interface UseRound {
  task: Task;
  index: number;
  total: number;
  phase: RoundPhase;
  hearts: number;
  streak: number;
  correctCount: number;
  roundPoints: number;
  last: LastResult | null;
  timePerTask: number;
  submit: (answer: UserAnswer, remainingRatio: number) => void;
  timeUp: () => void;
  next: () => void;
}

export function useRound(block: Block, difficulty: Difficulty): UseRound {
  const timed = useGameStore((s) => s.progress.settings.timed);
  const recordAnswer = useGameStore((s) => s.recordAnswer);
  const finishRound = useGameStore((s) => s.finishRound);

  const tasks = useMemo(() => {
    const rng = createTimeSeededRng();
    return Array.from({ length: TASKS_PER_ROUND }, () =>
      generateTask(block, rng, difficulty),
    );
  }, [block, difficulty]);

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<RoundPhase>('answering');
  const [hearts, setHearts] = useState(START_HEARTS);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [roundPoints, setRoundPoints] = useState(0);
  const [last, setLast] = useState<LastResult | null>(null);

  const task = tasks[index];

  const resolve = (answer: UserAnswer | null, remainingRatio: number) => {
    if (phase !== 'answering') return;
    const correct = answer !== null && checkAnswer(task, answer);
    const newStreak = correct ? streak + 1 : 0;
    const points = correct
      ? pointsForAnswer({
          difficulty,
          streak: newStreak,
          remainingRatio,
          timed,
        })
      : 0;
    const errorTag: ErrorTag | undefined =
      !correct && answer !== null ? classifyError(task, answer) : undefined;

    recordAnswer({ block, correct, points, errorTag });
    setStreak(newStreak);
    setCorrectCount((n) => n + (correct ? 1 : 0));
    setRoundPoints((p) => p + points);
    if (!correct) setHearts((h) => Math.max(0, h - 1));
    setLast({ correct, points, errorTag, answered: answer !== null });
    setPhase('feedback');
  };

  const submit = (answer: UserAnswer, remainingRatio: number) =>
    resolve(answer, remainingRatio);
  const timeUp = () => resolve(null, 0);

  const next = () => {
    const isLast = index >= tasks.length - 1 || hearts <= 0;
    if (isLast) {
      finishRound({
        block,
        difficulty,
        correct: correctCount,
        total: tasks.length,
      });
      setPhase('done');
      return;
    }
    setIndex((i) => i + 1);
    setPhase('answering');
    setLast(null);
  };

  return {
    task,
    index,
    total: tasks.length,
    phase,
    hearts,
    streak,
    correctCount,
    roundPoints,
    last,
    timePerTask: BLOCK_BY_ID[block].timePerTask,
    submit,
    timeUp,
    next,
  };
}
