/**
 * The Uhrenheld analog clock, drawn as pure SVG (no external clock library).
 * White face, numerals 1–12, fine minute ticks, a blue hour hand and a red
 * minute hand – matching the workbook. An optional amber second hand and a
 * yellow sector can mark the running minute (Block E).
 *
 * It is fully described for screen readers via an aria-label and <title>.
 */
import { dayMinutesToTwelveHour } from '../lib/time';

export interface AnalogClockProps {
  /** Dial hour 1..12. */
  h12: number;
  minute: number;
  second?: number;
  showSecond?: boolean;
  /** Draw the yellow sector from 12 to the current minute/second. */
  highlightSecondSector?: boolean;
  size?: number;
  className?: string;
}

const R = 100; // internal coordinate radius; viewBox is 0..240
const CENTER = 120;

/** Point on a circle of radius `radius`, angle in degrees clockwise from top. */
function polar(angleDeg: number, radius: number): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(rad),
    y: CENTER + radius * Math.sin(rad),
  };
}

function screenReaderTime(h12: number, minute: number): string {
  return `${h12} Uhr ${minute} Minuten`;
}

export function AnalogClock({
  h12,
  minute,
  second = 0,
  showSecond = false,
  highlightSecondSector = false,
  size = 240,
  className,
}: AnalogClockProps) {
  const hourAngle = ((h12 % 12) + minute / 60) * 30;
  const minuteAngle = minute * 6;
  const secondAngle = second * 6;

  const ticks = Array.from({ length: 60 }, (_, i) => i);
  const numerals = Array.from({ length: 12 }, (_, i) => i + 1);

  const hourEnd = polar(hourAngle, R * 0.5);
  const minuteEnd = polar(minuteAngle, R * 0.8);
  const secondEnd = polar(secondAngle, R * 0.85);

  // Yellow sector path from 12 o'clock to the current second position.
  const sectorEnd = polar(showSecond ? secondAngle : minuteAngle, R * 0.9);
  const topPoint = polar(0, R * 0.9);
  const largeArc = (showSecond ? secondAngle : minuteAngle) > 180 ? 1 : 0;
  const sectorPath = `M ${CENTER} ${CENTER} L ${topPoint.x} ${topPoint.y} A ${R * 0.9} ${R * 0.9} 0 ${largeArc} 1 ${sectorEnd.x} ${sectorEnd.y} Z`;

  return (
    <svg
      viewBox="0 0 240 240"
      width={size}
      height={size}
      role="img"
      aria-label={`Analoguhr, sie zeigt ${screenReaderTime(h12, minute)}`}
      className={className}
    >
      <title>{`Analoguhr: ${screenReaderTime(h12, minute)}`}</title>

      <circle cx={CENTER} cy={CENTER} r={R + 12} fill="#ffffff" stroke="#ea580c" strokeWidth={6} />

      {highlightSecondSector && (
        <path d={sectorPath} fill="#fde68a" opacity={0.8} />
      )}

      {/* Minute ticks; every 5th is longer (hour tick). */}
      {ticks.map((i) => {
        const isHour = i % 5 === 0;
        const outer = polar(i * 6, R);
        const inner = polar(i * 6, R - (isHour ? 12 : 6));
        return (
          <line
            key={i}
            x1={outer.x}
            y1={outer.y}
            x2={inner.x}
            y2={inner.y}
            stroke={isHour ? '#334155' : '#cbd5e1'}
            strokeWidth={isHour ? 3 : 1.5}
            strokeLinecap="round"
          />
        );
      })}

      {/* Numerals 1..12. */}
      {numerals.map((n) => {
        const p = polar(n * 30, R - 28);
        return (
          <text
            key={n}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={22}
            fontWeight={800}
            fill="#1e293b"
          >
            {n}
          </text>
        );
      })}

      {/* Blue hour hand. */}
      <line
        x1={CENTER}
        y1={CENTER}
        x2={hourEnd.x}
        y2={hourEnd.y}
        stroke="#1d4ed8"
        strokeWidth={8}
        strokeLinecap="round"
      />
      {/* Red minute hand. */}
      <line
        x1={CENTER}
        y1={CENTER}
        x2={minuteEnd.x}
        y2={minuteEnd.y}
        stroke="#dc2626"
        strokeWidth={5}
        strokeLinecap="round"
      />
      {/* Optional amber second hand. */}
      {showSecond && (
        <line
          x1={CENTER}
          y1={CENTER}
          x2={secondEnd.x}
          y2={secondEnd.y}
          stroke="#f59e0b"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
      )}

      <circle cx={CENTER} cy={CENTER} r={7} fill="#1e293b" />
    </svg>
  );
}

/** Convenience wrapper that takes a 24-hour DayMinutes value. */
export function ClockFromDayMinutes({
  value,
  ...rest
}: { value: number } & Omit<AnalogClockProps, 'h12' | 'minute'>) {
  const { h12, minute } = dayMinutesToTwelveHour(value);
  return <AnalogClock h12={h12} minute={minute} {...rest} />;
}
