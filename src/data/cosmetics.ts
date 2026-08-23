/** Unlockable cosmetics – avatars and clock faces – gated by total points. */

export interface Avatar {
  id: string;
  emoji: string;
  name: string;
  unlockPoints: number;
}

export const AVATARS: Avatar[] = [
  { id: 'fox', emoji: '🦊', name: 'Fuchs', unlockPoints: 0 },
  { id: 'owl', emoji: '🦉', name: 'Eule', unlockPoints: 0 },
  { id: 'cat', emoji: '🐱', name: 'Katze', unlockPoints: 100 },
  { id: 'robot', emoji: '🤖', name: 'Roboter', unlockPoints: 300 },
  { id: 'dragon', emoji: '🐲', name: 'Drache', unlockPoints: 600 },
  { id: 'unicorn', emoji: '🦄', name: 'Einhorn', unlockPoints: 1000 },
];

export interface ClockFace {
  id: string;
  name: string;
  ring: string; // outer ring colour
  unlockPoints: number;
}

export const CLOCK_FACES: ClockFace[] = [
  { id: 'classic', name: 'Klassisch', ring: '#ea580c', unlockPoints: 0 },
  { id: 'ocean', name: 'Ozean', ring: '#0284c7', unlockPoints: 150 },
  { id: 'forest', name: 'Wald', ring: '#16a34a', unlockPoints: 400 },
  { id: 'berry', name: 'Beere', ring: '#db2777', unlockPoints: 800 },
];

export function isUnlocked(unlockPoints: number, totalPoints: number): boolean {
  return totalPoints >= unlockPoints;
}
