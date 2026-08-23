import { render, screen, fireEvent, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { RoundScreen } from './RoundScreen';
import { useGameStore } from '../../store/gameStore';
import { defaultProgress } from '../../lib/progress';

beforeEach(() => {
  localStorage.clear();
  useGameStore.setState({ progress: { ...defaultProgress(), settings: { sound: false, timed: false } } });
});

afterEach(() => {
  localStorage.clear();
});

describe('RoundScreen', () => {
  it('renders a task and gives feedback after a multiple-choice answer', () => {
    render(
      <RoundScreen block="F" difficulty={1} onExit={() => {}} onReplay={() => {}} />,
    );
    // Block F is multiple choice with s / min / h buttons.
    expect(screen.getByText('Welche Einheit passt?')).toBeInTheDocument();
    const buttons = screen.getAllByRole('button', { name: /^(s|min|h)$/ });
    expect(buttons.length).toBe(3);
    fireEvent.click(buttons[0]);
    // Feedback region appears (either praise or correction).
    const status = screen.getByRole('status');
    expect(status).toBeInTheDocument();
    expect(within(status).getByText(/Weiter/)).toBeInTheDocument();
  });
});
