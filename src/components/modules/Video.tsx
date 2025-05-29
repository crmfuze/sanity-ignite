'use client';

import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { useWeglotLanguage } from '@/hooks/use-weglot-language';

const ReactPlayer = dynamic(() => import('react-player'), {
  ssr: false,
  loading: () => (
    <div className="aspect-video bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
    </div>
  ),
});

export type VideoProps = {
  src?: string;
  spanishSrc?: string;
  aspectRatio?: string;
  controls?: boolean;
};

export default function Video({ src, spanishSrc, aspectRatio, controls }: VideoProps) {
  const [isClient, setIsClient] = useState(false);
  const currentLanguage = useWeglotLanguage();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Select the appropriate video URL based on language
  const getVideoUrl = () => {
    if (isClient && currentLanguage === 'es' && spanishSrc) {
      return spanishSrc;
    }
    return src;
  };

  const videoUrl = getVideoUrl();

  if (!isClient || !videoUrl) {
    return (
      <div className="aspect-video bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full" style={{ aspectRatio }}>
      <ReactPlayer
        url={videoUrl}
        controls={controls}
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0 }}
        key={videoUrl} // Force re-render when URL changes
        muted
        playsinline
        config={{
          vimeo: {
            playerOptions: {
              title: false,
              byline: false,
              portrait: false,
              share: false,
              vimeo_logo: false,
              controls: controls,
            }
          }
        }}
      />
    </div>
  );
}
