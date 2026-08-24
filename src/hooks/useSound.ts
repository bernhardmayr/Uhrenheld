/**
 * Tiny Web Audio helper for success/error cues. No audio files are bundled –
 * the tones are synthesized – and everything is muted when sound is off.
 */
import { useCallback, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

type Cue = 'correct' | 'wrong' | 'win' | 'badge' | 'star' | 'perfect' | 'streak' | 'levelup';

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

        let notes: number[];
        switch (cue) {
          case 'correct':
            notes = [523, 659];
            break;
          case 'wrong':
            notes = [220];
            break;
          case 'win':
            notes = [523, 659, 784];
            break;
          case 'badge':
            // Celebratory fanfare for badge earned
            notes = [660, 660, 784, 880];
            break;
          case 'star':
            // Bright star sound
            notes = [800, 900];
            break;
          case 'perfect':
            // Perfect round triumphant sound
            notes = [523, 659, 784, 1047];
            break;
          case 'streak':
            // Ascending success tone
            notes = [440, 550, 660, 770];
            break;
          case 'levelup':
            // Rising epic tone
            notes = [330, 440, 550, 660, 790];
            break;
        }

        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;
          const start = ctx.currentTime + i * 0.12;
          gain.gain.setValueAtTime(0.001, start);
          gain.gain.exponentialRampToValueAtTime(0.15, start + 0.02);
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
