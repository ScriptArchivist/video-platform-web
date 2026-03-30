export function createIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `live-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function proxyOriginUrl(url?: string | null): string | null {
  if (!url) {
    return null;
  }

  if (url.startsWith('/origin/')) {
    return url;
  }

  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname.startsWith('/')
      ? parsed.pathname
      : `/${parsed.pathname}`;

    return `/origin${pathname}${parsed.search}`;
  } catch {
    if (url.startsWith('/')) {
      return `/origin${url}`;
    }

    return url;
  }
}

export function buildLiveOriginHlsUrl(streamKey?: string | null): string | null {
  if (!streamKey) {
    return null;
  }

  return `/origin/live/${streamKey}/master.m3u8`;
}

export function resolveLiveHlsUrl(
  session: {
    hls_url?: string | null;
    thumbnail_url?: string | null;
  } | null | undefined,
  streamKey?: string | null,
): string | null {
  if (session?.hls_url) {
    return proxyOriginUrl(session.hls_url);
  }

  if (session?.thumbnail_url && session.thumbnail_url.endsWith('/thumb.jpg')) {
    return proxyOriginUrl(
      session.thumbnail_url.replace(/\/thumb\.jpg$/, '/master.m3u8'),
    );
  }

  return buildLiveOriginHlsUrl(streamKey);
}