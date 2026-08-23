import { describe, expect, it } from 'vitest';
import { createRng } from '../rng';
import type { Block, Difficulty, Task, UserAnswer } from '../tasks';
import { checkAnswer } from '../tasks';
import { generateTask } from './index';

const BLOCKS: Block[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const DIFFICULTIES: Difficulty[] = [1, 2, 3];

/** Build the answer that the task's own solution says is correct. */
function correctAnswer(task: Task): UserAnswer {
  const s = task.solution;
  switch (s.type) {
    case 'time':
      return { widget: 'time', value: s.accepted[0] };
    case 'timeDouble':
      return { widget: 'timeDouble', a: s.morning, b: s.afternoon };
    case 'minutes':
    case 'seconds':
      return { widget: 'number', value: s.value };
    case 'hm':
      return { widget: 'hm', total: s.total };
    case 'minsec':
      return { widget: 'minsec', total: s.total };
    case 'choice':
      return { widget: 'choice', index: s.correct };
  }
}

/** A definitely-wrong answer for the same widget. */
function wrongAnswer(task: Task): UserAnswer {
  const s = task.solution;
  switch (s.type) {
    case 'time':
      return { widget: 'time', value: (s.accepted[0] + 7) % 1440 };
    case 'timeDouble':
      return { widget: 'timeDouble', a: s.morning, b: s.morning };
    case 'minutes':
    case 'seconds':
      return { widget: 'number', value: s.value + 1 };
    case 'hm':
      return { widget: 'hm', total: s.total + 1 };
    case 'minsec':
      return { widget: 'minsec', total: s.total + 1 };
    case 'choice':
      return { widget: 'choice', index: (s.correct + 1) % 3 };
  }
}

describe('every generator is self-consistent', () => {
  for (const block of BLOCKS) {
    for (const difficulty of DIFFICULTIES) {
      it(`block ${block} @ difficulty ${difficulty}`, () => {
        for (let seed = 1; seed <= 60; seed++) {
          const task = generateTask(block, createRng(seed * 31 + difficulty), difficulty);
          expect(task.block).toBe(block);
          expect(task.prompt.length).toBeGreaterThan(0);
          expect(task.explanation.length).toBeGreaterThan(0);
          expect(task.solutionText.length).toBeGreaterThan(0);
          // The generator's own correct answer must pass, a wrong one must fail.
          expect(checkAnswer(task, correctAnswer(task))).toBe(true);
          expect(checkAnswer(task, wrongAnswer(task))).toBe(false);
        }
      });
    }
  }
});

describe('block A double answer', () => {
  it('at difficulty 3 asks for both morning and afternoon and accepts either order', () => {
    const task = generateTask('A', createRng(4242), 3);
    expect(task.solution.type).toBe('timeDouble');
    if (task.solution.type !== 'timeDouble') return;
    const { morning, afternoon } = task.solution;
    expect(
      checkAnswer(task, { widget: 'timeDouble', a: afternoon, b: morning }),
    ).toBe(true);
    // A single correct half is not enough.
    expect(
      checkAnswer(task, { widget: 'timeDouble', a: morning, b: morning }),
    ).toBe(false);
  });
});

describe('block E stopwatch edge cases', () => {
  it('handles the minute roll-down 01:00 -> 00:59', () => {
    // Search seeds until we hit the 60s edge case, then verify the answer.
    let found = false;
    for (let seed = 1; seed < 400 && !found; seed++) {
      const task = generateTask('E', createRng(seed), 2);
      if (
        task.visual?.kind === 'stopwatch' &&
        task.visual.seconds === 60 &&
        task.solution.type === 'minsec'
      ) {
        expect(task.solution.total).toBe(59);
        expect(task.solutionText).toBe('00:59');
        found = true;
      }
    }
    expect(found).toBe(true);
  });
});

describe('block F is always solvable multiple choice', () => {
  it('has three options and a valid correct index', () => {
    for (let seed = 1; seed <= 50; seed++) {
      const task = generateTask('F', createRng(seed), 1);
      expect(task.input).toEqual({ widget: 'choice', options: ['s', 'min', 'h'] });
      if (task.solution.type === 'choice') {
        expect(task.solution.correct).toBeGreaterThanOrEqual(0);
        expect(task.solution.correct).toBeLessThan(3);
      }
    }
  });
});
