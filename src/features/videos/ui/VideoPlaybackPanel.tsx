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
    <div className="overflow-hidden rounded-xl border bg-black">
      <video ref={videoRef} controls className="aspect-video w-full" />
    </div>
  );
}