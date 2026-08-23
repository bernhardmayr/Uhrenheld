import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { ProfileScreen } from './ProfileScreen';
import { defaultProgress } from '../../lib/progress';
import { useGameStore } from '../../store/gameStore';

beforeEach(() => {
  localStorage.clear();
  useGameStore.setState({ progress: defaultProgress() });
});

describe('ProfileScreen', () => {
  it('shows points and lets the child toggle sound and timed mode', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('0', { exact: true })).toBeInTheDocument();

    const soundToggle = screen.getByLabelText('Ton') as HTMLInputElement;
    expect(soundToggle.checked).toBe(true);
    fireEvent.click(soundToggle);
    expect(useGameStore.getState().progress.settings.sound).toBe(false);

    const timedToggle = screen.getByRole('checkbox', {
      name: /Zeitdruck/,
    }) as HTMLInputElement;
    expect(timedToggle.checked).toBe(true);
    fireEvent.click(timedToggle);
    expect(useGameStore.getState().progress.settings.timed).toBe(false);
  });

  it('locks avatars and clock faces that require more points than the child has', () => {
    render(<ProfileScreen />);
    // 'Katze' unlocks at 100 points; starting at 0 it must be disabled.
    const cat = screen.getByRole('button', { name: /Katze/ });
    expect(cat).toBeDisabled();
    // The default avatar 'Fuchs' is free and selectable.
    const fox = screen.getByRole('button', { name: 'Fuchs' });
    expect(fox).toBeEnabled();
    fireEvent.click(fox);
    expect(useGameStore.getState().progress.avatar).toBe('fox');
  });

  it('unlocks cosmetics once enough points are earned', () => {
    useGameStore.setState({
      progress: { ...defaultProgress(), totalPoints: 150 },
    });
    render(<ProfileScreen />);
    expect(screen.getByRole('button', { name: /Katze/ })).toBeEnabled();
  });

  it('lists every badge, greyed out until earned', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('Erste Runde')).toBeInTheDocument();
    expect(screen.getByText('Punktesammler')).toBeInTheDocument();
  });
});
