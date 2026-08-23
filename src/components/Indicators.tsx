/** Small status indicators: hearts, stars and the streak badge. */

export function Hearts({ count, max }: { count: number; max: number }) {
  return (
    <div className="flex gap-1" aria-label={`${count} von ${max} Herzen übrig`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} aria-hidden="true" className="text-2xl">
          {i < count ? '❤️' : '🤍'}
        </span>
      ))}
    </div>
  );
}

export function StarRow({ stars, size = 'text-3xl' }: { stars: number; size?: string }) {
  return (
    <div className={`flex gap-1 ${size}`} aria-label={`${stars} von 3 Sternen`}>
      {[1, 2, 3].map((i) => (
        <span key={i} aria-hidden="true">
          {i <= stars ? '⭐' : '☆'}
        </span>
      ))}
    </div>
  );
}

export function StreakBadge({ streak }: { streak: number }) {
  if (streak < 2) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-sm font-bold text-heft-orange-dark">
      🔥 {streak}er-Serie
    </span>
  );
}
