import { homePageQuery } from '@/lib/sanity/queries/queries';
import { sanityFetch } from '@/lib/sanity/client/live';
import { formatMetaData } from '@/lib/sanity/client/seo';
import PageSections from '@/components/sections/PageSections';
import { notFound } from 'next/navigation';
import { SeoType } from '@/types/seo';
import { getRegion } from '@/lib/medusa/data/regions';
import { getOrSetSalesChannel } from '@/lib/medusa/data/customer';
import HomeTemplate from '@/components/modules/home/templates';
import { getProductByHandle, listProducts } from '@/lib/medusa/data/products';
import ShopAllSection from '@/components/modules/home/components/shopAllSection';
import { getCollectionByHandle } from '@/lib/medusa/data/collections';

export async function generateMetadata() {
  const { data: homePage } = await sanityFetch({
    query: homePageQuery,
  });

  if (!homePage?.seo) {
    return {};
  }

  return formatMetaData(homePage.seo as unknown as SeoType, homePage?.name || '');
}

export default async function Page(props: { params: Promise<{ countryCode: string }> }) {
  const params = await props.params;

  const { data: homePage } = await sanityFetch({
    query: homePageQuery,
  });

  const { countryCode } = params;

  const region = await getRegion(countryCode);
  const salesChannel = await getOrSetSalesChannel();

  if (!homePage || !region || !salesChannel?.id) {
    notFound();
  }

  const { _id, _type, pageSections } = homePage;
  
  const { response: { products }, nextPage } = await listProducts({
    countryCode,
    regionId: region.id,
    sales_channel_id: salesChannel.id,
    queryParams: {
      limit: 7
    },
  });

  const featuredCollection = await getCollectionByHandle('featured-products');
  let featuredProducts: any[] = [];
  if (featuredCollection?.products?.length) {
    featuredProducts = await Promise.all(
      featuredCollection.products.map(async (product) => {
        return await getProductByHandle(product.handle, region.id, salesChannel.id);
      })
    );
  }

  return (
    <>
      <HomeTemplate 
      homepage={homePage}
      products={products}
      featuredProducts={featuredProducts}
      />
      <PageSections
        documentId={_id}
        documentType={_type}
        sections={pageSections}
        region={region}
        salesChannelId={salesChannel.id}
      />
    </>
  );
}
