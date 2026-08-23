import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LevelMap } from './LevelMap';
import { defaultProgress } from '../../lib/progress';
import { useGameStore } from '../../store/gameStore';

beforeEach(() => {
  localStorage.clear();
  useGameStore.setState({ progress: defaultProgress() });
});

describe('LevelMap', () => {
  it('only offers the first station and its first level when nothing is unlocked yet', () => {
    const onStart = vi.fn();
    render(<LevelMap onStart={onStart} />);

    expect(screen.getByLabelText('Station Uhr ablesen')).toBeInTheDocument();
    // Later stations are shown locked and render no level buttons.
    expect(screen.getByLabelText('Station Zeitspannen')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Zeitspannen Stufe 1/ }),
    ).not.toBeInTheDocument();

    const level1 = screen.getByRole('button', {
      name: /Uhr ablesen Stufe 1/,
    });
    expect(level1).toBeEnabled();
    const level2 = screen.getByRole('button', {
      name: /Uhr ablesen Stufe 2/,
    });
    expect(level2).toBeDisabled();

    fireEvent.click(level1);
    expect(onStart).toHaveBeenCalledWith('A', 1);
  });

  it('unlocks the next station and level once a star is earned', () => {
    useGameStore.setState({
      progress: { ...defaultProgress(), stars: { A1: 2 } },
    });
    render(<LevelMap onStart={() => {}} />);

    expect(
      screen.getByRole('button', { name: /Uhr ablesen Stufe 2/ }),
    ).toBeEnabled();
    expect(
      screen.getByRole('button', { name: /Zeitspannen Stufe 1/ }),
    ).toBeEnabled();
  });
});
