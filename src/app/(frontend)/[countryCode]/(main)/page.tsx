import { homePageQuery } from '@/lib/sanity/queries/queries';
import { sanityFetch } from '@/lib/sanity/client/live';
import { formatMetaData } from '@/lib/sanity/client/seo';
import PageSections from '@/components/sections/PageSections';
import { notFound } from 'next/navigation';
import { SeoType } from '@/types/seo';
import { getRegion } from '@/lib/medusa/data/regions';
import { getOrSetSalesChannel } from '@/lib/medusa/data/customer';
import HomeTemplate from '@/components/modules/home/templates';

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

  return (
    <>
      <HomeTemplate homepage={homePage}/>
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
