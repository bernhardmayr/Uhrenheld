/**
 * Digital stopwatch: grey case, red push button, mm:ss display – as in the
 * workbook. Purely presentational.
 */
import { formatStopwatch } from '../lib/time';

export interface StopwatchProps {
  seconds: number;
  size?: number;
  className?: string;
}

export function Stopwatch({ seconds, size = 160, className }: StopwatchProps) {
  const label = formatStopwatch(seconds);
  return (
    <svg
      viewBox="0 0 200 220"
      width={size}
      height={(size * 220) / 200}
      role="img"
      aria-label={`Stoppuhr, sie zeigt ${label} Minuten`}
      className={className}
    >
      <title>{`Stoppuhr: ${label}`}</title>
      {/* Push buttons on top. */}
      <rect x={88} y={6} width={24} height={20} rx={5} fill="#b91c1c" />
      <rect x={40} y={16} width={18} height={16} rx={4} fill="#9ca3af" />
      <rect x={142} y={16} width={18} height={16} rx={4} fill="#9ca3af" />
      {/* Case. */}
      <circle cx={100} cy={120} r={82} fill="#6b7280" />
      <circle cx={100} cy={120} r={72} fill="#374151" />
      {/* Display. */}
      <rect x={44} y={98} width={112} height={44} rx={8} fill="#bfdbca" />
      <text
        x={100}
        y={122}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={34}
        fontWeight={800}
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fill="#111827"
      >
        {label}
      </text>
      <text
        x={100}
        y={168}
        textAnchor="middle"
        fontSize={13}
        fill="#e5e7eb"
      >
        min : s
      </text>
    </svg>
  );
}
