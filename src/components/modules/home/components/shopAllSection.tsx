"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "../components/scrollArea";
import ProductCard from "../components/ProductCard";
import { StoreProduct } from "@medusajs/types";
import LocalizedClientLink from "../../common/components/localized-client-link";

interface ShopAllSectionProps {
  products?: StoreProduct[];
  sectionTitle?: string;
}

const ShopAllSection = ({
  products,
  sectionTitle = "Shop All Products",
}: ShopAllSectionProps) => {

  return (
    <section className="py-16 px-4 md:px-6 bg-gray-50">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">{sectionTitle}</h2>
          <LocalizedClientLink href={`/store`}>
            <Button
              variant="outline"
              className="bg-transparent text-[#9B37AE] border-[#9B37AE] font-bold tracking-normal font-sans hover:bg-purple-800 transition hover:text-white"
            >
              View All Products
            </Button>
          </LocalizedClientLink>
        </div>

        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex w-max space-x-6 pb-4">
            {products && products.map((product) => (
              <div key={product.id} className="w-80 flex-none">
                <ProductCard
                  product={product}
                />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </section>
  );
};

export default ShopAllSection;
