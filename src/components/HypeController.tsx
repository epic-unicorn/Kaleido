import { useCallback, useEffect, useRef, useState } from 'react';
import { useGridStore } from '../store/useGridStore';
import { useYouTubeMetadata } from '../hooks/useYouTubeMetadata';
import { useTwitchStream } from '../hooks/useTwitchStream';
import type { GridLayoutItem } from '../types';

// Resolves the viewer count for a single tile
function useTileCount(tile: GridLayoutItem): number | null {
  const yt = useYouTubeMetadata(tile.type === 'youtube' ? tile.url : '');
  const tw = useTwitchStream(tile.type === 'twitch' ? tile.url : '');
  if (tile.type === 'youtube') return yt?.viewerCount ?? null;
  if (tile.type === 'twitch') return tw?.isLive ? tw.viewerCount : null;
  return null;
}

// Renders nothing — purely drives hype detection side-effects
function TileHypeWatcher({
  tile,
  onCount,
}: {
  tile: GridLayoutItem;
  onCount: (id: string, count: number | null) => void;
}) {
  const count = useTileCount(tile);
  useEffect(() => {
    onCount(tile.id, count);
  }, [tile.id, count, onCount]);
  return null;
}

interface HypeControllerProps {
  enabled: boolean;
}

export default function HypeController({ enabled }: HypeControllerProps) {
  const tiles = useGridStore((s) => s.tiles);
  const soloTileId = useGridStore((s) => s.soloTileId);
  const toggleSolo = useGridStore((s) => s.toggleSolo);

  const countsRef = useRef<Map<string, number>>(new Map());
  const prevHeroRef = useRef<string | null>(null);

  const handleCount = useCallback((id: string, count: number | null) => {
    if (count === null) {
      countsRef.current.delete(id);
    } else {
      countsRef.current.set(id, count);
    }
  }, []);

  // Re-evaluate hero every 30s when enabled
  useEffect(() => {
    if (!enabled) return;
    const evaluate = () => {
      const counts = countsRef.current;
      if (counts.size === 0) return;
      let topId: string | null = null;
      let topCount = -1;
      counts.forEach((count, id) => {
        if (count > topCount) { topCount = count; topId = id; }
      });
      if (topId && topId !== prevHeroRef.current) {
        if (soloTileId && soloTileId !== topId) toggleSolo(soloTileId);
        if (!soloTileId || soloTileId !== topId) toggleSolo(topId);
        prevHeroRef.current = topId;
      }
    };
    evaluate();
    const timer = setInterval(evaluate, 30_000);
    return () => clearInterval(timer);
  }, [enabled, soloTileId, toggleSolo]);

  return (
    <>
      {tiles.map((tile) => (
        <TileHypeWatcher key={tile.id} tile={tile} onCount={handleCount} />
      ))}
    </>
  );
}
