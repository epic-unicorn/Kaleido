# Kaleido — High-Performance React Video Grid

A modern, fast video grid application for managing multiple concurrent video streams with drag-and-drop layout control, built with React 19, TypeScript, and Tailwind CSS.

![Kaleido](https://img.shields.io/badge/React-19-blue?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-blueviolet?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

> ⚡ **Note**: This project is completely vibe coded. It was built fast, intuitively, and without rigid planning. Works great, looks great, *chef's kiss*.

## ✨ Features

### 🎥 Multi-Source Video Support
- **YouTube** — Stream any public YouTube video
- **Twitch** — Embed live streams (domain whitelisting required for production)
- **HLS/DASH** — Direct HLS and DASH stream URLs (Cloudinary, custom live streams, etc.)
- **MP4/WebM** — Local or remote video files

### 🎮 Intuitive Controls
- **Drag & Drop** — Add streams by dragging URLs directly from browser tabs
- **Resizable Grid** — Click Edit Mode to drag-resize tiles in a 12-column responsive layout
- **Solo View** — Click Maximize on any tile to enlarge it in an overlay while keeping others visible
- **Mute Controls** — Mute individual streams or all at once
- **Responsive Design** — Automatically adapts to lg (1200px), md (996px), sm (768px), xs (480px), xxs (mobile)

### 🎛️ Smart Layout Presets
- **Focus** — 1 large + 4 small tiles for featured + supporting streams
- **Security Wall** — 3×3 grid for monitoring dashboards
- **Cinematic** — 2×2 symmetrical layout for aesthetics

### 🎨 UI Polish
- **Collapsible Sidebar** — Smooth toggle between icon rail (56px) and full panel (224px)
- **Always-On Header** — Top bar displays stream count, global mute controls, and quick-add button
- **Dark Theme** — Zinc/slate color scheme optimized for long viewing sessions
- **Smooth Animations** — CSS transitions on all interactions

### ⚙️ Developer-Friendly
- **Zustand State Management** — Simple, single-store architecture for grid state
- **React.memo Optimization** — Per-tile component optimization to prevent unnecessary re-renders
- **TypeScript** — Full type safety across the entire codebase
- **Edit Mode** — Toggle grid editing to lock/unlock drag-resize interactions

---

## 🚀 Quick Start

### Installation

```bash
# Navigate to the project directory
cd Kaleido

# Install dependencies
npm install --legacy-peer-deps

# Start the dev server
npm run dev
```

The app will be available at **http://localhost:5173/**.

### Adding Streams

**Option 1: Drag & Drop**
- Drag a video URL from your browser tab directly into the grid
- Kaleido automatically detects the source type (YouTube, Twitch, HLS, etc.)

**Option 2: Add Stream Button**
- Click the **Add Stream** button in the top right
- Paste a video URL and click Add
- Quick-start examples are provided in the modal

**Option 3: Sidebar Presets**
- Click a layout preset (Focus, Security Wall, Cinematic) to auto-populate sample videos

**Option 4: Dev Tools**
- Click **Seed Samples** in the sidebar footer to populate 4 test streams

### Using Solo Mode

1. Hover over a video tile to reveal the overlay controls
2. Click the **Maximize2** icon (solo button)
3. The video enlarges in a centered overlay while others fade in the background
4. Click the **Minimize2** icon (or solo a different video) to close the overlay

### Edit Mode

1. Click the **Edit** toggle in the sidebar
2. Tiles become draggable (use the `::` grip handle) and resizable (corner handles)
3. Drag tiles to reposition and corner-drag to resize
4. Click **Edit** again to lock the layout

---

## 📁 Project Structure

```
Kaleido/
├── src/
│   ├── components/
│   │   ├── VideoTile.tsx          # Individual video player tile with controls
│   │   ├── GridCanvas.tsx         # Responsive grid layout container
│   │   ├── Sidebar.tsx            # Collapsible left navigation
│   │   ├── MasterControl.tsx      # Top header bar (stream count, global controls)
│   │   └── AddStreamModal.tsx     # URL input modal with source detection
│   ├── store/
│   │   └── useGridStore.ts        # Zustand store (state + actions)
│   ├── utils/
│   │   ├── sourceDetector.ts      # URL validation and source type detection
│   │   └── presets.ts            # Layout preset definitions
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   ├── App.tsx                    # Root layout
│   ├── index.css                  # Tailwind + custom grid styles
│   └── main.tsx                   # Entry point
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | React | 19 |
| **Language** | TypeScript | 5.9 |
| **Build Tool** | Vite | 8 |
| **Styling** | Tailwind CSS | 3 |
| **Grid Layout** | react-grid-layout | 1.5 (legacy API) |
| **Video Player** | react-player | 2 |
| **State** | Zustand | 5 |
| **Icons** | lucide-react | Latest |

### Key Dependencies

```json
{
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "react-grid-layout": "^1.5.0",
  "react-player": "^2.0.0",
  "zustand": "^5.0.0",
  "tailwindcss": "^3.0.0",
  "lucide-react": "^latest"
}
```

---

## 📝 Available Scripts

```bash
# Start development server (HMR enabled)
npm run dev

# Type check
npm run type-check

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 🎯 Core Concepts

### Tiles & Layout System

Each stream is a **tile** with:
- Unique ID for tracking
- URL and detected source type
- Grid position (x, y) and size (w, h)
- Mute state
- Solo state (part of `soloTileId` in store)

The **ResponsiveGridLayout** (from react-grid-layout) manages 12 columns and automatic row sizing:
- Default row height: 80px
- Margin between tiles: 6px
- Responsive breakpoints for mobile/tablet/desktop

### State Management (Zustand)

Single store (`useGridStore`) with:
- **State**: `tiles[]`, `isEditMode`, `soloTileId`, `activePreset`
- **Actions**: `addTile()`, `removeTile()`, `updateLayout()`, `toggleMute()`, `toggleSolo()`, `loadPreset()`, `seedSamples()`, `clearAll()`

Access in components:
```typescript
const tiles = useGridStore((s) => s.tiles);
const toggleSolo = useGridStore((s) => s.toggleSolo);
```

### Source Detection

The `sourceDetector.ts` utility:
- Regex-matches URLs to determine source type (YouTube, Twitch, HLS, file, etc.)
- Generates appropriate titles from platform URLs
- Returns color badges for visual source identification

```typescript
const type = detectSourceType('https://youtube.com/watch?v=...');
// Returns: 'youtube'
```

### Audio Muting Logic

Tiles respect a hierarchy:
```typescript
const effectiveMuted = tile.isMuted || (isAnyTileSoloed && !isSoloed);
```

When a tile is soloed:
- All other tiles are audio-muted (even if their `isMuted` flag is false)
- The soloed tile remains unmuted (unless it has `isMuted: true`)
- Other tiles visual state shows muted icon but no input error

---

## 🎨 Styling Highlights

### Custom Grid Styles (index.css)
- React-grid-layout resize handles with visual feedback
- Dragging preview with semi-transparent overlay
- Custom scrollbar styling (zinc/slate theme)
- Smooth transitions on all interactive elements

### Tailwind Customization
- Dark background (`bg-zinc-900`, `bg-black`)
- Accent colors (indigo for buttons/hover states)
- Responsive spacing and padding
- Smooth web-safe transitions (`transition-colors`, `transition-all`)

---

## 🧪 Development Tips

### Debugging

**Check Types:**
```bash
npm run type-check
```

**View Store State:**
Add logging in components:
```typescript
useEffect(() => {
  console.log('Solo tile:', soloTileId);
  console.log('All tiles:', tiles);
}, [soloTileId, tiles]);
```

**React DevTools:**
Install React DevTools browser extension to inspect component props and Zustand store state.

### Adding a New Source Type

1. Update `SourceType` in `src/types/index.ts`
2. Add regex pattern to `detectSourceType()` in `src/utils/sourceDetector.ts`
3. Add color/label mappings in `getSourceColor()` and `getSourceLabel()`
4. Test with sample URL in the modal

### Customizing Layout Presets

Edit `src/utils/presets.ts`:
```typescript
export const PRESETS: Record<PresetName, GridLayoutItem[]> = {
  MyCustom: [
    { id: '1', url: '...', type: 'youtube', x: 0, y: 0, w: 6, h: 3, minW: 2, minH: 2 },
    // ... more tiles
  ],
};
```

Then reference in sidebar or load via `loadPreset('MyCustom')`.

---

## 🌐 Browser Compatibility

- **Chrome/Edge** — Full support
- **Firefox** — Full support
- **Safari** — Full support (iOS 14+)
- **Mobile** — Responsive, touch-friendly (drag-drop via file share)

### Known Limitations

- **Twitch embeds** — Require domain whitelisting; won't work on `localhost` by default
- **CORS** — Some HLS streams may require CORS proxy for browser playback

---

## 🤝 Contributing

Contributions are welcome! To add a feature:

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes following the existing code style
3. Run type-check: `npm run type-check`
4. Test in dev server: `npm run dev`
5. Commit and push: `git push origin feature/my-feature`

---

## 📄 License

MIT © 2026

---

## 🎬 Sample Streams for Testing

Kaleido comes with 4 pre-configured sample streams:

1. **Cloudinary Live HLS** — Professional HLS stream test
2. **LoFi Radio** — YouTube lofi hip-hop beats (perfect for monitoring)
3. **Big Buck Bunny MP4** — Classic test video
4. **LoFi Girl YouTube** — Calm ambient stream

Access via **Seed Samples** button in sidebar, or manually add any public YouTube, Twitch, or HLS URL.

---

## 🚀 Roadmap

- [ ] Webcam/screen-share capture
- [ ] Stream recording (server-side)
- [ ] Custom theme builder
- [ ] Layout persistence (localStorage)
- [ ] Keyboard shortcuts
- [ ] Stream analytics overlay

---

## 📞 Support

For issues, feature requests, or questions:
- Check existing documentation in this README
- Review source code comments for implementation details
- Open an issue with reproducible steps

---

**Happy streaming! 🎥**
```
