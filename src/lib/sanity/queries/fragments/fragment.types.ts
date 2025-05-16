import { GetPageQueryResult } from '@/sanity.types';

export type PageFragmentType = NonNullable<GetPageQueryResult>;
export type SeoFragmentType = NonNullable<PageFragmentType['seo']>;
export type SectionsType = NonNullable<PageFragmentType['pageSections']>[number];

export type CardGridsSectionFragmentType = Extract<
  NonNullable<SectionsType>,
  { _type: 'cardGrid' }
>;
export type CtaSectionFragmentType = Extract<NonNullable<SectionsType>, { _type: 'cta' }>;
export type DividerSectionFragmentType = Extract<NonNullable<SectionsType>, { _type: 'divider' }>;
export type HeroSectionFragmentType = Extract<NonNullable<SectionsType>, { _type: 'hero' }>;
export type MediaTextSectionFragmentType = Extract<
  NonNullable<SectionsType>,
  { _type: 'mediaText' }
>;
export type PostListSectionFragmentType = Extract<NonNullable<SectionsType>, { _type: 'postList' }>;
export type SubscribeSectionFragmentType = Extract<
  NonNullable<SectionsType>,
  { _type: 'subscribe' }
>;

export type BlockContentSectionFragmentType = Extract<
  NonNullable<SectionsType>,
  { _type: 'blockContentSection' }
>;

export type FeaturedProductsSectionFragmentType = Extract<
  NonNullable<SectionsType>,
  { _type: 'featuredProducts' }
>;

export type ButtonFragmentType = NonNullable<HeroSectionFragmentType['buttons']>[number];
export type LinkFragmentType = NonNullable<ButtonFragmentType['link']>;
