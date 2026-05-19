import { useEffect, useRef } from 'react';
import { useGridStore } from '../store/useGridStore';
import { useYouTubeMetadata } from './useYouTubeMetadata';
import { useTwitchStream } from './useTwitchStream';

/**
 * Per-tile watcher that resolves a live viewer count for a single tile.
 * Returns null if metadata is unavailable (no API key or unsupported type).
 */
export function useTileViewerCount(tileId: string): number | null {
  const tile = useGridStore((s) => s.tiles.find((t) => t.id === tileId));
  const yt = useYouTubeMetadata(tile?.type === 'youtube' ? tile.url : '');
  const twitch = useTwitchStream(tile?.type === 'twitch' ? tile.url : '');

  if (!tile) return null;
  if (tile.type === 'youtube') return yt?.viewerCount ?? null;
  if (tile.type === 'twitch') return twitch?.isLive ? twitch.viewerCount : null;
  return null;
}

/**
 * Watches all tiles and, when viewer counts are available, automatically
 * solos the tile with the highest concurrent viewer count.
 * Only activates when `enabled` is true.
 */
export function useHypeDetection(
  viewerCounts: Map<string, number>,
  enabled: boolean
) {
  const toggleSolo = useGridStore((s) => s.toggleSolo);
  const soloTileId = useGridStore((s) => s.soloTileId);
  const prevHeroRef = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled || viewerCounts.size === 0) return;

    // Find the tile with the highest viewer count
    let topId: string | null = null;
    let topCount = -1;
    viewerCounts.forEach((count, id) => {
      if (count > topCount) {
        topCount = count;
        topId = id;
      }
    });

    if (topId && topId !== prevHeroRef.current) {
      // If a different tile is currently soloed, un-solo it first, then solo new hero
      if (soloTileId && soloTileId !== topId) toggleSolo(soloTileId);
      toggleSolo(topId);
      prevHeroRef.current = topId;
    }
  }, [viewerCounts, enabled, soloTileId, toggleSolo]);
}
