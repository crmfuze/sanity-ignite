'use client';

import { ElementType } from 'react';
import { useOptimistic } from 'next-sanity/hooks';
import { type SanityDocument } from 'next-sanity';
import { dataAttr } from '@/lib/sanity/client/utils';
import { Section, Sections } from './types';
import Hero from './hero';
import CTA from './CTA';
import MediaText from './MediaText';
import CardGrid from './CardGrid';
import Divider from './Divider';
import Subscribe from './Subscribe';
import BlockContent from './BlockContent';
import FeaturedProducts from './FeaturedProducts';
import ScienceBanner from './ScienceBanner';
import { StoreRegion } from '@medusajs/types';

type PageSectionstype = Section['_type'];

const SECTION_COMPONENTS: Record<PageSectionstype, ElementType> = {
  hero: Hero,
  mediaText: MediaText,
  cta: CTA,
  subscribe: Subscribe,
  cardGrid: CardGrid,
  divider: Divider,
  blockContentSection: BlockContent,
  featuredProducts: FeaturedProducts,
  scienceBanner: ScienceBanner,
} as const;

type PageSectionsProps = {
  documentId: string;
  documentType: string;
  sections?: Sections;
  region?: StoreRegion;
  salesChannelId?: string;
};

type PageData = SanityDocument<{
  pageSections?: Sections;
}>;

export default function PageSections({
  documentId,
  documentType,
  region,
  salesChannelId,
  sections: initialSections = [],
}: PageSectionsProps) {
  const sections = useOptimistic<Sections, PageData>(
    initialSections ?? [],
    (currentSections, action) => {
      if (action.id !== documentId || !action?.document?.pageSections) {
        return currentSections;
      }

      return action.document.pageSections.map(
        (section) =>
          currentSections?.find((currentSection) => currentSection._key === section?._key) ||
          section,
      );
    },
  );

  if (!sections?.length) {
    return null;
  }

  return (
    <div
      data-sanity={dataAttr({
        id: documentId,
        type: documentType,
        path: 'pageSections',
      })}
    >
      {sections?.map((section) => {
        const { _key, _type, ...sectionProps } = section;
        const SectionComponent = SECTION_COMPONENTS[_type];

        if (!SectionComponent) {
          return (
            <div
              key={_key}
              className="flex items-center justify-center p-8 my-8 text-center text-muted-foreground bg-muted rounded-lg"
            >
              Component not found for block type: <code>{_type}</code>
            </div>
          );
        }

        return (
          <div
            key={_key}
            data-sanity={dataAttr({
              id: documentId,
              type: documentType,
              path: `pageSections[_key=="${_key}"]`,
            })}
          >
            <SectionComponent 
              section={sectionProps} 
              region={region} 
              salesChannelId={salesChannelId}
            />
          </div>
        );
      })}
    </div>
  );
}
