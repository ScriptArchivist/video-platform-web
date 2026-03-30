'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Hls from 'hls.js';

interface LivePlayerPanelProps {
  src: string;
}

function withCacheBuster(src: string, token: number) {
  try {
    const url = new URL(src, window.location.origin);
    url.searchParams.set('_live', String(token));
    return url.toString();
  } catch {
    const separator = src.includes('?') ? '&' : '?';
    return `${src}${separator}_live=${token}`;
  }
}

export function LivePlayerPanel({ src }: LivePlayerPanelProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const retryTimerRef = useRef<number | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  const resolvedSrc = useMemo(
    () => withCacheBuster(src, reloadToken),
    [src, reloadToken],
  );

  useEffect(() => {
    return () => {
      if (retryTimerRef.current !== null) {
        window.clearTimeout(retryTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !resolvedSrc) {
      return;
    }

    let isDisposed = false;

    const clearRetryTimer = () => {
      if (retryTimerRef.current !== null) {
        window.clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    };

    const scheduleReload = (delay = 2000) => {
      if (isDisposed) return;
      if (retryTimerRef.current !== null) return;

      retryTimerRef.current = window.setTimeout(() => {
        retryTimerRef.current = null;
        if (!isDisposed) {
          setReloadToken((value) => value + 1);
        }
      }, delay);
    };

    const markReady = async () => {
      if (isDisposed) return;

      setIsVideoReady(true);
      setPlaybackError(null);
      clearRetryTimer();

      try {
        await video.play();
      } catch {}
    };

    const markWaiting = (message = 'Waiting for live stream...') => {
      if (isDisposed) return;

      setPlaybackError(message);
      setIsVideoReady(false);
      scheduleReload();
    };

    const handleLoadedMetadata = () => {
      void markReady();
    };

    const handleLoadedData = () => {
      void markReady();
    };

    const handleCanPlay = async () => {
      void markReady();
    };

    const handlePlaying = () => {
      void markReady();
    };

    const handleError = () => {
      markWaiting();
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('error', handleError);

    try {
      video.pause();
      video.removeAttribute('src');
      video.load();
    } catch {}

    setPlaybackError(null);
    setIsVideoReady(false);
    clearRetryTimer();

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });

      hlsRef.current = hls;

      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        if (isDisposed) return;
        hls.loadSource(resolvedSrc);
        hls.startLoad();
      });

      hls.on(Hls.Events.MANIFEST_PARSED, async () => {
        if (isDisposed) return;

        try {
          await video.play();
        } catch {}
      });

      hls.on(Hls.Events.LEVEL_LOADED, () => {
        void markReady();
      });

      hls.on(Hls.Events.FRAG_BUFFERED, () => {
        void markReady();
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (isDisposed || !data?.fatal) {
          return;
        }

        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          markWaiting();
          try {
            hls.destroy();
          } catch {}
          return;
        }

        if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          markWaiting();
          try {
            hls.recoverMediaError();
            return;
          } catch {}
        }

        markWaiting();
        try {
          hls.destroy();
        } catch {}
      });

      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = resolvedSrc;

      void video.play().catch(() => {
        markWaiting();
      });
    } else {
      setPlaybackError('HLS is not supported in this browser.');
    }

    return () => {
      isDisposed = true;
      clearRetryTimer();

      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('error', handleError);

      if (hlsRef.current) {
        try {
          hlsRef.current.destroy();
        } catch {}
        hlsRef.current = null;
      }

      try {
        video.pause();
        video.removeAttribute('src');
        video.load();
      } catch {}
    };
  }, [resolvedSrc]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-black shadow-sm">
      <div className="pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-2 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
        <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
        LIVE
      </div>

      {!isVideoReady ? (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center text-sm text-slate-400">
          Waiting for live stream...
        </div>
      ) : null}

      <video
        ref={videoRef}
        controls
        autoPlay
        playsInline
        muted
        preload="auto"
        className="aspect-video w-full bg-black"
      />

      {playbackError && !isVideoReady ? (
        <div className="border-t border-slate-800 bg-slate-950 p-4 text-sm text-slate-400">
          {playbackError}
          <div className="mt-1 text-xs text-slate-500">
            Reconnecting automatically...
          </div>
        </div>
      ) : null}
    </div>
  );
}