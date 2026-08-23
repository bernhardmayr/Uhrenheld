import { describe, expect, it } from 'vitest';
import { classifyError } from './errors';
import type { Task } from './tasks';
import { hm, twelveHourToDayMinutes } from './time';

function clockTaskA(h12: number, minute: number): Task {
  const { morning, afternoon } = twelveHourToDayMinutes(h12, minute);
  return {
    id: 'A-1',
    block: 'A',
    prompt: 'x',
    input: { widget: 'time' },
    solution: { type: 'time', accepted: [morning, afternoon] },
    solutionText: 'x',
    explanation: 'x',
    difficulty: 2,
    visual: { kind: 'clock', h12, minute },
  };
}

describe('classifyError', () => {
  it('detects swapped hands in block A', () => {
    // Dial shows 3:40. Swapped reading: hour from minute hand (8), minute from
    // hour hand (3*5 = 15) -> 8:15.
    const task = clockTaskA(3, 40);
    const swap = twelveHourToDayMinutes(8, 15);
    expect(
      classifyError(task, { widget: 'time', value: swap.morning }),
    ).toBe('hands-swapped');
  });

  it('falls back to other for an unrelated wrong time', () => {
    const task = clockTaskA(3, 40);
    expect(classifyError(task, { widget: 'time', value: hm(4, 0) })).toBe(
      'other',
    );
  });

  it('detects base-100 mistakes in block D', () => {
    // 100 min is 1 h 40 min (=100). A child reading the digits as "1 h 0 min"
    // enters total 60.
    const task: Task = {
      id: 'D-1',
      block: 'D',
      prompt: '100 min',
      input: { widget: 'hm' },
      solution: { type: 'hm', total: 100 },
      solutionText: '1 h 40 min',
      explanation: 'x',
      difficulty: 2,
    };
    expect(classifyError(task, { widget: 'hm', total: 60 })).toBe('used-100');
  });

  it('flags the stopwatch minute roll-down', () => {
    const task: Task = {
      id: 'E-1',
      block: 'E',
      prompt: 'x',
      input: { widget: 'minsec' },
      solution: { type: 'minsec', total: 59 },
      solutionText: '00:59',
      explanation: 'x',
      difficulty: 2,
      visual: { kind: 'stopwatch', seconds: 60 },
    };
    expect(classifyError(task, { widget: 'minsec', total: 0 })).toBe(
      'minute-rolldown',
    );
  });
});
