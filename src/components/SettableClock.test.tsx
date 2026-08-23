import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SettableClock, type ClockPosition } from './SettableClock';

/** jsdom's getBoundingClientRect is all zeros; give the dial a real 240x240 box. */
function mockClientRect(svg: SVGSVGElement) {
  vi.spyOn(svg, 'getBoundingClientRect').mockReturnValue({
    left: 0,
    top: 0,
    width: 240,
    height: 240,
    right: 240,
    bottom: 240,
    x: 0,
    y: 0,
    toJSON() {
      return {};
    },
  });
}

describe('SettableClock', () => {
  it('renders two labeled, keyboard-focusable sliders at the given position', () => {
    render(<SettableClock value={{ h12: 9, minute: 54 }} onChange={() => {}} />);
    const hour = screen.getByRole('slider', { name: 'Stundenzeiger' });
    const minute = screen.getByRole('slider', { name: 'Minutenzeiger' });
    expect(hour).toHaveAttribute('aria-valuenow', '9');
    expect(minute).toHaveAttribute('aria-valuenow', '54');
    expect(hour).toHaveAttribute('tabindex', '0');
  });

  it('arrow keys step the hour hand and wrap 12 -> 1', () => {
    const onChange = vi.fn<(v: ClockPosition) => void>();
    render(<SettableClock value={{ h12: 12, minute: 0 }} onChange={onChange} />);
    fireEvent.keyDown(screen.getByRole('slider', { name: 'Stundenzeiger' }), {
      key: 'ArrowRight',
    });
    expect(onChange).toHaveBeenCalledWith({ h12: 1, minute: 0 });
  });

  it('arrow keys step the minute hand and wrap 0 -> 59 going down', () => {
    const onChange = vi.fn<(v: ClockPosition) => void>();
    render(<SettableClock value={{ h12: 3, minute: 0 }} onChange={onChange} />);
    fireEvent.keyDown(screen.getByRole('slider', { name: 'Minutenzeiger' }), {
      key: 'ArrowDown',
    });
    expect(onChange).toHaveBeenCalledWith({ h12: 3, minute: 59 });
  });

  it('dragging the minute handle to the 3 o\'clock position sets minute 15', () => {
    const onChange = vi.fn<(v: ClockPosition) => void>();
    const { container } = render(
      <SettableClock value={{ h12: 6, minute: 0 }} onChange={onChange} />,
    );
    const svg = container.querySelector('svg')!;
    mockClientRect(svg);
    const minuteHandle = screen.getByRole('slider', { name: 'Minutenzeiger' });

    fireEvent.pointerDown(minuteHandle, { clientX: 220, clientY: 120, pointerId: 1 });
    fireEvent.pointerMove(svg, { clientX: 220, clientY: 120, pointerId: 1 });
    expect(onChange).toHaveBeenLastCalledWith({ h12: 6, minute: 15 });
  });

  it('dragging the hour handle to the 6 o\'clock position sets hour 6', () => {
    const onChange = vi.fn<(v: ClockPosition) => void>();
    const { container } = render(
      <SettableClock value={{ h12: 3, minute: 20 }} onChange={onChange} />,
    );
    const svg = container.querySelector('svg')!;
    mockClientRect(svg);
    const hourHandle = screen.getByRole('slider', { name: 'Stundenzeiger' });

    fireEvent.pointerDown(hourHandle, { clientX: 120, clientY: 220, pointerId: 1 });
    fireEvent.pointerMove(svg, { clientX: 120, clientY: 220, pointerId: 1 });
    expect(onChange).toHaveBeenLastCalledWith({ h12: 6, minute: 20 });
  });

  it('ignores pointer and keyboard input while disabled', () => {
    const onChange = vi.fn<(v: ClockPosition) => void>();
    render(
      <SettableClock value={{ h12: 5, minute: 5 }} onChange={onChange} disabled />,
    );
    const hourHandle = screen.getByRole('slider', { name: 'Stundenzeiger' });
    expect(hourHandle).toHaveAttribute('tabindex', '-1');
    fireEvent.keyDown(hourHandle, { key: 'ArrowRight' });
    expect(onChange).not.toHaveBeenCalled();
  });
});
