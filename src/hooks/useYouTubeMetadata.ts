import { useEffect, useState } from 'react';

export interface YouTubeMetadata {
  title: string;
  channelTitle: string;
  viewerCount: number | null; // null = not a live stream
  tags: string[];
  isLive: boolean;
}

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY as string | undefined;
const POLL_INTERVAL_MS = 30_000;

function extractVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1).split('?')[0];
    return u.searchParams.get('v');
  } catch {
    return null;
  }
}

async function fetchYouTubeMetadata(videoId: string): Promise<YouTubeMetadata | null> {
  if (!API_KEY) return null;
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,liveStreamingDetails,statistics&id=${encodeURIComponent(videoId)}&key=${API_KEY}`
  );
  if (!res.ok) return null;
  const data = await res.json();
  const item = data.items?.[0];
  if (!item) return null;
  const isLive = item.snippet?.liveBroadcastContent === 'live';
  return {
    title: item.snippet?.title ?? '',
    channelTitle: item.snippet?.channelTitle ?? '',
    viewerCount: isLive
      ? parseInt(item.liveStreamingDetails?.concurrentViewers ?? '0', 10) || null
      : parseInt(item.statistics?.viewCount ?? '0', 10) || null,
    tags: item.snippet?.tags ?? [],
    isLive,
  };
}

export function useYouTubeMetadata(url: string): YouTubeMetadata | null {
  const [meta, setMeta] = useState<YouTubeMetadata | null>(null);
  const videoId = extractVideoId(url);

  useEffect(() => {
    if (!videoId || !API_KEY) return;
    let cancelled = false;

    const load = async () => {
      const result = await fetchYouTubeMetadata(videoId);
      if (!cancelled) setMeta(result);
    };

    load();
    const timer = setInterval(load, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [videoId]);

  return meta;
}
