'use client';

import { useEffect, useRef, useState } from 'react';

interface LivePlayerPanelProps {
  src: string;
}

export function LivePlayerPanel({ src }: LivePlayerPanelProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isDisposed = false;
    let hlsInstance: any = null;

    setPlaybackError(null);
    setIsLoading(true);

    video.pause();
    video.removeAttribute('src');
    video.load();

    const handleReady = async () => {
      setIsLoading(false);

      try {
        await video.play();
      } catch {}
    };

    const init = async () => {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        video.onloadeddata = handleReady;
        return;
      }

      try {
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
        hls.loadSource(src);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, handleReady);

        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data?.fatal) {
            setPlaybackError('Failed to load live stream.');
          }
        });
      } catch {
        if (!isDisposed) {
          setPlaybackError('Failed to initialize player.');
        }
      }
    };

    void init();

    return () => {
      isDisposed = true;
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    };
  }, [src, retryCount]);

  useEffect(() => {
    if (!playbackError) return;

    const timer = setTimeout(() => {
      setRetryCount((c) => c + 1);
    }, 3000);

    return () => clearTimeout(timer);
  }, [playbackError]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-black shadow-sm">
      <div className="pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-2 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
        <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
        LIVE
      </div>

      {isLoading && (
        <div className="flex aspect-video items-center justify-center text-sm text-slate-400">
          Connecting to live stream...
        </div>
      )}

      <video
        ref={videoRef}
        controls
        autoPlay
        playsInline
        muted
        className={`aspect-video w-full ${isLoading ? 'hidden' : ''}`}
      />

      {playbackError && (
        <div className="border-t border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {playbackError}
          <div className="mt-1 text-xs text-red-500">
            Retrying automatically...
          </div>
        </div>
      )}
    </div>
  );
}