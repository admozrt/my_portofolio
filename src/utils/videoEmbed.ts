/**
 * Mengubah URL video yang biasa disalin dari aplikasi (tombol "Bagikan" /
 * "Salin tautan") menjadi alamat iframe embed.
 *
 * Sengaja tanpa skrip resmi platform (widgets.js, embed.js, IFrame API):
 * iframe polos cukup untuk memutar, dan halaman tidak memuat skrip pihak
 * ketiga sebelum pengunjung menekan play.
 */

export type EmbedProvider = 'youtube' | 'instagram' | 'tiktok';

export interface Embed {
  provider: EmbedProvider;
  id: string;
  src: string;
  /** Video tegak 9:16 — Instagram, TikTok, dan YouTube Shorts. */
  vertical: boolean;
  /** Thumbnail yang bisa diambil tanpa API. Hanya YouTube yang menyediakan. */
  poster?: string;
}

const YT_ID = /^[\w-]{11}$/;

const parseUrl = (raw: string): URL | null => {
  try {
    return new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return null;
  }
};

export const parseEmbed = (raw?: string): Embed | null => {
  if (!raw || !raw.trim()) return null;
  const url = parseUrl(raw.trim());
  if (!url) return null;
  const host = url.hostname.replace(/^(www\.|m\.)/, '');
  const parts = url.pathname.split('/').filter(Boolean);

  if (host === 'youtu.be' || host === 'youtube.com' || host === 'youtube-nocookie.com') {
    let id: string | undefined;
    let vertical = false;
    if (host === 'youtu.be') id = parts[0];
    else if (parts[0] === 'watch') id = url.searchParams.get('v') ?? undefined;
    else if (parts[0] === 'shorts') {
      id = parts[1];
      vertical = true;
    } else if (parts[0] === 'embed' || parts[0] === 'live') id = parts[1];
    if (!id || !YT_ID.test(id)) return null;
    return {
      provider: 'youtube',
      id,
      vertical,
      // enablejsapi=1 supaya halaman bisa mengirim perintah seekTo lewat postMessage.
      src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0&enablejsapi=1`,
      poster: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    };
  }

  if (host === 'instagram.com') {
    const kind = parts[0] === 'reels' ? 'reel' : parts[0];
    const id = parts[1];
    if ((kind !== 'p' && kind !== 'reel') || !id) return null;
    return {
      provider: 'instagram',
      id,
      vertical: true,
      src: `https://www.instagram.com/${kind}/${id}/embed`,
    };
  }

  if (host === 'tiktok.com') {
    const i = parts.indexOf('video');
    const id = i >= 0 ? parts[i + 1] : undefined;
    if (!id || !/^\d+$/.test(id)) return null;
    return {
      provider: 'tiktok',
      id,
      vertical: true,
      src: `https://www.tiktok.com/player/v1/${id}?autoplay=1&rel=0&description=0`,
    };
  }

  return null;
};

/** Loncat ke detik tertentu di iframe YouTube yang dibuat dengan `enablejsapi=1`. */
export const seekYouTube = (iframe: HTMLIFrameElement | null, secs: number) => {
  const win = iframe?.contentWindow;
  if (!win) return;
  const send = (func: string, args: unknown[] = []) =>
    win.postMessage(JSON.stringify({ event: 'command', func, args }), '*');
  send('seekTo', [secs, true]);
  send('playVideo');
};
