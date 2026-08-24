/**
 * A draggable analog clock: the child grabs the hour or minute hand and turns
 * it, or uses the arrow keys once a hand has focus. Used for the "Stelle die
 * Uhr ein" task (Block A), the inverse of reading the clock.
 *
 * The hour hand snaps to the 12 discrete hour marks rather than creeping
 * fractionally with the minutes – for a *setting* exercise that is easier to
 * hit precisely than the continuous placement a real clock (and the reading
 * task's AnalogClock) shows.
 */
import { useCallback, useRef } from 'react';
import { ClockFace } from './AnalogClock';
import {
  CLOCK_CENTER,
  angleFromOffset,
  angleToHour12,
  angleToMinute,
  polarPoint,
} from '../lib/clockGeometry';

export interface ClockPosition {
  h12: number;
  minute: number;
}

export interface SettableClockProps {
  value: ClockPosition;
  onChange: (next: ClockPosition) => void;
  disabled?: boolean;
  size?: number;
  className?: string;
}

type Dragging = 'hour' | 'minute' | null;

export function SettableClock({
  value,
  onChange,
  disabled = false,
  size = 240,
  className,
}: SettableClockProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const draggingRef = useRef<Dragging>(null);

  const angleFromClient = useCallback((clientX: number, clientY: number): number => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    const cx = rect.left + (rect.width * CLOCK_CENTER) / 240;
    const cy = rect.top + (rect.height * CLOCK_CENTER) / 240;
    return angleFromOffset(clientX - cx, clientY - cy);
  }, []);

  const applyPointer = useCallback(
    (clientX: number, clientY: number) => {
      const dragging = draggingRef.current;
      if (!dragging || disabled) return;
      const angle = angleFromClient(clientX, clientY);
      if (dragging === 'hour') {
        const nextH12 = angleToHour12(angle);
        if (nextH12 !== value.h12) onChange({ h12: nextH12, minute: value.minute });
      } else {
        const nextMinute = angleToMinute(angle);
        if (nextMinute !== value.minute) onChange({ h12: value.h12, minute: nextMinute });
      }
    },
    [angleFromClient, disabled, onChange, value.h12, value.minute],
  );

  const startDrag = (which: Dragging) => (e: React.PointerEvent) => {
    if (disabled) return;
    e.preventDefault();
    draggingRef.current = which;
    applyPointer(e.clientX, e.clientY);
    try {
      (e.target as Element).setPointerCapture(e.pointerId);
    } catch {
      // Pointer capture is unavailable in some test/browser environments;
      // dragging still works via the move handler below.
    }
  };
  const endDrag = () => {
    draggingRef.current = null;
  };
  const onPointerMove = (e: React.PointerEvent) => applyPointer(e.clientX, e.clientY);

  const stepHour = (delta: number) => {
    if (disabled) return;
    const next = (((value.h12 - 1 + delta) % 12) + 12) % 12;
    onChange({ h12: next + 1, minute: value.minute });
  };
  const stepMinute = (delta: number) => {
    if (disabled) return;
    onChange({ h12: value.h12, minute: (((value.minute + delta) % 60) + 60) % 60 });
  };

  const hourAngle = value.h12 * 30;
  const minuteAngle = value.minute * 6;
  const hourEnd = polarPoint(hourAngle, 50);
  const minuteEnd = polarPoint(minuteAngle, 80);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 240 240"
      width={size}
      height={size}
      className={className}
      style={{ touchAction: 'none' }}
      role="group"
      aria-label="Stellbare Uhr"
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onPointerCancel={endDrag}
    >
      <ClockFace />

      {/* Blue hour hand. */}
      <line
        x1={CLOCK_CENTER}
        y1={CLOCK_CENTER}
        x2={hourEnd.x}
        y2={hourEnd.y}
        stroke="#1d4ed8"
        strokeWidth={8}
        strokeLinecap="round"
        pointerEvents="none"
      />
      {/* Red minute hand. */}
      <line
        x1={CLOCK_CENTER}
        y1={CLOCK_CENTER}
        x2={minuteEnd.x}
        y2={minuteEnd.y}
        stroke="#dc2626"
        strokeWidth={5}
        strokeLinecap="round"
        pointerEvents="none"
      />
      <circle cx={CLOCK_CENTER} cy={CLOCK_CENTER} r={7} fill="#1e293b" pointerEvents="none" />

      {/* Drag handles, large enough for small fingers and keyboard-focusable. */}
      <circle
        cx={hourEnd.x}
        cy={hourEnd.y}
        r={16}
        fill="#1d4ed8"
        opacity={0.001}
        stroke="#1d4ed8"
        strokeWidth={2}
        role="slider"
        aria-label="Stundenzeiger"
        aria-valuenow={value.h12}
        aria-valuemin={1}
        aria-valuemax={12}
        aria-valuetext={`${value.h12} Uhr`}
        tabIndex={disabled ? -1 : 0}
        onPointerDown={startDrag('hour')}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); stepHour(1); }
          if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); stepHour(-1); }
        }}
      />
      <circle
        cx={minuteEnd.x}
        cy={minuteEnd.y}
        r={14}
        fill="#dc2626"
        opacity={0.001}
        stroke="#dc2626"
        strokeWidth={2}
        role="slider"
        aria-label="Minutenzeiger"
        aria-valuenow={value.minute}
        aria-valuemin={0}
        aria-valuemax={59}
        aria-valuetext={`${value.minute} Minuten`}
        tabIndex={disabled ? -1 : 0}
        onPointerDown={startDrag('minute')}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); stepMinute(1); }
          if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); stepMinute(-1); }
        }}
      />
    </svg>
  );
}
