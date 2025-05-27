import { stegaClean } from 'next-sanity';
import type { HeroSection } from '../types';
import SimpleHero from './simple-hero';
import LargeHero from './large-hero';
import MuxPlayer from '@mux/mux-player-react/lazy';

export default function HeroSection({ section }: { section: HeroSection }) {
  const mediaType = stegaClean(section.mediaType);
  const video = section.video;
  const largeImage = stegaClean(section.largeImage);

  return (
    <section className="mx-auto w-full max-w-max-screen px-m py-xs lg:px-xl lg:py-xs">
      {mediaType === 'image' && <SimpleHero section={section} />}
      {mediaType === 'video' && video && (
        <LargeHero section={section}>
          {video.asset?.playbackId && (
            <MuxPlayer loading="viewport" playbackId={video.asset.playbackId} />
          )}
        </LargeHero>
      )}
    </section>
  );
}
