import { useEffect, useState } from 'react';

export interface TwitchStreamMetadata {
  title: string;
  gameName: string;
  viewerCount: number;
  isLive: boolean;
  thumbnailUrl: string | null;
}

const CLIENT_ID = import.meta.env.VITE_TWITCH_CLIENT_ID as string | undefined;
const ACCESS_TOKEN = import.meta.env.VITE_TWITCH_ACCESS_TOKEN as string | undefined;
const POLL_INTERVAL_MS = 30_000;

function extractChannel(url: string): string | null {
  const m = url.match(/twitch\.tv\/([^/?#]+)/i);
  return m?.[1] ?? null;
}

async function fetchTwitchStream(channelName: string): Promise<TwitchStreamMetadata | null> {
  if (!CLIENT_ID || !ACCESS_TOKEN) return null;
  const [streamRes, gameCache] = await Promise.all([
    fetch(
      `https://api.twitch.tv/helix/streams?user_login=${encodeURIComponent(channelName)}`,
      { headers: { 'Client-ID': CLIENT_ID, Authorization: `Bearer ${ACCESS_TOKEN}` } }
    ),
    Promise.resolve(new Map<string, string>()),
  ]);
  if (!streamRes.ok) return null;
  const streamData = await streamRes.json();
  const stream = streamData.data?.[0];
  if (!stream) {
    return { title: channelName, gameName: '', viewerCount: 0, isLive: false, thumbnailUrl: null };
  }

  let gameName = '';
  if (stream.game_id) {
    const cached = gameCache.get(stream.game_id);
    if (cached) {
      gameName = cached;
    } else {
      const gRes = await fetch(
        `https://api.twitch.tv/helix/games?id=${encodeURIComponent(stream.game_id)}`,
        { headers: { 'Client-ID': CLIENT_ID, Authorization: `Bearer ${ACCESS_TOKEN}` } }
      );
      if (gRes.ok) {
        const gData = await gRes.json();
        gameName = gData.data?.[0]?.name ?? '';
      }
    }
  }

  const thumb = stream.thumbnail_url
    ? stream.thumbnail_url.replace('{width}', '320').replace('{height}', '180')
    : null;

  return {
    title: stream.title ?? channelName,
    gameName,
    viewerCount: stream.viewer_count ?? 0,
    isLive: true,
    thumbnailUrl: thumb,
  };
}

export function useTwitchStream(url: string): TwitchStreamMetadata | null {
  const [meta, setMeta] = useState<TwitchStreamMetadata | null>(null);
  const channel = extractChannel(url);

  useEffect(() => {
    if (!channel || !CLIENT_ID || !ACCESS_TOKEN) return;
    let cancelled = false;

    const load = async () => {
      const result = await fetchTwitchStream(channel);
      if (!cancelled) setMeta(result);
    };

    load();
    const timer = setInterval(load, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [channel]);

  return meta;
}
