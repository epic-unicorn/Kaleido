import React, { useState, useCallback } from 'react';
import ReactPlayer from 'react-player';
import {
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  X,
  Info,
  Users,
} from 'lucide-react';
import type { GridLayoutItem } from '../types';
import { getSourceLabel, getSourceColor } from '../utils/sourceDetector';
import { useGridStore } from '../store/useGridStore';
import { useYouTubeMetadata } from '../hooks/useYouTubeMetadata';
import { useTwitchStream } from '../hooks/useTwitchStream';

// ── Twitch official iframe embed ───────────────────────────────────────────
function TwitchEmbed({ channel, muted, playing }: { channel: string; muted: boolean; playing: boolean }) {
  const parent = window.location.hostname || 'localhost';
  const src = `https://player.twitch.tv/?channel=${encodeURIComponent(channel)}&parent=${parent}&muted=${muted}&autoplay=${playing}`;
  return (
    <iframe
      src={src}
      allowFullScreen
      frameBorder="0"
      className="absolute inset-0 w-full h-full"
      allow="autoplay; fullscreen"
    />
  );
}

interface VideoTileProps {
  tile: GridLayoutItem;
  isEditMode: boolean;
  isSoloed: boolean;
  isAnyTileSoloed: boolean;
  onRemove: (id: string) => void;
  onToggleMute: (id: string) => void;
  onToggleSolo: (id: string) => void;
}

