/** Friendly end-of-round screen: stars, points and encouraging words. */
import { StarRow } from '../../components/Indicators';
import { BLOCK_BY_ID } from '../../data/blocks';
import { starsForRound } from '../../lib/scoring';
import type { Block, Difficulty } from '../../lib/tasks';

interface Props {
  block: Block;
  difficulty: Difficulty;
  correct: number;
  total: number;
  points: number;
  onExit: () => void;
  onReplay: () => void;
}

function praise(stars: number): string {
  if (stars === 3) return 'Fantastisch! Alles richtig gemacht.';
  if (stars === 2) return 'Super gemacht! Fast alles stimmt.';
  if (stars === 1) return 'Gut gemacht! Weiter so.';
  return 'Dranbleiben lohnt sich – probier es gleich nochmal!';
}

export function ResultScreen({
  block,
  difficulty,
  correct,
  total,
  points,
  onExit,
  onReplay,
}: Props) {
  const stars = starsForRound(correct, total);
  const info = BLOCK_BY_ID[block];

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 p-6 text-center">
      <div className="text-6xl" aria-hidden="true">
        {info.icon}
      </div>
      <h2 className="text-2xl font-black text-heft-orange-dark">
        {info.title} – Stufe {difficulty}
      </h2>
      <StarRow stars={stars} size="text-5xl" />
      <p className="text-xl font-bold">{praise(stars)}</p>
      <div className="heft-card grid w-full grid-cols-2 gap-4 p-5">
        <div>
          <div className="text-3xl font-black text-heft-orange">{correct}/{total}</div>
          <div className="text-sm text-slate-500">richtig</div>
        </div>
        <div>
          <div className="text-3xl font-black text-heft-orange">+{points}</div>
          <div className="text-sm text-slate-500">Punkte</div>
        </div>
      </div>
      <div className="flex w-full flex-col gap-3">
        <button className="btn-primary w-full" onClick={onReplay}>
          Nochmal spielen
        </button>
        <button className="btn-secondary w-full" onClick={onExit}>
          Zurück zur Karte
        </button>
      </div>
    </div>
  );
}
