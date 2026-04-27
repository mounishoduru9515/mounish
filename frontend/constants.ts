import { Point, Track } from './types';

export const GRID_SIZE = 20;
export const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
export const INITIAL_DIRECTION: Point = { x: 0, y: -1 };
export const GAME_SPEED = 120; // ms per tick

// Dummy AI generated music tracks (using reliable placeholder audio)
export const TRACKS: Track[] = [
  { id: 'TRK_01', title: 'NEURAL_NET_LULLABY.WAV', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 'TRK_02', title: 'SYNTHETIC_DREAMS.WAV', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 'TRK_03', title: 'VOID_ECHOES.WAV', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];
