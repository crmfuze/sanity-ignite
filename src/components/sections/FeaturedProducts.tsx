'use client';

import { FeaturedProductsSection } from './types';
import { HttpTypes, StoreRegion } from '@medusajs/types';
import { listProductsById } from '@/lib/medusa/data/products';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/modules/ProductCard';

export default function FeaturedProducts({
  section,
  region,
}: {
  section: FeaturedProductsSection;
  region: StoreRegion;
}) {
  const { title, products } = section;
  const [storeProducts, setStoreProducts] = useState<HttpTypes.StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!products || products.length === 0) {
        setLoading(false);
        return;
      }

      try {
        // Extract just the IDs from the Sanity references
        const productIds = products.map((p) => p._id);
        
        // Fetch the Medusa products using the extracted IDs
        const { products: fetchedProducts } = await listProductsById({
          productIds,
          region,
        });

        setStoreProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [products, region]);

  if (loading) {
    return (
      <section className="py-12 bg-[#FDF5FF]">
        <div className="content-container">
          <div className="flex flex-col items-start mb-8">
            <h1 className="font-inter font-bold lg:text-[45px] lg:leading-[55px] md:text-[35px] md:leading-[40px] text-[30px] leading-[35px] tracking-[0px] mb-8">
              {title}
            </h1>
          </div>
          <div className="flex justify-center">
            <p>Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-[#FDF5FF]">
      <div className="content-container">
        <div className="flex flex-col items-start mb-8">
          <h1 className="font-inter font-bold lg:text-[45px] lg:leading-[55px] md:text-[35px] md:leading-[40px] text-[30px] leading-[35px] tracking-[0px] mb-8">
            {title}
          </h1>
        </div>
        {/* Carousel */}
        <div className="w-full">
          <Carousel opts={{ align: 'center' }} className="w-full">
            <CarouselContent>
              {storeProducts?.map((product, index) => (
                <CarouselItem key={index} className="basis-1/3">
                  <ProductCard product={product} isFeatured />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
