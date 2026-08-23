/** Renders whatever illustration a task carries (clock, stopwatch, arrow, table). */
import type { Visual } from '../lib/tasks';
import { AnalogClock } from './AnalogClock';
import { Stopwatch } from './Stopwatch';
import { Timeline } from './Timeline';

export function TaskVisual({ visual }: { visual: Visual }) {
  switch (visual.kind) {
    case 'clock':
      return (
        <div className="flex justify-center">
          <AnalogClock
            h12={visual.h12}
            minute={visual.minute}
            second={visual.second}
            showSecond={visual.showSecond}
            highlightSecondSector={visual.showSecond}
            size={220}
          />
        </div>
      );
    case 'stopwatch':
      return (
        <div className="flex justify-center">
          <Stopwatch seconds={visual.seconds} />
        </div>
      );
    case 'timeline':
      return (
        <Timeline
          start={visual.start}
          end={visual.end}
          arrowLabel={visual.arrowLabel}
        />
      );
    case 'table':
      return (
        <div className="overflow-x-auto">
          <table className="mx-auto border-collapse text-center">
            <thead>
              <tr>
                {visual.headers.map((h, i) => (
                  <th
                    key={i}
                    className="border border-amber-200 bg-heft-yellow px-3 py-2 text-sm font-bold"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visual.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td
                      key={c}
                      className="border border-amber-200 bg-heft-beige px-3 py-2 font-semibold"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}
