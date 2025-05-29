import { stegaClean } from 'next-sanity';
import type { HeroSection } from '../types';
import SimpleHero from './simple-hero';
import LargeHero from './large-hero';
import VideoHero from './video-hero';
import { Image } from 'next-sanity/image';
import { urlForImage } from '@/lib/sanity/client/utils';

export default function HeroSection({ section }: { section: HeroSection }) {
  const mediaType = stegaClean(section.mediaType);
  const video = section.video;
  const largeImage = stegaClean(section.largeImage);

  // Don't render anything if no valid content is available
  if (
    (mediaType === 'image' && !section.image?.asset) ||
    (mediaType === 'video' && (!video || !video.url)) ||
    (mediaType === 'largeImage' && (!largeImage || !section.largeImage?.asset)) ||
    !mediaType ||
    !['image', 'video', 'largeImage'].includes(mediaType)
  ) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-max-screen px-m py-xs lg:px-xl lg:py-xs">
      {mediaType === 'image' && <SimpleHero section={section} />}
      {mediaType === 'video' && video && <VideoHero section={section} />}
      {mediaType === 'largeImage' && largeImage && (
        <LargeHero section={section}>
          {section.largeImage && (
            <Image
              src={urlForImage(section.largeImage)?.url() as string}
              alt={section?.image?.alt || ''}
              width={1200}
              height={675}
              className="hero-asset w-full rounded-lg object-cover object-center"
            />
          )}
        </LargeHero>
      )}
    </section>
  );
}
