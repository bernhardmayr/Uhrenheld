/**
 * Plays one round of a block: shows the task, takes the answer, gives feedback
 * with an explanation, and ends on a friendly results screen.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnswerInput } from '../../components/AnswerInput';
import { Countdown } from '../../components/Countdown';
import { Hearts, StreakBadge } from '../../components/Indicators';
import { TaskVisual } from '../../components/TaskVisual';
import { BLOCK_BY_ID } from '../../data/blocks';
import { ERROR_LABELS } from '../../lib/errors';
import type { Block, Difficulty, UserAnswer } from '../../lib/tasks';
import { useRound } from '../../hooks/useRound';
import { useSound } from '../../hooks/useSound';
import { useGameStore } from '../../store/gameStore';
import { ResultScreen } from '../results/ResultScreen';

interface Props {
  block: Block;
  difficulty: Difficulty;
  onExit: () => void;
  onReplay: () => void;
}

export function RoundScreen({ block, difficulty, onExit, onReplay }: Props) {
  const round = useRound(block, difficulty);
  const timed = useGameStore((s) => s.progress.settings.timed);
  const play = useSound();
  const info = BLOCK_BY_ID[block];

  const [answer, setAnswer] = useState<UserAnswer | null>(null);
  const [ratio, setRatio] = useState(1);
  const ratioRef = useRef(1);
  const deadlineRef = useRef<number>(0);

  // Reset the timer whenever a new task becomes active.
  useEffect(() => {
    setAnswer(null);
    if (round.phase !== 'answering') return;
    setRatio(1);
    ratioRef.current = 1;
    if (!timed) return;
    deadlineRef.current = Date.now() + round.timePerTask * 1000;
    const id = window.setInterval(() => {
      const remaining = deadlineRef.current - Date.now();
      const r = Math.max(0, remaining / (round.timePerTask * 1000));
      ratioRef.current = r;
      setRatio(r);
      if (r <= 0) {
        window.clearInterval(id);
        round.timeUp();
      }
    }, 100);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round.index, round.phase, timed]);

  // Play the feedback cue when a result appears.
  useEffect(() => {
    if (round.phase === 'feedback' && round.last) {
      play(round.last.correct ? 'correct' : 'wrong');
    }
    if (round.phase === 'done') play('win');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round.phase]);

  const progressDots = useMemo(
    () =>
      Array.from({ length: round.total }, (_, i) => i).map((i) => (
        <span
          key={i}
          className={`h-2.5 w-2.5 rounded-full ${
            i < round.index
              ? 'bg-heft-green-dark'
              : i === round.index
                ? 'bg-heft-orange'
                : 'bg-slate-200'
          }`}
        />
      )),
    [round.index, round.total],
  );

  if (round.phase === 'done') {
    return (
      <ResultScreen
        block={block}
        difficulty={difficulty}
        correct={round.correctCount}
        total={round.total}
        points={round.roundPoints}
        onExit={onExit}
        onReplay={onReplay}
      />
    );
  }

  const task = round.task;
  const feedback = round.phase === 'feedback' ? round.last : null;
  const showSubmit = task.input.widget !== 'choice';

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button className="btn-secondary px-3" onClick={onExit} aria-label="Zurück zur Karte">
          ← Karte
        </button>
        <span className="text-lg font-bold text-heft-orange-dark">
          {info.icon} {info.title}
        </span>
        <Hearts count={round.hearts} max={3} />
      </div>

      <div className="flex items-center justify-center gap-1.5">{progressDots}</div>
      {timed && round.phase === 'answering' && <Countdown ratio={ratio} />}

      {/* Task card */}
      <div className="heft-card flex flex-col gap-5 p-6">
        <h2 className="text-center text-xl font-bold text-slate-800">
          {task.prompt}
        </h2>
        {task.hint && (
          <p className="text-center text-base text-slate-500">{task.hint}</p>
        )}
        {task.visual && <TaskVisual visual={task.visual} />}

        <div className="min-h-[64px]">
          <AnswerInput
            key={task.id}
            input={task.input}
            disabled={round.phase !== 'answering'}
            onChange={setAnswer}
            onSubmit={(a) => round.submit(a, ratioRef.current)}
          />
        </div>

        {showSubmit && round.phase === 'answering' && (
          <button
            className="btn-primary self-center px-10"
            disabled={answer === null}
            onClick={() => answer && round.submit(answer, ratioRef.current)}
          >
            Prüfen
          </button>
        )}
      </div>

      {/* Feedback */}
      {feedback && (
        <div
          className={`heft-card border-4 p-5 ${
            feedback.correct ? 'border-heft-green-dark' : 'border-red-300'
          }`}
          role="status"
          aria-live="polite"
        >
          <p className="text-lg font-black">
            {feedback.correct
              ? `Richtig! + ${feedback.points} Punkte`
              : feedback.answered
                ? 'Fast! So geht es:'
                : 'Zeit vorbei! So geht es:'}
          </p>
          {!feedback.correct && (
            <p className="mt-1 text-base">
              Richtige Antwort:{' '}
              <span className="font-bold">{task.solutionText}</span>
            </p>
          )}
          <p className="mt-2 text-base text-slate-700">{task.explanation}</p>
          {!feedback.correct && feedback.errorTag && feedback.errorTag !== 'other' && (
            <p className="mt-2 inline-block rounded-lg bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800">
              Merke: {ERROR_LABELS[feedback.errorTag]}
            </p>
          )}
          <div className="mt-4 flex justify-center">
            <StreakBadge streak={round.streak} />
          </div>
          <button className="btn-primary mt-2 w-full" onClick={round.next} autoFocus>
            Weiter →
          </button>
        </div>
      )}
    </div>
  );
}
