import { useCallback, useEffect, useRef, useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import type { Layout as RGLLayout } from 'react-grid-layout/legacy';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { PlusCircle } from 'lucide-react';
import { useGridStore } from '../store/useGridStore';
import VideoTile from './VideoTile';
import { isValidUrl } from '../utils/sourceDetector';

const ResponsiveGridLayout = WidthProvider(Responsive);

const COLS = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };
const BREAKPOINTS = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
const MARGIN_Y = 6;
const PADDING_Y = 8;

interface GridCanvasProps {
  onAddStreamRequest: () => void;
}

export default function GridCanvas({ onAddStreamRequest }: GridCanvasProps) {
  const tiles = useGridStore((s) => s.tiles);
  const isEditMode = useGridStore((s) => s.isEditMode);
  const soloTileId = useGridStore((s) => s.soloTileId);
  const updateLayout = useGridStore((s) => s.updateLayout);
  const removeTile = useGridStore((s) => s.removeTile);
  const toggleMute = useGridStore((s) => s.toggleMute);
  const toggleSolo = useGridStore((s) => s.toggleSolo);
  const addTile = useGridStore((s) => s.addTile);

  const [isDragOver, setIsDragOver] = useState(false);
  const [containerHeight, setContainerHeight] = useState(600);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerHeight(entry.contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const maxRows = tiles.length > 0 ? Math.max(...tiles.map((t) => t.y + t.h)) : 6;
  const rowHeight = Math.max(
    1,
    (containerHeight - PADDING_Y * 2 - MARGIN_Y * (maxRows - 1)) / maxRows
  );

  // ── react-grid-layout layout sync ──────────────────────────────────────
  const layouts = {
    lg: tiles.map((t) => ({
      i: t.id,
      x: t.x,
      y: t.y,
      w: t.w,
      h: t.h,
      minW: t.minW ?? 2,
      minH: t.minH ?? 2,
    })),
  };

  const onLayoutChange = useCallback(
    (currentLayout: RGLLayout) => {
      updateLayout(
        currentLayout.map((item) => ({
          i: item.i,
          x: item.x,
          y: item.y,
          w: item.w,
          h: item.h,
        }))
      );
    },
    [updateLayout]
  );

  // ── External drag-and-drop from browser tabs ───────────────────────────
  const calcDropPosition = useCallback(
    (e: React.DragEvent): { col: number; row: number } => {
      if (!containerRef.current) return { col: 0, row: 0 };
      const rect = containerRef.current.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;
      const colWidth = rect.width / 12;
      const col = Math.max(0, Math.min(11, Math.floor(relX / colWidth)));
      const row = Math.max(0, Math.min(maxRows - 2, Math.floor(relY / rowHeight)));
      return { col, row };
    },
    [rowHeight, maxRows]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    // Only accept drags that contain URLs
    const types = Array.from(e.dataTransfer.types);
    if (types.includes('text/uri-list') || types.includes('text/plain')) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const rawUrl =
        e.dataTransfer.getData('text/uri-list') ||
        e.dataTransfer.getData('text/plain');

      // text/uri-list can contain multiple URLs separated by newlines; take first valid one
      const url = rawUrl
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter((s) => !s.startsWith('#') && isValidUrl(s))[0];

      if (!url) return;

      const { col, row } = calcDropPosition(e);
      addTile(url, col, row);
    },
    [addTile, calcDropPosition]
  );

  // ── Render ─────────────────────────────────────────────────────────────
  const isEmpty = tiles.length === 0;

  return (
    <div
      ref={containerRef}
      className="relative flex-1 overflow-hidden"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drop zone overlay */}
      {isDragOver && (
        <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
          <div className="absolute inset-0 border-2 border-dashed border-indigo-400 rounded-lg bg-indigo-500/10" />
          <div className="relative bg-zinc-900/90 rounded-xl px-6 py-4 flex items-center gap-3 shadow-2xl border border-indigo-400/40">
            <PlusCircle className="w-6 h-6 text-indigo-400" />
            <span className="text-white font-semibold text-lg">Drop URL to add stream</span>
          </div>
        </div>
      )}

      {/* Empty state */}
      {isEmpty && !isDragOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-center px-8">
          <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-zinc-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-300 mb-2">No streams yet</h2>
            <p className="text-zinc-500 max-w-sm">
              Add a stream by clicking{' '}
              <button
                className="text-indigo-400 hover:underline font-medium"
                onClick={onAddStreamRequest}
              >
                Add Stream
              </button>
              , using a preset from the sidebar, seeding samples, or by{' '}
              <span className="text-zinc-400">dragging a URL from another tab</span>{' '}
              directly into this area.
            </p>
          </div>
        </div>
      )}

      {/* Grid */}
      {!isEmpty && (
        <ResponsiveGridLayout
          className="kaleido-grid"
          layouts={layouts}
          cols={COLS}
          rowHeight={rowHeight}
          breakpoints={BREAKPOINTS}
          isDraggable={false}
          isResizable={isEditMode}
          margin={[6, 6]}
          containerPadding={[8, 8]}
          onLayoutChange={onLayoutChange}
          useCSSTransforms
          compactType="vertical"
          preventCollision={false}
          resizeHandles={['se', 'sw', 'ne', 'nw']}
        >
          {tiles.map((tile) => (
            <div key={tile.id} className="rounded-lg">
              <VideoTile
                tile={tile}
                isEditMode={isEditMode}
                isSoloed={soloTileId === tile.id}
                isAnyTileSoloed={soloTileId !== null}
                onRemove={removeTile}
                onToggleMute={toggleMute}
                onToggleSolo={toggleSolo}
              />
            </div>
          ))}
        </ResponsiveGridLayout>
      )}

      {/* Solo overlay */}
      {soloTileId && (
        <div className="absolute inset-0 z-40 bg-black/80 flex items-center justify-center p-3">
          <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-black">
            {tiles.map((tile) =>
              tile.id === soloTileId ? (
                <div key={tile.id} className="w-full h-full">
                  <VideoTile
                    tile={tile}
                    isEditMode={false}
                    isSoloed={true}
                    isAnyTileSoloed={true}
                    onRemove={removeTile}
                    onToggleMute={toggleMute}
                    onToggleSolo={toggleSolo}
                  />
                </div>
              ) : null
            )}
          </div>
        </div>
      )}
    </div>
  );
}
