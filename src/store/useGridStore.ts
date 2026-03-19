import { create } from 'zustand';
import type { GridLayoutItem } from '../types';
import { detectSourceType, getTitleFromUrl } from '../utils/sourceDetector';
import { PRESETS, type PresetName } from '../utils/presets';

// ---------------------------------------------------------------------------
// Sample streams for developer "Seed" mode
// ---------------------------------------------------------------------------
const SAMPLE_STREAMS: Omit<GridLayoutItem, 'id'>[] = [
  {
    url: 'https://customercontenttest.cloudinary.com/video/upload/sp_hd/v1693925393/samples/sea-turtle.m3u8',
    type: 'hls',
    title: 'Sea Turtle (HLS)',
    isMuted: true,
    x: 0, y: 0, w: 6, h: 5,
  },
  {
    url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
    type: 'youtube',
    title: 'LoFi Hip Hop Radio (YouTube)',
    isMuted: true,
    x: 6, y: 0, w: 6, h: 5,
  },
  {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    type: 'file',
    title: 'Big Buck Bunny (MP4)',
    isMuted: true,
    x: 0, y: 5, w: 6, h: 5,
  },
  {
    url: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
    type: 'youtube',
    title: 'LoFi Girl (YouTube)',
    isMuted: true,
    x: 6, y: 5, w: 6, h: 5,
  },
];

// ---------------------------------------------------------------------------
// Store shape
// ---------------------------------------------------------------------------
interface GridStore {
  tiles: GridLayoutItem[];
  isEditMode: boolean;
  soloTileId: string | null;
  activePreset: PresetName | null;

  addTile: (url: string, dropCol?: number, dropRow?: number) => string;
  removeTile: (id: string) => void;
  updateLayout: (layout: Array<{ i: string; x: number; y: number; w: number; h: number }>) => void;
  toggleMute: (id: string) => void;
  toggleSolo: (id: string) => void;
  muteAll: () => void;
  unmuteAll: () => void;
  toggleEditMode: () => void;
  loadPreset: (name: PresetName) => void;
  seedSamples: () => void;
  clearAll: () => void;
}

function uid(): string {
  return `tile-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function nextY(tiles: GridLayoutItem[]): number {
  if (tiles.length === 0) return 0;
  return Math.max(...tiles.map((t) => t.y + t.h));
}

// ---------------------------------------------------------------------------
// Store implementation
// ---------------------------------------------------------------------------
export const useGridStore = create<GridStore>((set, get) => ({
  tiles: [],
  isEditMode: true,
  soloTileId: null,
  activePreset: null,

  addTile(url, dropCol = 0, dropRow) {
    const id = uid();
    const type = detectSourceType(url);
    const title = getTitleFromUrl(url, type);
    const { tiles } = get();
    const y = dropRow !== undefined ? dropRow : nextY(tiles);

    const newTile: GridLayoutItem = {
      id,
      url,
      type,
      title,
      isMuted: true, // always start muted for browser autoplay policy
      x: dropCol,
      y,
      w: 6,
      h: 5,
      minW: 2,
      minH: 2,
    };

    set((s) => ({ tiles: [...s.tiles, newTile], activePreset: null }));
    return id;
  },

  removeTile(id) {
    set((s) => ({
      tiles: s.tiles.filter((t) => t.id !== id),
      soloTileId: s.soloTileId === id ? null : s.soloTileId,
    }));
  },

  updateLayout(layout) {
    set((s) => ({
      tiles: s.tiles.map((tile) => {
        const l = layout.find((li) => li.i === tile.id);
        return l ? { ...tile, x: l.x, y: l.y, w: l.w, h: l.h } : tile;
      }),
    }));
  },

  toggleMute(id) {
    set((s) => ({
      tiles: s.tiles.map((t) => (t.id === id ? { ...t, isMuted: !t.isMuted } : t)),
    }));
  },

  toggleSolo(id) {
    set((s) => ({ soloTileId: s.soloTileId === id ? null : id }));
  },

  muteAll() {
    set((s) => ({
      tiles: s.tiles.map((t) => ({ ...t, isMuted: true })),
      soloTileId: null,
    }));
  },

  unmuteAll() {
    set((s) => ({
      tiles: s.tiles.map((t) => ({ ...t, isMuted: false })),
    }));
  },

  toggleEditMode() {
    set((s) => ({ isEditMode: !s.isEditMode }));
  },

  loadPreset(name) {
    const preset = PRESETS.find((p) => p.id === name);
    if (!preset) return;

    const { tiles } = get();
    const updatedTiles: GridLayoutItem[] = preset.slots.map((slot, i) => {
      const existing = tiles[i];
      if (existing) {
        return { ...existing, x: slot.x, y: slot.y, w: slot.w, h: slot.h };
      }
      return null;
    }).filter(Boolean) as GridLayoutItem[];

    set({ tiles: updatedTiles, activePreset: name });
  },

  seedSamples() {
    const seeded: GridLayoutItem[] = SAMPLE_STREAMS.map((s) => ({
      ...s,
      id: uid(),
      minW: 2,
      minH: 2,
    }));
    set({ tiles: seeded, activePreset: null, soloTileId: null });
  },

  clearAll() {
    set({ tiles: [], soloTileId: null, activePreset: null });
  },
}));
