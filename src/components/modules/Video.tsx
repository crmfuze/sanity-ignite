'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
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
};

export default function Video({ src, spanishSrc }: VideoProps) {
  const [isClient, setIsClient] = useState(false);
  const currentLanguage = useWeglotLanguage();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Select the appropriate video URL based on language
  const getVideoUrl = () => {
    if (currentLanguage === 'es' && spanishSrc) {
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
    <div className="relative w-full h-full">
      <ReactPlayer
        url={videoUrl}
        controls={true}
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0 }}
        key={videoUrl} // Force re-render when URL changes
      />
    </div>
  );
}
