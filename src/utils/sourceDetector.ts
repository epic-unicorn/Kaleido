import type { SourceType } from '../types';

export function detectSourceType(url: string): SourceType {
  try {
    const lower = url.toLowerCase();
    if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'youtube';
    if (lower.includes('twitch.tv')) return 'twitch';
    if (lower.includes('.m3u8')) return 'hls';
    return 'file';
  } catch {
    return 'file';
  }
}

export function getSourceLabel(type: SourceType): string {
  const labels: Record<SourceType, string> = {
    youtube: 'YouTube',
    twitch: 'Twitch',
    hls: 'HLS',
    file: 'MP4',
    webcam: 'Webcam',
  };
  return labels[type] ?? 'Unknown';
}

export function getSourceColor(type: SourceType): string {
  const colors: Record<SourceType, string> = {
    youtube: '#FF0000',
    twitch: '#9146FF',
    hls: '#00D4FF',
    file: '#22c55e',
    webcam: '#f97316',
  };
  return colors[type] ?? '#6b7280';
}

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function getTitleFromUrl(url: string, type: SourceType): string {
  switch (type) {
    case 'youtube':
      return 'YouTube Stream';
    case 'twitch': {
      const m = url.match(/twitch\.tv\/([^/?#]+)/i);
      return m ? `${m[1]} — Twitch` : 'Twitch Stream';
    }
    case 'hls':
      return 'HLS Stream';
    default: {
      try {
        const u = new URL(url);
        const filename = u.pathname.split('/').pop();
        return filename && filename.length > 0 ? filename : 'Video';
      } catch {
        return 'Video';
      }
    }
  }
}
