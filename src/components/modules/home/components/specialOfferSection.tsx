"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "../components/card";
import { StoreProduct } from "@medusajs/types";
import LocalizedClientLink from "../../common/components/localized-client-link";

interface SpecialOfferSectionProps {
  products?: StoreProduct[];
  sectionTitle?: string;
}

const SpecialOfferSection = ({
  products,
  sectionTitle = "Special Offers",
}: SpecialOfferSectionProps) => {

  return (
    <section className="py-16 px-4 md:px-6 bg-background">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">{sectionTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {products && products.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden hover:shadow-lg transition-shadow bg-white"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={product.thumbnail ?? ""}
                  alt={product.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {product.description}
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xl">
                    ${product.variants?.[0]?.calculated_price?.calculated_amount ?? 0}
                  </span>
                  {(product.variants?.[0]?.calculated_price?.original_amount ?? 0) && (
                    <span className="text-sm text-gray-500 line-through">
                      ${product.variants?.[0]?.calculated_price?.original_amount}
                    </span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <LocalizedClientLink href={`/products/${product.handle}`} className="w-full">
                  <Button className="w-full">
                    View Product
                  </Button>
                </LocalizedClientLink>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialOfferSection;
