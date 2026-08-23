/** Player profile: badge album, unlockable avatars and clock faces, settings. */
import { AVATARS, CLOCK_FACES, isUnlocked } from '../../data/cosmetics';
import { BADGES } from '../../lib/progress';
import { useGameStore } from '../../store/gameStore';

export function ProfileScreen() {
  const progress = useGameStore((s) => s.progress);
  const setAvatar = useGameStore((s) => s.setAvatar);
  const setClockFace = useGameStore((s) => s.setClockFace);
  const toggleSound = useGameStore((s) => s.toggleSound);
  const toggleTimed = useGameStore((s) => s.toggleTimed);

  const points = progress.totalPoints;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 p-4">
      <div className="heft-card flex items-center justify-between p-5">
        <span className="text-lg font-bold">Deine Punkte</span>
        <span className="text-3xl font-black text-heft-orange">{points}</span>
      </div>

      {/* Settings */}
      <section className="heft-card p-5">
        <h3 className="mb-3 text-xl font-black">Einstellungen</h3>
        <div className="flex flex-col gap-3">
          <label className="flex items-center justify-between">
            <span className="font-semibold">Ton</span>
            <input
              type="checkbox"
              className="h-6 w-6"
              checked={progress.settings.sound}
              onChange={toggleSound}
            />
          </label>
          <label className="flex items-center justify-between">
            <span className="font-semibold">
              Zeitdruck
              <span className="ml-2 text-sm text-slate-500">
                (aus = Übungsmodus ohne Zeit)
              </span>
            </span>
            <input
              type="checkbox"
              className="h-6 w-6"
              checked={progress.settings.timed}
              onChange={toggleTimed}
            />
          </label>
        </div>
      </section>

      {/* Badges */}
      <section className="heft-card p-5">
        <h3 className="mb-3 text-xl font-black">Abzeichen-Album</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {BADGES.map((badge) => {
            const earned = progress.badges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`rounded-2xl p-3 text-center ${
                  earned ? 'bg-heft-beige' : 'bg-slate-100 opacity-60'
                }`}
              >
                <div className="text-4xl" aria-hidden="true">
                  {earned ? badge.icon : '🔒'}
                </div>
                <div className="text-sm font-bold">{badge.title}</div>
                <div className="text-xs text-slate-500">{badge.description}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Avatars */}
      <section className="heft-card p-5">
        <h3 className="mb-3 text-xl font-black">Figur wählen</h3>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {AVATARS.map((a) => {
            const unlocked = isUnlocked(a.unlockPoints, points);
            const active = progress.avatar === a.id;
            return (
              <button
                key={a.id}
                disabled={!unlocked}
                onClick={() => setAvatar(a.id)}
                className={`rounded-2xl p-2 text-center transition ${
                  active ? 'ring-4 ring-heft-orange' : ''
                } ${unlocked ? 'bg-heft-beige' : 'bg-slate-100 opacity-60'}`}
                aria-label={`${a.name}${unlocked ? '' : `, ab ${a.unlockPoints} Punkten`}`}
              >
                <div className="text-3xl">{unlocked ? a.emoji : '🔒'}</div>
                <div className="text-xs font-semibold">
                  {unlocked ? a.name : `${a.unlockPoints} P`}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Clock faces */}
      <section className="heft-card p-5">
        <h3 className="mb-3 text-xl font-black">Zifferblatt</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CLOCK_FACES.map((f) => {
            const unlocked = isUnlocked(f.unlockPoints, points);
            const active = progress.clockFace === f.id;
            return (
              <button
                key={f.id}
                disabled={!unlocked}
                onClick={() => setClockFace(f.id)}
                className={`flex flex-col items-center gap-1 rounded-2xl p-3 ${
                  active ? 'ring-4 ring-heft-orange' : ''
                } ${unlocked ? 'bg-heft-beige' : 'bg-slate-100 opacity-60'}`}
                aria-label={`${f.name}${unlocked ? '' : `, ab ${f.unlockPoints} Punkten`}`}
              >
                <span
                  className="h-8 w-8 rounded-full border-4"
                  style={{ borderColor: f.ring }}
                  aria-hidden="true"
                />
                <span className="text-xs font-semibold">
                  {unlocked ? f.name : `${f.unlockPoints} P`}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
