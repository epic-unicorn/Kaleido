export type PresetName = 'focus' | 'security-wall' | 'cinematic';

export interface PresetSlot {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Preset {
  id: PresetName;
  label: string;
  description: string;
  cols: number;
  slots: PresetSlot[];
}

export const PRESETS: Preset[] = [
  {
    id: 'focus',
    label: 'Focus',
    description: '1 large + 4 small',
    cols: 12,
    slots: [
      { x: 0, y: 0, w: 8, h: 6 },
      { x: 8, y: 0, w: 4, h: 3 },
      { x: 8, y: 3, w: 4, h: 3 },
      { x: 0, y: 6, w: 6, h: 3 },
      { x: 6, y: 6, w: 6, h: 3 },
    ],
  },
  {
    id: 'security-wall',
    label: 'Security Wall',
    description: '3×3 symmetrical grid',
    cols: 12,
    slots: [
      { x: 0, y: 0, w: 4, h: 3 }, { x: 4, y: 0, w: 4, h: 3 }, { x: 8, y: 0, w: 4, h: 3 },
      { x: 0, y: 3, w: 4, h: 3 }, { x: 4, y: 3, w: 4, h: 3 }, { x: 8, y: 3, w: 4, h: 3 },
      { x: 0, y: 6, w: 4, h: 3 }, { x: 4, y: 6, w: 4, h: 3 }, { x: 8, y: 6, w: 4, h: 3 },
    ],
  },
  {
    id: 'cinematic',
    label: 'Cinematic',
    description: '2 large side-by-side',
    cols: 12,
    slots: [
      { x: 0, y: 0, w: 6, h: 6 },
      { x: 6, y: 0, w: 6, h: 6 },
    ],
  },
];
