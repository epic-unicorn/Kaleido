import React, { useState, useCallback } from 'react';
import ReactPlayer from 'react-player';
import {
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  X,
  GripVertical,
  Info,
} from 'lucide-react';
import type { GridLayoutItem } from '../types';
import { getSourceLabel, getSourceColor } from '../utils/sourceDetector';

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
        <ReactPlayer
          src={tile.url}
          width="100%"
          height="100%"
          playing
          loop
          muted={effectiveMuted}
          controls={false}
          playsInline
          style={{ position: 'absolute', inset: 0, objectFit: 'cover' } as React.CSSProperties}
          onReady={handleReady}
          onError={handleError}
        />
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
        {/* Drag handle — only visual target in edit mode */}
        {isEditMode && (
          <div className="drag-handle cursor-grab active:cursor-grabbing text-zinc-400 hover:text-white flex-shrink-0">
            <GripVertical className="w-4 h-4" />
          </div>
        )}

        <span className="text-white text-xs font-medium truncate flex-1 min-w-0">
          {tile.title}
        </span>

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

        {/* Delete button */}
        <button
          className="p-1.5 rounded-md text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(tile.id);
          }}
          title="Remove tile"
        >
          <X className="w-4 h-4" />
        </button>
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
              <p className="text-white font-medium">{tile.title}</p>
            </div>
            <div>
              <p className="text-zinc-400 text-xs uppercase tracking-wider mb-1">Source URL</p>
              <p className="text-zinc-300 text-xs break-all font-mono leading-relaxed">
                {tile.url}
              </p>
            </div>
            <div className="flex gap-3 text-xs text-zinc-500">
              <span>Audio: {effectiveMuted ? 'Muted' : 'Active'}</span>
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
