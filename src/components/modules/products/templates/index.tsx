import { type HttpTypes } from '@medusajs/types';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react';

import ImageGallery from '@/components/modules/products/components/image-gallery';
import ProductActions from '@/components/modules/products/components/product-actions';
import ProductTabs from '@/components/modules/products/components/product-tabs';
import ProductInfo from '@/components/modules/products/templates/product-info';

import ProductActionsWrapper from './product-actions-wrapper';

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct;
  region: HttpTypes.StoreRegion;
  countryCode: string;
};

const ProductTemplate: React.FC<ProductTemplateProps> = ({ product, region }) => {
  if (!product || !product.id) {
    return notFound();
  }

  return (
    <>
      <div
        className="content-container flex flex-col small:flex-row small:items-start py-6 relative"
        data-testid="product-container"
      >
        <div className="flex flex-col small:sticky small:top-48 small:py-0 small:max-w-[300px] w-full py-8 gap-y-6">
          <ProductInfo product={product} />
          <ProductTabs product={product} />
        </div>
        <div className="block w-full relative">
          <ImageGallery images={product?.images || []} />
        </div>
        <div className="flex flex-col small:sticky small:top-48 small:py-0 small:max-w-[300px] w-full py-8 gap-y-12">
          <Suspense fallback={<ProductActions disabled={true} product={product} region={region} />}>
            <ProductActionsWrapper id={product.id} region={region} />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default ProductTemplate;
