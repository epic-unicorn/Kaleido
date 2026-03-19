import React, { useState } from 'react';
import {
  LayoutTemplate,
  Shield,
  Film,
  FlaskConical,
  Trash2,
  Lock,
  Unlock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useGridStore } from '../store/useGridStore';
import { PRESETS } from '../utils/presets';
import type { PresetName } from '../utils/presets';

const PRESET_ICONS: Record<PresetName, React.ReactNode> = {
  focus: <LayoutTemplate className="w-4 h-4" />,
  'security-wall': <Shield className="w-4 h-4" />,
  cinematic: <Film className="w-4 h-4" />,
};

export default function Sidebar() {
  const isEditMode = useGridStore((s) => s.isEditMode);
  const activePreset = useGridStore((s) => s.activePreset);
  const tileCount = useGridStore((s) => s.tiles.length);
  const toggleEditMode = useGridStore((s) => s.toggleEditMode);
  const loadPreset = useGridStore((s) => s.loadPreset);
  const seedSamples = useGridStore((s) => s.seedSamples);
  const clearAll = useGridStore((s) => s.clearAll);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="flex-shrink-0 flex flex-col bg-zinc-900 border-r border-zinc-800 h-screen overflow-y-auto overflow-x-hidden transition-[width] duration-300 ease-in-out"
      style={{ width: collapsed ? '56px' : '224px' }}
    >
      {/* ── Brand ── */}
      <div className={`border-b border-zinc-800 flex items-center ${collapsed ? 'justify-center py-4 px-0' : 'px-5 py-5'}`}>
        {collapsed ? (
          <button
            onClick={() => setCollapsed(false)}
            className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0"
            title="Expand sidebar"
          >
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 0L10.2 5.8H16L11.4 9.4L13.1 15.2L8 11.9L2.9 15.2L4.6 9.4L0 5.8H5.8L8 0Z" />
            </svg>
          </button>
        ) : (
          <div className="flex items-center gap-2.5 w-full">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0L10.2 5.8H16L11.4 9.4L13.1 15.2L8 11.9L2.9 15.2L4.6 9.4L0 5.8H5.8L8 0Z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-white font-bold text-base leading-none tracking-wide">Kaleido</h1>
              <p className="text-zinc-500 text-xs mt-0.5">Video Grid</p>
            </div>
            <button
              onClick={() => setCollapsed(true)}
              className="p-1 rounded-md text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors flex-shrink-0"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* ── Edit Mode Toggle ── */}
      <div className={`border-b border-zinc-800 ${collapsed ? 'py-3 flex justify-center' : 'px-4 py-3'}`}>
        {collapsed ? (
          <button
            onClick={toggleEditMode}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
              isEditMode
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
            }`}
            title={isEditMode ? 'Edit Mode (click to lock)' : 'View Mode (click to unlock)'}
          >
            {isEditMode ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          </button>
        ) : (
          <button
            className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isEditMode
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25'
                : 'bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700'
            }`}
            onClick={toggleEditMode}
          >
            <span className="flex items-center gap-2">
              {isEditMode ? (
                <Unlock className="w-4 h-4" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              {isEditMode ? 'Edit Mode' : 'View Mode'}
            </span>
            <div
              className={`w-8 h-[18px] rounded-full transition-colors relative ${
                isEditMode ? 'bg-amber-500' : 'bg-zinc-600'
              }`}
            >
              <div
                className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full shadow transition-transform ${
                  isEditMode ? 'translate-x-[18px]' : 'translate-x-0.5'
                }`}
              />
            </div>
          </button>
        )}
      </div>

      {/* ── Presets ── */}
      <div className={`border-b border-zinc-800 ${collapsed ? 'py-3 flex flex-col items-center gap-1.5' : 'px-4 py-4'}`}>
        {!collapsed && (
          <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-3">
            Layout Presets
          </p>
        )}
        {collapsed ? (
          PRESETS.map((preset) => {
            const isActive = activePreset === preset.id;
            const canApply = tileCount > 0;
            return (
              <button
                key={preset.id}
                disabled={!canApply}
                onClick={() => loadPreset(preset.id)}
                title={preset.label}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                  isActive
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    : 'bg-zinc-800/60 text-zinc-400 border border-transparent hover:bg-zinc-700 hover:text-white'
                }`}
              >
                {PRESET_ICONS[preset.id]}
              </button>
            );
          })
        ) : (
          <div className="space-y-1.5">
          {PRESETS.map((preset) => {
            const isActive = activePreset === preset.id;
            const canApply = tileCount > 0;
            return (
              <button
                key={preset.id}
                disabled={!canApply}
                className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                  isActive
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    : 'bg-zinc-800/60 text-zinc-300 border border-transparent hover:bg-zinc-700/80 hover:border-zinc-600'
                }`}
                onClick={() => loadPreset(preset.id)}
                title={canApply ? `Apply ${preset.label} layout` : 'Add streams first'}
              >
                <span className={`mt-0.5 flex-shrink-0 ${isActive ? 'text-indigo-400' : 'text-zinc-500'}`}>
                  {PRESET_ICONS[preset.id]}
                </span>
                <span>
                  <span className="block text-sm font-medium leading-tight">{preset.label}</span>
                  <span className="block text-xs text-zinc-500 mt-0.5">{preset.description}</span>
                </span>
              </button>
            );
          })}
          </div>
        )}
        {!collapsed && tileCount === 0 && (
          <p className="text-xs text-zinc-600 mt-2 text-center">Add streams to use presets</p>
        )}
      </div>

      {/* ── Developer Tools ── */}
      <div className={`border-b border-zinc-800 ${collapsed ? 'py-3 flex justify-center' : 'px-4 py-4'}`}>
        {!collapsed && (
          <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-3">
            Developer Tools
          </p>
        )}
        <button
          className={`flex items-center gap-2.5 rounded-lg bg-zinc-800/60 text-zinc-300 hover:bg-emerald-500/15 hover:text-emerald-300 border border-transparent text-sm font-medium transition-colors ${
            collapsed ? 'w-9 h-9 justify-center' : 'w-full px-3 py-2.5'
          }`}
          onClick={seedSamples}
          title="Seed sample streams"
        >
          <FlaskConical className="w-4 h-4 flex-shrink-0" />
          {!collapsed && (
            <>
              Seed Samples
              <span className="ml-auto text-xs text-zinc-600">×4</span>
            </>
          )}
        </button>
      </div>

      {/* ── Spacer ── */}
      <div className="flex-1" />

      {/* ── Stream Count + Clear ── */}
      <div className={`border-t border-zinc-800 ${collapsed ? 'py-3 flex flex-col items-center gap-2' : 'px-4 py-4'}`}>
        {collapsed ? (
          <>
            <span className="text-zinc-500 text-xs font-bold">{tileCount}</span>
            {tileCount > 0 && (
              <button
                onClick={clearAll}
                title="Clear all streams"
                className="w-8 h-8 flex items-center justify-center rounded-md text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => setCollapsed(false)}
              className="w-8 h-8 flex items-center justify-center rounded-md text-zinc-600 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <span className="text-zinc-500 text-xs">
                {tileCount} stream{tileCount !== 1 ? 's' : ''}
              </span>
              {tileCount > 0 && (
                <button
                  className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-red-400 transition-colors"
                  onClick={clearAll}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear all
                </button>
              )}
            </div>
            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (tileCount / 9) * 100)}%` }}
              />
            </div>
            <p className="text-zinc-700 text-xs mt-2">Max recommended: 9</p>
          </>
        )}
      </div>
    </aside>
  );
}
