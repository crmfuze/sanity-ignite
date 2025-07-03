import { HomePageQueryResult } from '@/sanity.types';
import HeroBanner from '../components/heroBanner'
import SpecialOfferSection from '../components/specialOfferSection';
import ShopAllSection from '../components/shopAllSection';
import { urlForImage } from '@/lib/sanity/client/utils';
import { StoreProduct } from '@medusajs/types';

const HomeTemplate = ({ homepage, products, featuredProducts }: { homepage: HomePageQueryResult, products: StoreProduct[], featuredProducts: StoreProduct[] }) => {
  const hero = homepage?.homePageHero
  return (
    <div>
      <HeroBanner 
      title={hero?.heading ?? undefined}
      subtitle={hero?.subtitle ?? undefined}
      imageUrl={hero?.image ? urlForImage(hero.image)?.height(720).width(1280).auto('format').url() as string : undefined} 
      videoUrl={hero?.video?.url ?? undefined}
      />
      <SpecialOfferSection 
      products={featuredProducts}
      />
      <ShopAllSection 
      products={products}
      />
    </div>
  )
};

export default HomeTemplate;
