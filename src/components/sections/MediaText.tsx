import { Image } from 'next-sanity/image';
import { urlForImage } from '@/lib/sanity/client/utils';
import { type PortableTextBlock } from 'next-sanity';
import PortableText from '@/components/modules/PortableText';
import { cn } from '@/utils/styles';
import type { MediaTextSection } from './types';
import { Button } from '../ui/button';
import Link from 'next/link';
import { getLinkByLinkObject } from '@/lib/links';

export default function MediaTextSection({ section }: { section: MediaTextSection }) {
  // Clean the value by removing hidden Unicode characters
  const cleanString = (str: string | null | undefined): string => {
    if (!str) return '';
    // Remove zero-width spaces and other invisible characters
    return str.replace(/[\u200B-\u200F\uFEFF\u202A-\u202E\u2060-\u2064\u2066-\u206F]/g, '');
  };

  const cleanedPosition = cleanString(section?.imagePosition);
  const isImageRight = cleanedPosition === 'right';

  return (
    <div
      className={cn(
        'content-container py-10 md:py-14 mx-auto flex flex-col',
        isImageRight ? 'lg:flex-row-reverse' : 'lg:flex-row',
      )}
    >
      <div className="lg:w-1/2">
        {section.image?.asset && (
          <Image
            alt={section.image?.alt || ''}
            className="shadow-md rounded-4xl"
            width="1000"
            height="667"
            src={urlForImage(section.image)?.width(1000).height(667).url() as string}
          />
        )}
      </div>
      <div className="lg:w-1/2 lg:p-12 mt-8 lg:mt-0 flex flex-col justify-center">
        <h2 className="text-4xl font-bold leading-tight tracking-tighter lg:text-5xl mb-5">
          {section?.heading}
        </h2>
        <div className="text-xl mb-5">
          <PortableText className="" value={section.content as PortableTextBlock[]} />
        </div>
        <div className="">
          {section?.button && (
            <Button asChild variant={section.button.variant} size={'lg'} key={section.button._key}>
              <Link
                href={section.button.link ? getLinkByLinkObject(section.button.link) || '' : ''}
                target={section.button.link?.openInNewTab ? '_blank' : '_self'}
              >
                {section.button.text}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
