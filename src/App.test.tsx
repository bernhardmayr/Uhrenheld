import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';
import { defaultProgress } from './lib/progress';
import { useGameStore } from './store/gameStore';

beforeEach(() => {
  localStorage.clear();
  useGameStore.setState({ progress: defaultProgress() });
});

describe('App shell', () => {
  it('shows the header and the level map, and can switch to the parent view', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Uhrenheld' })).toBeInTheDocument();
    // First station is unlocked; later ones are locked.
    expect(screen.getByLabelText('Station Uhr ablesen')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Eltern/ }));
    expect(
      screen.getByRole('heading', { name: /Eltern- & Lehreransicht/ }),
    ).toBeInTheDocument();
  });
});
