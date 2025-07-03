import page from './documents/page';
import homePage from './singletons/home/homePage';
import cta from './objects/sections/cta';
import hero from './objects/sections/hero';
import mediaText from './objects/sections/mediaText';
import cardGrid from './objects/sections/cardGrid';
import settings from './singletons/settings';
import blockContent from './objects/blockContent';
import blockContentSection from './objects/sections/blockContent';
import link from './objects/link';
import button from './objects/button';
import card from './objects/sections/card';
import divider from './objects/sections/divider';
import subscribe from './objects/sections/subscribe';
import menuItem from './objects/menuItem';
import seoTypes from './objects/seo';
import footer from './singletons/footer';
import product from './documents/product';
import featuredProducts from './objects/sections/featuredProducts';
import scienceBanner from './objects/sections/scienceBanner';
import video from './objects/video';

export const schemaTypes = [
  // Singletons
  settings,
  homePage,
  footer,

  // Documents
  page,

  // Sections
  cta,
  hero,
  mediaText,
  card,
  cardGrid,
  divider,
  subscribe,
  blockContentSection,
  featuredProducts,
  scienceBanner,

  // Objects
  blockContent,
  link,
  button,
  menuItem,
  video,
  ...seoTypes,

  // Medusa
  product,
];
