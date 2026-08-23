import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AnalogClock } from './AnalogClock';
import { Stopwatch } from './Stopwatch';

describe('AnalogClock', () => {
  it('renders with an accessible time label', () => {
    render(<AnalogClock h12={3} minute={40} />);
    expect(
      screen.getByRole('img', { name: /3 Uhr 40 Minuten/ }),
    ).toBeInTheDocument();
  });

  it('draws twelve numerals', () => {
    const { container } = render(<AnalogClock h12={12} minute={0} />);
    const numerals = [...container.querySelectorAll('text')].map(
      (t) => t.textContent,
    );
    for (let n = 1; n <= 12; n++) {
      expect(numerals).toContain(String(n));
    }
  });
});

describe('Stopwatch', () => {
  it('shows the mm:ss value', () => {
    render(<Stopwatch seconds={59} />);
    expect(screen.getByText('00:59')).toBeInTheDocument();
  });
});
