import { useState } from 'react';
import { AVATARS } from './data/cosmetics';
import { todayKey } from './lib/persistence';
import type { Block, Difficulty } from './lib/tasks';
import { LevelMap } from './features/levelmap/LevelMap';
import { ParentView } from './features/parent/ParentView';
import { ProfileScreen } from './features/profile/ProfileScreen';
import { RoundScreen } from './features/round/RoundScreen';
import { useGameStore } from './store/gameStore';

type View = 'map' | 'profile' | 'parent';

interface Playing {
  block: Block;
  difficulty: Difficulty;
  nonce: number;
}

export default function App() {
  const [view, setView] = useState<View>('map');
  const [playing, setPlaying] = useState<Playing | null>(null);
  const progress = useGameStore((s) => s.progress);

  const avatar =
    AVATARS.find((a) => a.id === progress.avatar)?.emoji ?? '🦊';
  const playedToday = progress.streak.lastPlayed === todayKey();

  if (playing) {
    return (
      <main className="min-h-screen pb-8">
        <RoundScreen
          key={`${playing.block}-${playing.difficulty}-${playing.nonce}`}
          block={playing.block}
          difficulty={playing.difficulty}
          onExit={() => setPlaying(null)}
          onReplay={() =>
            setPlaying((p) => (p ? { ...p, nonce: p.nonce + 1 } : p))
          }
        />
      </main>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Orange header bar */}
      <header className="bg-heft-orange px-4 py-3 text-white shadow">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl" aria-hidden="true">
              {avatar}
            </span>
            <h1 className="text-2xl font-black tracking-wide">Uhrenheld</h1>
          </div>
          <div className="flex items-center gap-3 text-sm font-bold">
            <span
              title="Tagesziel: heute üben"
              aria-label={playedToday ? 'Tagesziel erreicht' : 'Tagesziel offen'}
            >
              {playedToday ? '✅ heute' : '🎯 heute'}
            </span>
            {progress.streak.current >= 2 && (
              <span>🔥 {progress.streak.current}</span>
            )}
            <span className="rounded-full bg-white/20 px-3 py-1">
              {progress.totalPoints} P
            </span>
          </div>
        </div>
      </header>

      <main className="pb-24">
        {view === 'map' && (
          <LevelMap
            onStart={(block, difficulty) =>
              setPlaying({ block, difficulty, nonce: 0 })
            }
          />
        )}
        {view === 'profile' && <ProfileScreen />}
        {view === 'parent' && <ParentView />}
      </main>

      {/* Bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-2xl">
          <NavButton active={view === 'map'} onClick={() => setView('map')} icon="🗺️" label="Karte" />
          <NavButton active={view === 'profile'} onClick={() => setView('profile')} icon="🎒" label="Profil" />
          <NavButton active={view === 'parent'} onClick={() => setView('parent')} icon="👪" label="Eltern" />
        </div>
      </nav>
    </div>
  );
}

function NavButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-bold ${
        active ? 'text-heft-orange' : 'text-slate-400'
      }`}
      aria-current={active ? 'page' : undefined}
    >
      <span className="text-2xl" aria-hidden="true">
        {icon}
      </span>
      {label}
    </button>
  );
}
