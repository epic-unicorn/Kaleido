import { useState } from 'react';
import { Volume2, VolumeX, Plus, Wifi, Zap } from 'lucide-react';
import { useGridStore } from '../store/useGridStore';

interface MasterControlProps {
  onAddStream: () => void;
  hypeEnabled: boolean;
  onToggleHype: () => void;
}

export default function MasterControl({ onAddStream, hypeEnabled, onToggleHype }: MasterControlProps) {
  const tiles = useGridStore((s) => s.tiles);
  const soloTileId = useGridStore((s) => s.soloTileId);
  const muteAll = useGridStore((s) => s.muteAll);
  const unmuteAll = useGridStore((s) => s.unmuteAll);

  const totalStreams = tiles.length;
  const mutedCount = tiles.filter((t) => t.isMuted).length;
  const allMuted = totalStreams > 0 && mutedCount === totalStreams;

  return (
    <header className="h-12 flex-shrink-0 flex items-center gap-3 px-4 bg-zinc-950 border-b border-zinc-800">
      {/* Stream status indicator */}
      <div className="flex items-center gap-2 mr-1">
        {totalStreams > 0 ? (
          <>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-zinc-400 text-xs font-medium">
              {totalStreams} live
            </span>
          </>
        ) : (
          <>
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
            <span className="text-zinc-600 text-xs">No streams</span>
          </>
        )}
        {soloTileId && (
          <span className="ml-1 text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-medium">
            SOLO
          </span>
        )}
      </div>

      {/* Separator */}
      <div className="w-px h-5 bg-zinc-800" />

      {/* Master Mute / Unmute */}
      <button
        disabled={totalStreams === 0}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white border border-zinc-700"
        onClick={muteAll}
        title="Mute all streams"
      >
        <VolumeX className="w-3.5 h-3.5" />
        Mute All
      </button>

      <button
        disabled={totalStreams === 0}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white border border-zinc-700"
        onClick={unmuteAll}
        title="Unmute all streams"
      >
        <Volume2 className="w-3.5 h-3.5" />
        Unmute All
      </button>

      {/* Separator */}
      <div className="w-px h-5 bg-zinc-800" />

      {/* Audio status summary */}
      {totalStreams > 0 && (
        <div className="flex items-center gap-1.5">
          <Wifi className="w-3.5 h-3.5 text-zinc-500" />
          <span className="text-zinc-500 text-xs">
            {allMuted
              ? 'All muted'
              : mutedCount > 0
              ? `${totalStreams - mutedCount} active · ${mutedCount} muted`
              : `${totalStreams} active`}
          </span>
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Hype Detection toggle */}
      <button
        disabled={totalStreams === 0}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed border ${
          hypeEnabled
            ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 hover:bg-amber-500/25'
            : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700 hover:text-white'
        }`}
        onClick={onToggleHype}
        title={hypeEnabled ? 'Hype Detection on — soloing most-viewed stream' : 'Enable Hype Detection'}
      >
        <Zap className="w-3.5 h-3.5" />
        Hype
        {hypeEnabled && <span className="ml-1 text-[10px] font-bold">ON</span>}
      </button>

      {/* Add Stream CTA */}
      <button
        className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors shadow-sm"
        onClick={onAddStream}
      >
        <Plus className="w-3.5 h-3.5" />
        Add Stream
      </button>
    </header>
  );
}
