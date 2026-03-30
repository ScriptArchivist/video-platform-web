'use client';

import { useEffect, useRef, useState } from 'react';

interface LivePlayerPanelProps {
  src: string;
}

export function LivePlayerPanel({ src }: LivePlayerPanelProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    let isDisposed = false;
    let hlsInstance: any = null;

    setPlaybackError(null);
    setIsVideoReady(false);

    const revealVideo = async () => {
      if (isDisposed) return;

      setPlaybackError(null);
      setIsVideoReady(true);

      try {
        await video.play();
      } catch {}
    };

    const handleLoadedMetadata = () => {
      void revealVideo();
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

    video.pause();
    video.removeAttribute('src');
    video.load();

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('error', handleError);

    const initNativeHls = async () => {
      video.src = src;

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

      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        if (isDisposed) return;
        hls.loadSource(src);
      });

      hls.on(Hls.Events.MANIFEST_PARSED, async () => {
        if (isDisposed) return;

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
        if (isDisposed) return;

        if (!data?.fatal) {
          return;
        }

        setIsVideoReady(false);
        setPlaybackError('Waiting for video from OBS...');

        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            try {
              hls.startLoad();
            } catch {}
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            try {
              hls.recoverMediaError();
            } catch {}
            break;
          default:
            try {
              hls.destroy();
            } catch {}
            break;
        }
      });

      hls.attachMedia(video);
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

      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
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
  }, [src]);

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