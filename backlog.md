# 🌈 Kaleido — High-Performance AI Entertainment Grid (MVP Plan)

## 📋 Projectoverzicht
Kaleido is een modern, fast video-grid voor het beheren van meerdere concurrent video streams. De focus verschuift in dit MVP van een passieve monitoring tool naar een **intelligente entertainment hub** die gebruikmaakt van React 19, metadata-AI en een flexibel 12-koloms gridsysteem.

---

## 🚀 Kernfunctionaliteiten (Bestaand + Geoptimaliseerd)

### 🎥 Multi-Source Video Engine
*   **YouTube & Twitch:** Integratie via officiële SDK's.
*   **Direct Streams:** Volledige ondersteuning voor HLS/DASH (m3u8/mpd) en MP4/WebM.
*   **AI Discovery:** Gebruikt de metadata van actieve streams om automatisch suggesties te doen voor lege vakken.

### 🎮 Grid & UX (12-Column System)
*   **Drag-and-Drop:** Sleep URL's direct in slots; de AI herkent de bron en configureert de juiste player.
*   **Resizable Layout:** 12-koloms gridsysteem dat reageert op `lg` (1200px) tot `xxs` (mobile).
*   **Solo View:** Directe focus op één stream met automatische achtergrond-optimalisatie (pauzeren van andere streams om CPU te sparen).
*   **Mute Controls:** Individuele toggles en een 'Global Mute/Solo' voor directe audio-controle.

### 🎛️ Smart Layout Presets
*   **Focus (1+4):** Eén grote 'Hero' stream ondersteund door 4 kleinere feeds.
*   **Security Wall (3×3):** Maximaal overzicht voor monitoring.
*   **Cinematic (2×2):** Esthetisch gebalanceerd grid voor watch-parties.
*   **AI-Auto-Preset:** De app stelt een layout voor op basis van het aantal geladen bronnen en hun aspect ratio.

---

## 🧠 AI-Integratie (MVP Scope)

In plaats van zware pixel-analyse, focust de MVP op **Metadata-gestuurde intelligentie**:

1.  **Contextual Auto-Fill:** Analyseert tags van je eerste video om de rest van de "Cinematic" of "Focus" grid-slots te vullen met gerelateerde content.
2.  **Hype-Detection:** Monitort live-metadata (zoals kijker-aantallen of chat-snelheid) om de 'Hero' stream automatisch te wisselen naar de meest actieve feed.
3.  **Vibe Matching:** Groepeert video's op basis van genre, sfeer of kleurenpalet (via metadata) voor een consistente kijkervaring.

---

## 🛠 Tech Stack (React 19 Geoptimaliseerd)

*   **Framework:** React 19 (gebruikmakend van `useOptimistic` voor layout-switches en `resource preloading` voor stream-SDK's).
*   **Styling:** Tailwind CSS (met Glassmorphism overlays en responsive breakpoints).
*   **State Management:** Zustand voor globale stream-states en layout-presets.
*   **Drag-and-Drop:** `@dnd-kit` voor de 12-koloms interactie.
*   **AI Logic:** YouTube Data API & Twitch Helix API voor realtime metadata-fetching.

---

## 📈 Roadmap naar V1

### Fase 1: Fundering (Huidig)
*   Stabiele 12-koloms grid-engine met drag-n-drop.
*   Ondersteuning voor YouTube, Twitch en HLS.

### Fase 2: AI & Discovery (MVP Focus)
*   Integratie van de `useSmartDiscovery` hook voor auto-aanbevelingen.
*   Implementatie van de "Global Mute" en "Hero Swap" logica op basis van activiteit.

### Fase 3: Performance & Polish
*   Resource-prefetching van video-SDK's via React 19.
*   Toevoegen van dynamische Tailwind-thema's die meekleuren met de hoofdvideo.

---

## ⚖️ Juridische & Technische Randvoorwaarden
*   **CORS/Embeds:** Gebruik van officiële iframes voor YouTube/Twitch om compliant te blijven.
*   **Domain Whitelisting:** Vereist voor productie-omgevingen van Twitch-embeds.
*   **Bandbreedte:** Dynamische kwaliteitsaanpassing (indien ondersteund door bron) bij multi-stream rendering.
