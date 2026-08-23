/** The level map: stations A–H, each with its difficulty levels and stars. */
import { StarRow } from '../../components/Indicators';
import { BLOCKS } from '../../data/blocks';
import { starsFor, isBlockUnlocked, isLevelUnlocked } from '../../lib/unlock';
import type { Block, Difficulty } from '../../lib/tasks';
import { useGameStore } from '../../store/gameStore';

interface Props {
  onStart: (block: Block, difficulty: Difficulty) => void;
}

const ORDER: Block[] = BLOCKS.map((b) => b.block);

export function LevelMap({ onStart }: Props) {
  const stars = useGameStore((s) => s.progress.stars);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 p-4">
      {BLOCKS.map((info, i) => {
        const unlocked = isBlockUnlocked(stars, ORDER, i);
        return (
          <section
            key={info.block}
            className={`heft-card p-5 ${unlocked ? '' : 'opacity-60'}`}
            aria-label={`Station ${info.title}`}
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl" aria-hidden="true">
                {unlocked ? info.icon : '🔒'}
              </span>
              <div className="flex-1">
                <h3 className="text-xl font-black text-slate-800">
                  {info.title}
                </h3>
                <p className="text-sm text-slate-500">{info.subtitle}</p>
              </div>
            </div>

            {unlocked && (
              <div className="mt-4 flex flex-wrap gap-3">
                {info.difficulties.map((d) => {
                  const open = isLevelUnlocked(
                    stars,
                    info.block,
                    info.difficulties,
                    d,
                  );
                  const earned = starsFor(stars, info.block, d);
                  return (
                    <button
                      key={d}
                      disabled={!open}
                      onClick={() => onStart(info.block, d)}
                      className="btn-secondary flex-col gap-1 py-2 disabled:opacity-50"
                      aria-label={`${info.title} Stufe ${d}, ${earned} von 3 Sternen`}
                    >
                      <span>{open ? `Stufe ${d}` : '🔒 Stufe ' + d}</span>
                      <StarRow stars={earned} size="text-base" />
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
