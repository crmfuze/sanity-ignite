import { Image } from 'next-sanity/image';
import { urlForImage } from '@/lib/sanity/client/utils';
import { cn } from '@/utils/styles';
import type { ScienceBannerSection } from './types';
import { Button } from '../ui/button';
import Link from 'next/link';
import { getLinkByLinkObject } from '@/lib/links';
import * as LucideIcons from 'lucide-react';

export default function ScienceBanner({ section }: { section: ScienceBannerSection }) {
  const cleanString = (str: string | null | undefined): string => {
    if (!str) return '';
    return str.replace(/[\u200B-\u200F\uFEFF\u202A-\u202E\u2060-\u2064\u2066-\u206F]/g, '');
  };

  const cleanedImagePosition = cleanString(section?.imagePosition);
  const cleanedContentPosition = cleanString(section?.contentPosition);
  const isImageRight = cleanedImagePosition === 'right';
  
  const getContentAlignment = () => {
    switch (cleanedContentPosition) {
      case 'right':
        return 'text-right lg:text-right';
      case 'center':
        return 'text-center lg:text-center';
      default:
        return 'text-center lg:text-left';
    }
  };

  return (
    <section className="bg-[#FEFAFF] py-10 md:py-14">
      <div
        className={cn(
          'w-full flex flex-col min-h-[500px]',
          isImageRight ? 'lg:flex-row-reverse' : 'lg:flex-row',
        )}
      >
        <div className="lg:w-1/2">
          {section.image?.asset && (
            <div className="relative w-full aspect-[3/2] lg:aspect-[16/9]">
              <Image
                alt={section.image?.alt || ''}
                className="rounded-lg object-cover"
                fill={true}
                src={urlForImage(section.image)?.width(1000).height(667).auto('format').url() as string}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          )}
        </div>
        <div className={cn("lg:w-1/2 lg:p-12 mt-8 lg:mt-0 flex flex-col justify-center px-6", getContentAlignment())}>
        {section?.scienceBlock?.heading && (
          <h2 className="text-4xl font-bold leading-tight tracking-tighter md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl mb-5 text-gray-900">
            {section.scienceBlock.heading}
          </h2>
        )}
        {section?.scienceBlock?.content && (
          <p className="text-xl mb-6 text-gray-900">
            {section.scienceBlock.content}
          </p>
        )}
        {section?.scienceBlock?.benefits && section.scienceBlock.benefits.length > 0 && (
          <div className="mb-6 space-y-4">
            {section.scienceBlock.benefits.map((benefit, index) => {
              if (!benefit?.title) return null;
              
              // Get the icon name directly from the new schema
              const iconName = benefit?.iconName || 'Check';
              
              // Get the icon component, fallback to Check if not found
              const IconComponent = iconName && iconName in LucideIcons 
                ? (LucideIcons as any)[iconName] 
                : LucideIcons.Check;
              
              return (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <IconComponent className="w-6 h-6 text-[#9B37AE]" />
                  </div>
                  <span className="text-lg font-medium text-gray-900">{benefit.title}</span>
                </div>
              );
            })}
          </div>
        )}
        {section?.button && (
          <div className="">
            <Button asChild variant={section.button.variant} size={'xl'} key={section.button._key}>
              <Link
                href={section.button.link ? getLinkByLinkObject(section.button.link) || '' : ''}
                target={section.button.link?.openInNewTab ? '_blank' : '_self'}
              >
                {section.button.text}
              </Link>
            </Button>
          </div>
        )}
        </div>
      </div>
    </section>
  );
}