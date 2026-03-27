'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

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
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  const resolvedSrc = useMemo(() => withCacheBuster(src, reloadToken), [src, reloadToken]);

  useEffect(() => {
    if (isVideoReady) {
      return;
    }

    const timer = window.setTimeout(() => {
      setReloadToken((value) => value + 1);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [isVideoReady, reloadToken]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isDisposed = false;
    let hlsInstance: any = null;

    setPlaybackError(null);
    setIsVideoReady(false);

    video.pause();
    video.removeAttribute('src');
    video.load();

    const revealVideo = async () => {
      if (isDisposed) return;

      const hasActualVideo =
        video.readyState >= 2 &&
        video.videoWidth > 0 &&
        video.videoHeight > 0;

      if (!hasActualVideo) {
        return;
      }

      setPlaybackError(null);
      setIsVideoReady(true);

      try {
        await video.play();
      } catch {}
    };

    const handleLoadedData = () => {
      void revealVideo();
    };

    const handleCanPlay = () => {
      void revealVideo();
    };

    const handlePlaying = () => {
      void revealVideo();
    };

    const handleError = () => {
      if (isDisposed) return;
      setIsVideoReady(false);
      setPlaybackError('Waiting for video from OBS...');
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('error', handleError);

    const initNativeHls = async () => {
      video.src = resolvedSrc;

      try {
        await video.play();
      } catch {}
    };

    const initHlsJs = async () => {
      const HlsModule = await import('hls.js');
      const Hls = HlsModule.default;

      if (isDisposed) return;

      if (!Hls.isSupported()) {
        setPlaybackError('HLS is not supported in this browser.');
        return;
      }

      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });

      hlsInstance = hls;
      hls.loadSource(resolvedSrc);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, async () => {
        try {
          await video.play();
        } catch {}
      });

      hls.on(Hls.Events.LEVEL_LOADED, () => {
        void revealVideo();
      });

      hls.on(Hls.Events.FRAG_BUFFERED, () => {
        void revealVideo();
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (!data?.fatal) {
          return;
        }

        setIsVideoReady(false);
        setPlaybackError('Waiting for video from OBS...');

        try {
          hls.destroy();
        } catch {}
      });
    };

    const init = async () => {
      try {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          await initNativeHls();
          return;
        }

        await initHlsJs();
      } catch {
        if (!isDisposed) {
          setIsVideoReady(false);
          setPlaybackError('Waiting for video from OBS...');
        }
      }
    };

    void init();

    return () => {
      isDisposed = true;

      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('error', handleError);

      try {
        video.pause();
        video.removeAttribute('src');
        video.load();
      } catch {}

      if (hlsInstance) {
        try {
          hlsInstance.destroy();
        } catch {}
      }
    };
  }, [resolvedSrc]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-black shadow-sm">
      <div className="pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-2 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
        <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
        LIVE
      </div>

      {!isVideoReady ? (
        <div className="flex aspect-video items-center justify-center text-sm text-slate-400">
          Waiting for video from OBS...
        </div>
      ) : null}

      <video
        ref={videoRef}
        controls
        autoPlay
        playsInline
        muted
        className={`aspect-video w-full bg-black ${isVideoReady ? 'block' : 'hidden'}`}
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