const VideoTile = React.memo(function VideoTile({
  tile,
  isEditMode,
  isSoloed,
  isAnyTileSoloed,
  onRemove,
  onToggleMute,
  onToggleSolo,
}: VideoTileProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const tileCount = useGridStore((s) => s.tiles.length);
  const isPlaying = !isAnyTileSoloed || isSoloed;

  // ── Live metadata ──────────────────────────────────────────────────────
  const ytMeta = useYouTubeMetadata(tile.type === 'youtube' ? tile.url : '');
  const twitchMeta = useTwitchStream(tile.type === 'twitch' ? tile.url : '');
  const viewerCount: number | null =
    tile.type === 'youtube' ? (ytMeta?.viewerCount ?? null) :
    tile.type === 'twitch' ? (twitchMeta?.isLive ? twitchMeta.viewerCount : null) :
    null;
  const liveTitle =
    tile.type === 'youtube' ? (ytMeta?.title ?? tile.title) :
    tile.type === 'twitch' ? (twitchMeta?.title ?? tile.title) :
    tile.title;
  const isLive =
    (tile.type === 'youtube' && ytMeta?.isLive) ||
    (tile.type === 'twitch' && twitchMeta?.isLive === true);

  // Effective mute: solo logic overrides individual mute
  const effectiveMuted = tile.isMuted || (isAnyTileSoloed && !isSoloed);

  const handleError = useCallback(() => setHasError(true), []);
  const handleReady = useCallback(() => {
    setHasError(false);
    setIsReady(true);
  }, []);

  const sourceColor = getSourceColor(tile.type);
  const sourceLabel = getSourceLabel(tile.type);

  const showControls = isHovered || isSoloed;

  return (
    <div
      className="relative w-full h-full overflow-hidden rounded-lg bg-zinc-900 select-none"
      style={{
        boxShadow: isSoloed
          ? `0 0 0 2px ${sourceColor}, 0 0 20px ${sourceColor}40`
          : isHovered
          ? '0 0 0 1px rgba(255,255,255,0.15)'
          : '0 0 0 1px rgba(255,255,255,0.05)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowInfo(false);
      }}
    >
      {/* ── Video Player ── */}
      {!hasError ? (
        tile.type === 'twitch' ? (
          <TwitchEmbed
            channel={tile.url.match(/twitch\.tv\/([^/?#]+)/i)?.[1] ?? ''}
            muted={effectiveMuted}
            playing={isPlaying}
          />
        ) : (
        <ReactPlayer
          src={tile.url}
          width="100%"
          height="100%"
          playing={isPlaying}
          loop
          muted={effectiveMuted}
          controls={false}
          playsInline
          style={{ position: 'absolute', inset: 0, objectFit: 'cover' } as React.CSSProperties}
          config={tile.type === 'hls' && tileCount > 4 ? {
            file: { hlsOptions: { capLevelToPlayerSize: true, maxMaxBufferLength: 15, startLevel: 0 } }
          } : undefined}
          onReady={handleReady}
          onError={handleError}
        />
        )
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-zinc-900">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${sourceColor}20`, border: `1px solid ${sourceColor}60` }}
          >
            <span className="text-xl">⚠</span>
          </div>
          <p className="text-zinc-400 text-sm text-center px-4">
            Failed to load stream
          </p>
          <p className="text-zinc-600 text-xs text-center px-4 truncate max-w-full">
            {tile.url}
          </p>
          <button
            className="mt-1 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-500 transition-colors"
            onClick={() => { setHasError(false); setIsReady(false); }}
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Loading shimmer (before ready) ── */}
      {!isReady && !hasError && (
        <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full animate-bounce"
                style={{
                  backgroundColor: sourceColor,
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Top Bar: drag handle + title + source badge ── */}
      <div
        className={`absolute top-0 left-0 right-0 flex items-center gap-2 px-2 py-1.5 z-10 transition-opacity duration-150 ${
          showControls || isEditMode ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, transparent 100%)',
        }}
      >
        {/* Drag handle removed — drag is disabled */}

        <span className="text-white text-xs font-medium truncate flex-1 min-w-0">
          {liveTitle}
        </span>

        {/* Live badge + viewer count */}
        {isLive && (
          <span className="flex items-center gap-1 text-xs font-bold px-1.5 py-0.5 rounded flex-shrink-0 bg-red-600/80 text-white">
            ● LIVE
          </span>
        )}
        {viewerCount !== null && (
          <span className="flex items-center gap-1 text-xs text-zinc-300 flex-shrink-0">
            <Users className="w-3 h-3" />{viewerCount.toLocaleString()}
          </span>
        )}

        {/* Source type badge */}
        <span
          className="text-xs font-bold px-1.5 py-0.5 rounded flex-shrink-0"
          style={{
            color: sourceColor,
            backgroundColor: `${sourceColor}20`,
            border: `1px solid ${sourceColor}40`,
          }}
        >
          {sourceLabel}
        </span>

        {/* Delete button */}
        {isEditMode && (
          <button
            className="p-1 rounded-md text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(tile.id);
            }}
            title="Remove tile"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Bottom Bar: controls ── */}
      <div
        className={`absolute bottom-0 left-0 right-0 flex items-center justify-between px-2 py-1.5 z-10 transition-opacity duration-150 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
        }}
      >
        <div className="flex items-center gap-1">
          {/* Mute toggle */}
          <button
            className="p-1.5 rounded-md text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onToggleMute(tile.id);
            }}
            title={tile.isMuted ? 'Unmute' : 'Mute'}
          >
            {effectiveMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          {/* Solo toggle */}
          <button
            className={`p-1.5 rounded-md transition-colors ${
              isSoloed
                ? 'text-white bg-white/20 hover:bg-white/30'
                : 'text-zinc-300 hover:text-white hover:bg-white/10'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSolo(tile.id);
            }}
            title={isSoloed ? 'Un-solo' : 'Solo (mute others)'}
          >
            {isSoloed ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>

          {/* Info toggle */}
          <button
            className={`p-1.5 rounded-md transition-colors ${
              showInfo
                ? 'text-white bg-white/20'
                : 'text-zinc-300 hover:text-white hover:bg-white/10'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setShowInfo((v) => !v);
            }}
            title="Source info"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* ── Source Info Overlay ── */}
      {showInfo && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.85)' }}
          onClick={() => setShowInfo(false)}
        >
          <div
            className="rounded-xl p-5 max-w-xs w-full mx-3 text-sm space-y-3"
            style={{
              backgroundColor: 'rgba(24,24,27,0.95)',
              border: `1px solid ${sourceColor}40`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: sourceColor }}
              />
              <span
                className="font-bold text-base"
                style={{ color: sourceColor }}
              >
                {sourceLabel}
              </span>
            </div>
            <div>
              <p className="text-zinc-400 text-xs uppercase tracking-wider mb-1">Title</p>
              <p className="text-white font-medium">{liveTitle}</p>
            </div>
            <div>
              <p className="text-zinc-400 text-xs uppercase tracking-wider mb-1">Source URL</p>
              <p className="text-zinc-300 text-xs break-all font-mono leading-relaxed">
                {tile.url}
              </p>
            </div>
            <div className="flex gap-3 text-xs text-zinc-500">
              <span>Audio: {effectiveMuted ? 'Muted' : 'Active'}</span>
              {isLive && <span className="text-red-400 font-bold">● LIVE</span>}
              {viewerCount !== null && (
                <span className="flex items-center gap-1 text-zinc-400">
                  <Users className="w-3 h-3" />{viewerCount.toLocaleString()} viewers
                </span>
              )}
              {twitchMeta?.gameName && (
                <span className="text-zinc-400 truncate">{twitchMeta.gameName}</span>
              )}
              {isSoloed && (
                <span style={{ color: sourceColor }}>● Solo</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Mute indicator dot ── */}
      {effectiveMuted && !showControls && (
        <div className="absolute bottom-2 left-2 z-10">
          <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
        </div>
      )}
    </div>
  );
});

export default VideoTile;
