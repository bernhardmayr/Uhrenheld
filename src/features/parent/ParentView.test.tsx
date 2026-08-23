import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ParentView } from './ParentView';
import { applyAnswer, applyRoundResult, defaultProgress } from '../../lib/progress';
import { useGameStore } from '../../store/gameStore';

beforeEach(() => {
  localStorage.clear();
  useGameStore.setState({ progress: defaultProgress() });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ParentView', () => {
  it('shows a placeholder before any mistakes were recorded', () => {
    render(<ParentView />);
    expect(screen.getByText('Noch keine Fehler erfasst.')).toBeInTheDocument();
  });

  it('lists per-block accuracy and the most frequent error type', () => {
    let p = defaultProgress();
    p = applyAnswer(p, { block: 'A', correct: true, points: 10 });
    p = applyAnswer(p, {
      block: 'A',
      correct: false,
      points: 0,
      errorTag: 'hands-swapped',
    });
    p = applyAnswer(p, {
      block: 'A',
      correct: false,
      points: 0,
      errorTag: 'hands-swapped',
    });
    useGameStore.setState({ progress: p });

    render(<ParentView />);
    expect(screen.getByText('33 %')).toBeInTheDocument();
    expect(screen.getByText('Zeiger vertauscht')).toBeInTheDocument();
    expect(screen.getByText('2×')).toBeInTheDocument();
  });

  it('asks for confirmation before resetting progress, and only resets on confirm', () => {
    let p = defaultProgress();
    p = applyRoundResult(p, {
      block: 'A',
      difficulty: 1,
      correct: 6,
      total: 6,
      today: '2026-01-01',
    });
    useGameStore.setState({ progress: p });

    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    render(<ParentView />);
    fireEvent.click(screen.getByRole('button', { name: 'Alles zurücksetzen' }));
    expect(confirmSpy).toHaveBeenCalledOnce();
    expect(useGameStore.getState().progress.roundsPlayed).toBe(1);

    confirmSpy.mockReturnValue(true);
    fireEvent.click(screen.getByRole('button', { name: 'Alles zurücksetzen' }));
    expect(useGameStore.getState().progress.roundsPlayed).toBe(0);
  });
});
