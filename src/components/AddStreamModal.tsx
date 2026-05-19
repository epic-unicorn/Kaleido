import { useState, useRef, useEffect } from 'react';
import { X, Link, Plus, AlertCircle } from 'lucide-react';
import { useGridStore } from '../store/useGridStore';
import { isValidUrl, getSourceLabel, getSourceColor, detectSourceType } from '../utils/sourceDetector';

interface AddStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_EXAMPLES = [
  {
    label: 'HLS test stream (Cloudflare)',
    url: 'https://customercontenttest.cloudinary.com/video/upload/sp_hd/v1693925393/samples/sea-turtle.m3u8',
  },
  {
    label: 'Big Buck Bunny (MP4)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
  {
    label: 'LoFi Hip Hop Radio (YouTube)',
    url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
  },
  {
    label: 'Twitch channel (replace name)',
    url: 'https://www.twitch.tv/twitchdev',
  },
];

export default function AddStreamModal({ isOpen, onClose }: AddStreamModalProps) {
  const addTile = useGridStore((s) => s.addTile);
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setUrl('');
      setError('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) {
      setError('Please enter a URL.');
      return;
    }
    if (!isValidUrl(trimmed)) {
      setError('That doesn\'t look like a valid URL. Must start with http:// or https://');
      return;
    }
    addTile(trimmed);
    onClose();
  };

  const handleQuickAdd = (exampleUrl: string) => {
    addTile(exampleUrl);
    onClose();
  };

  const detectedType = url.trim() && isValidUrl(url.trim())
    ? detectSourceType(url.trim())
    : null;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <Plus className="w-4 h-4 text-indigo-400" />
            </div>
            <h2 className="text-white font-semibold">Add Stream</h2>
          </div>
          <button
            className="p-1.5 text-zinc-500 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-zinc-400 text-xs font-medium mb-2 uppercase tracking-wider">
              Stream URL
            </label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                ref={inputRef}
                type="text"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-colors"
                placeholder="https://..."
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError('');
                }}
                spellCheck={false}
                autoComplete="off"
              />
              {/* Live source type preview */}
              {detectedType && (
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold px-1.5 py-0.5 rounded"
                  style={{
                    color: getSourceColor(detectedType),
                    backgroundColor: `${getSourceColor(detectedType)}20`,
                    border: `1px solid ${getSourceColor(detectedType)}40`,
                  }}
                >
                  {getSourceLabel(detectedType)}
                </span>
              )}
            </div>
            {error && (
              <p className="flex items-center gap-1.5 text-red-400 text-xs mt-2">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {error}
              </p>
            )}
            <p className="text-zinc-600 text-xs mt-2">
              Supports YouTube, Twitch, HLS (.m3u8), and direct MP4 links.
              New stream starts muted (browser autoplay policy).
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors"
          >
            Add to Grid
          </button>
        </form>

        {/* Quick examples */}
        <div className="px-6 pb-5">
          <p className="text-zinc-600 text-xs font-medium uppercase tracking-wider mb-3">
            Quick examples
          </p>
          <div className="space-y-1.5">
            {QUICK_EXAMPLES.map((ex) => (
              <button
                key={ex.url}
                className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/50 hover:border-zinc-600 transition-colors group"
                onClick={() => handleQuickAdd(ex.url)}
              >
                <span className="text-zinc-300 text-xs font-medium group-hover:text-white transition-colors">
                  {ex.label}
                </span>
                <Plus className="w-3.5 h-3.5 text-zinc-600 group-hover:text-indigo-400 flex-shrink-0 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
