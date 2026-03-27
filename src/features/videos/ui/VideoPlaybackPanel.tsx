'use client';

import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface VideoPlaybackPanelProps {
  src: string;
}

export function VideoPlaybackPanel({ src }: VideoPlaybackPanelProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);

      return () => {
        hls.destroy();
      };
    }
  }, [src]);

  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-black shadow-sm">
      <div className="aspect-video max-h-[calc(100dvh-320px)] w-full xl:max-h-[calc(100dvh-300px)]">
        <video
          ref={videoRef}
          controls
          playsInline
          className="h-full w-full bg-black"
        />
      </div>
    </div>
  );
}