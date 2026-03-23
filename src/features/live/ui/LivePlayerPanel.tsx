'use client';

import { useEffect, useRef, useState } from 'react';

interface LivePlayerPanelProps {
  src: string;
}

export function LivePlayerPanel({ src }: LivePlayerPanelProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playbackError, setPlaybackError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isDisposed = false;
    let hlsInstance: {
      destroy: () => void;
      loadSource: (url: string) => void;
      attachMedia: (media: HTMLMediaElement) => void;
      on: (event: string, handler: (...args: unknown[]) => void) => void;
    } | null = null;

    setPlaybackError(null);

    video.pause();
    video.removeAttribute('src');
    video.load();

    const tryPlay = async () => {
      try {
        await video.play();
      } catch {
        // autoplay may be blocked by browser
      }
    };

    const init = async () => {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        await tryPlay();
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

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          void tryPlay();
        });

        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data?.fatal) {
            setPlaybackError('Failed to load live stream in browser.');
          }
        });
      } catch {
        if (!isDisposed) {
          setPlaybackError('Failed to initialize live player.');
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
  }, [src]);

  return (
    <div className="overflow-hidden rounded-xl border bg-black">
      <video
        ref={videoRef}
        controls
        autoPlay
        playsInline
        muted
        className="aspect-video w-full"
      />

      {playbackError ? (
        <div className="border-t border-slate-800 bg-white p-4 text-sm text-red-700">
          {playbackError}
        </div>
      ) : null}
    </div>
  );
}