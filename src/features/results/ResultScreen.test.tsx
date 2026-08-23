import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ResultScreen } from './ResultScreen';

describe('ResultScreen', () => {
  it('shows the score, stars and praise, and wires up both buttons', () => {
    const onExit = vi.fn();
    const onReplay = vi.fn();
    render(
      <ResultScreen
        block="A"
        difficulty={1}
        correct={6}
        total={6}
        points={90}
        onExit={onExit}
        onReplay={onReplay}
      />,
    );

    expect(screen.getByText('6/6')).toBeInTheDocument();
    expect(screen.getByText('+90')).toBeInTheDocument();
    expect(screen.getByText('Fantastisch! Alles richtig gemacht.')).toBeInTheDocument();
    expect(screen.getByLabelText('3 von 3 Sternen')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Nochmal spielen' }));
    expect(onReplay).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole('button', { name: 'Zurück zur Karte' }));
    expect(onExit).toHaveBeenCalledOnce();
  });

  it('encourages another try on a weak round instead of scolding', () => {
    render(
      <ResultScreen
        block="B"
        difficulty={1}
        correct={1}
        total={6}
        points={5}
        onExit={() => {}}
        onReplay={() => {}}
      />,
    );
    expect(
      screen.getByText('Dranbleiben lohnt sich – probier es gleich nochmal!'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('0 von 3 Sternen')).toBeInTheDocument();
  });
});
