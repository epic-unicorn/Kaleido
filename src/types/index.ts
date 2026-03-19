export type SourceType = 'youtube' | 'twitch' | 'hls' | 'file' | 'webcam';

export interface VideoTileData {
  id: string;
  url: string;
  type: SourceType;
  title: string;
  isMuted: boolean;
}

export interface GridLayoutItem extends VideoTileData {
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
}

export type PresetName = 'focus' | 'security-wall' | 'cinematic';
