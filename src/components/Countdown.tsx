/**
 * A visible countdown bar for the timed mode. It motivates but never blocks:
 * when it runs out the round runner simply reveals the answer, and in practice
 * mode this component is not rendered at all.
 */
export interface CountdownProps {
  /** 0..1 fraction of time remaining. */
  ratio: number;
  className?: string;
}

export function Countdown({ ratio, className }: CountdownProps) {
  const pct = Math.max(0, Math.min(1, ratio)) * 100;
  const color =
    pct > 50 ? 'bg-heft-green-dark' : pct > 20 ? 'bg-heft-yellow' : 'bg-red-400';
  return (
    <div
      className={`h-3 w-full overflow-hidden rounded-full bg-slate-200 ${className ?? ''}`}
      role="timer"
      aria-label="Verbleibende Zeit"
    >
      <div
        className={`h-full rounded-full transition-[width] duration-200 ease-linear ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
