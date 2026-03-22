'use client';

import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface LivePlayerPanelProps {
  src: string;
}

export function LivePlayerPanel({ src }: LivePlayerPanelProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });

      hls.loadSource(src);
      hls.attachMedia(video);

      return () => {
        hls.destroy();
      };
    }
  }, [src]);

  return (
    <div className="overflow-hidden rounded-xl border bg-black">
      <video
        ref={videoRef}
        controls
        autoPlay
        className="aspect-video w-full"
      />
    </div>
  );
}