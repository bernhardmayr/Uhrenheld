import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AnswerInput } from './AnswerInput';
import type { UserAnswer } from '../lib/tasks';

describe('AnswerInput', () => {
  it('time widget: reports null until both fields are filled, then the combined value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(a: UserAnswer | null) => void>();
    render(
      <AnswerInput
        input={{ widget: 'time' }}
        disabled={false}
        onChange={onChange}
        onSubmit={() => {}}
      />,
    );
    await user.type(screen.getByLabelText('Stunde'), '9');
    expect(onChange).toHaveBeenLastCalledWith(null);
    await user.type(screen.getByLabelText('Minute'), '54');
    expect(onChange).toHaveBeenLastCalledWith({ widget: 'time', value: 9 * 60 + 54 });
  });

  it('hm widget: combines hours and minutes into total minutes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(a: UserAnswer | null) => void>();
    render(
      <AnswerInput
        input={{ widget: 'hm' }}
        disabled={false}
        onChange={onChange}
        onSubmit={() => {}}
      />,
    );
    await user.type(screen.getByLabelText('Stunden (h)'), '1');
    await user.type(screen.getByLabelText('Minuten (min)'), '30');
    expect(onChange).toHaveBeenLastCalledWith({ widget: 'hm', total: 90 });
  });

  it('minsec widget: combines minutes and seconds into total seconds', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(a: UserAnswer | null) => void>();
    render(
      <AnswerInput
        input={{ widget: 'minsec' }}
        disabled={false}
        onChange={onChange}
        onSubmit={() => {}}
      />,
    );
    await user.type(screen.getByLabelText('Minuten (min)'), '1');
    await user.type(screen.getByLabelText('Sekunden (s)'), '27');
    expect(onChange).toHaveBeenLastCalledWith({ widget: 'minsec', total: 87 });
  });

  it('number widget: reports the entered integer', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(a: UserAnswer | null) => void>();
    render(
      <AnswerInput
        input={{ widget: 'number', unit: 'min' }}
        disabled={false}
        onChange={onChange}
        onSubmit={() => {}}
      />,
    );
    await user.type(screen.getByLabelText('Minuten'), '45');
    expect(onChange).toHaveBeenLastCalledWith({ widget: 'number', value: 45 });
  });

  it('timeDouble widget: only resolves once all four fields are filled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(a: UserAnswer | null) => void>();
    render(
      <AnswerInput
        input={{ widget: 'timeDouble' }}
        disabled={false}
        onChange={onChange}
        onSubmit={() => {}}
      />,
    );
    const hours = screen.getAllByLabelText('Stunde');
    const minutes = screen.getAllByLabelText('Minute');
    await user.type(hours[0], '1');
    await user.type(minutes[0], '35');
    expect(onChange).toHaveBeenLastCalledWith({
      widget: 'timeDouble',
      a: 1 * 60 + 35,
      b: null,
    });
    await user.type(hours[1], '13');
    await user.type(minutes[1], '35');
    expect(onChange).toHaveBeenLastCalledWith({
      widget: 'timeDouble',
      a: 1 * 60 + 35,
      b: 13 * 60 + 35,
    });
  });

  it('choice widget: submits immediately on click without needing onChange', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn<(a: UserAnswer) => void>();
    render(
      <AnswerInput
        input={{ widget: 'choice', options: ['s', 'min', 'h'] }}
        disabled={false}
        onChange={() => {}}
        onSubmit={onSubmit}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'min' }));
    expect(onSubmit).toHaveBeenCalledWith({ widget: 'choice', index: 1 });
  });
});
