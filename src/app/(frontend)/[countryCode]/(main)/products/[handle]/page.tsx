import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductByHandle, listProducts } from '@/lib/medusa/data/products';
import { getRegion, listRegions } from '@/lib/medusa/data/regions';
import ProductTemplate from '@/components/modules/products/templates';
import { sanityFetch } from '@/lib/sanity/client/live';
import { productPageQuery } from '@/lib/sanity/queries/queries';
import ProductIngredients from '@/components/modules/products/templates/product-ingredients';
import PageSections from '@/components/sections/PageSections';

type Props = {
  params: Promise<{ countryCode: string; handle: string }>;
};

export async function generateStaticParams() {
  try {
    const countryCodes = await listRegions().then((regions) =>
      regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat(),
    );

    if (!countryCodes) {
      return [];
    }

    const promises = countryCodes.map(async (country) => {
      const { response } = await listProducts({
        countryCode: country,
        queryParams: { limit: 100, fields: 'handle' },
      });

      return { country, products: response.products };
    });

    const countryProducts = await Promise.all(promises);

    return countryProducts
      .flatMap((countryData) =>
        countryData.products.map((product) => ({
          countryCode: countryData.country,
          handle: product.handle,
        })),
      )
      .filter((param) => param.handle);
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${
        error instanceof Error ? error.message : 'Unknown error'
      }.`,
    );
    return [];
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { handle } = params;
  const region = await getRegion(params.countryCode);

  if (!region) {
    notFound();
  }

  const product = await getProductByHandle(handle, region.id);

  if (!product) {
    notFound();
  }

  return {
    title: `${product.title} | Ambrosia Global`,
    description: `${product.title}`,
    openGraph: {
      title: `${product.title} | Ambrosia Global`,
      description: `${product.title}`,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  };
}

export default async function ProductPage(props: Props) {
  const params = await props.params;
  const region = await getRegion(params.countryCode);
  const handle = params.handle;

  if (!region) {
    notFound();
  }

  const pricedProduct = await getProductByHandle(params.handle, region.id);

  if (!pricedProduct) {
    notFound();
  }

  const { data: content } = await sanityFetch({
    query: productPageQuery,
    params: { handle },
  });

  if (!content) {
    notFound();
  }

  const { _id, _type, ingredients, pageSections } = content;

  return (
    <div>
      <ProductTemplate product={pricedProduct} region={region} countryCode={params.countryCode} />
      {ingredients && <ProductIngredients product={pricedProduct} ingredients={ingredients} />}
      <PageSections documentId={_id} documentType={_type} sections={pageSections} region={region} />
    </div>
  );
}
