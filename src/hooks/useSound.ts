/**
 * Tiny Web Audio helper for success/error cues. No audio files are bundled –
 * the tones are synthesized – and everything is muted when sound is off.
 */
import { useCallback, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

type Cue = 'correct' | 'wrong' | 'win';

export function useSound() {
  const soundOn = useGameStore((s) => s.progress.settings.sound);
  const ctxRef = useRef<AudioContext | null>(null);

  const play = useCallback(
    (cue: Cue) => {
      if (!soundOn) return;
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (!ctxRef.current) ctxRef.current = new AudioCtx();
        const ctx = ctxRef.current;
        const notes =
          cue === 'correct'
            ? [523, 659]
            : cue === 'win'
              ? [523, 659, 784]
              : [220];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;
          const start = ctx.currentTime + i * 0.12;
          gain.gain.setValueAtTime(0.001, start);
          gain.gain.exponentialRampToValueAtTime(0.2, start + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);
          osc.connect(gain).connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 0.2);
        });
      } catch {
        // Audio not available (e.g. autoplay policy) – silently ignore.
      }
    },
    [soundOn],
  );

  return play;
}
