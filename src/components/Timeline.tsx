/**
 * Time arrow like in the workbook: `Startzeit ──label──> Zielzeit`.
 * An unknown endpoint is shown as "?".
 */
import { formatClock } from '../lib/time';

export interface TimelineProps {
  start: number | null;
  end: number | null;
  arrowLabel: string;
  className?: string;
}

function endpointText(value: number | null): string {
  return value === null ? '?' : formatClock(value);
}

export function Timeline({ start, end, arrowLabel, className }: TimelineProps) {
  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-3 ${className ?? ''}`}
    >
      <span className="rounded-xl bg-heft-beige px-4 py-2 text-xl font-bold text-slate-800">
        {endpointText(start)}
      </span>
      <span className="flex flex-col items-center" aria-hidden="true">
        <span className="text-sm font-bold text-heft-orange-dark">
          {arrowLabel}
        </span>
        <span className="text-2xl leading-none text-slate-400">──▶</span>
      </span>
      <span className="sr-only">{arrowLabel} später</span>
      <span className="rounded-xl bg-heft-beige px-4 py-2 text-xl font-bold text-slate-800">
        {endpointText(end)}
      </span>
    </div>
  );
}
