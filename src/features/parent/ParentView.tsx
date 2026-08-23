/**
 * Parent / teacher view: a local-only overview of how practice is going and
 * which error types recur. No data ever leaves the device.
 */
import { BLOCKS } from '../../data/blocks';
import { ERROR_LABELS, type ErrorTag } from '../../lib/errors';
import { useGameStore } from '../../store/gameStore';

function accuracy(correct: number, attempts: number): string {
  if (attempts === 0) return '–';
  return `${Math.round((correct / attempts) * 100)} %`;
}

export function ParentView() {
  const progress = useGameStore((s) => s.progress);
  const reset = useGameStore((s) => s.resetProgress);

  const errorEntries = (Object.keys(ERROR_LABELS) as ErrorTag[])
    .map((tag) => ({ tag, count: progress.errorCounts[tag] ?? 0 }))
    .filter((e) => e.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-4">
      <div className="heft-card p-5">
        <h2 className="text-xl font-black">Eltern- & Lehreransicht</h2>
        <p className="text-sm text-slate-500">
          Alle Daten bleiben nur auf diesem Gerät. Keine Konten, kein Tracking.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <Stat label="Punkte" value={progress.totalPoints} />
          <Stat label="Runden" value={progress.roundsPlayed} />
          <Stat label="Serie (Tage)" value={progress.streak.best} />
        </div>
      </div>

      <section className="heft-card p-5">
        <h3 className="mb-3 text-lg font-black">Nach Bereich</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-slate-500">
                <th className="py-1">Bereich</th>
                <th className="py-1 text-right">Aufgaben</th>
                <th className="py-1 text-right">Richtig</th>
                <th className="py-1 text-right">Quote</th>
              </tr>
            </thead>
            <tbody>
              {BLOCKS.map((b) => {
                const stat = progress.stats[b.block];
                return (
                  <tr key={b.block} className="border-t border-slate-100">
                    <td className="py-2 font-semibold">
                      {b.icon} {b.title}
                    </td>
                    <td className="py-2 text-right">{stat.attempts}</td>
                    <td className="py-2 text-right">{stat.correct}</td>
                    <td className="py-2 text-right font-bold">
                      {accuracy(stat.correct, stat.attempts)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="heft-card p-5">
        <h3 className="mb-3 text-lg font-black">Häufige Fehlertypen</h3>
        {errorEntries.length === 0 ? (
          <p className="text-sm text-slate-500">Noch keine Fehler erfasst.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {errorEntries.map((e) => (
              <li
                key={e.tag}
                className="flex items-center justify-between rounded-xl bg-amber-50 px-3 py-2"
              >
                <span className="font-semibold">{ERROR_LABELS[e.tag]}</span>
                <span className="font-black text-amber-700">{e.count}×</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="heft-card p-5">
        <h3 className="mb-2 text-lg font-black">Fortschritt zurücksetzen</h3>
        <p className="mb-3 text-sm text-slate-500">
          Löscht alle Punkte, Sterne und Abzeichen auf diesem Gerät.
        </p>
        <button
          className="btn-secondary bg-red-100 hover:bg-red-200"
          onClick={() => {
            if (
              window.confirm(
                'Wirklich den gesamten Fortschritt löschen? Das kann nicht rückgängig gemacht werden.',
              )
            ) {
              reset();
            }
          }}
        >
          Alles zurücksetzen
        </button>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-heft-beige p-3">
      <div className="text-2xl font-black text-heft-orange">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}
