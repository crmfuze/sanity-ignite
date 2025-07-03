import React, { ReactNode } from "react";
import { Card, CardContent, CardFooter } from "../components/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import LocalizedClientLink from "../../common/components/localized-client-link";
import product from "@/studio/schema/documents/product";
import { StoreProduct } from "@medusajs/types";

interface ProductCardProps {
  product: StoreProduct
}

const ProductCard = ({
  product,
}: ProductCardProps) => {

  return (
    <Card className="h-full overflow-hidden transition-all hover:shadow-lg bg-white">
      <div className="relative h-64 overflow-hidden">
        <img
          src={product.thumbnail ?? ""}
          alt={product.title ?? ""}
          className="w-full h-full object-contain transition-transform hover:scale-105"
        />
      </div>

      <CardContent className="pt-4">
        <h3 className="font-semibold text-lg truncate">{product.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 h-10 mt-1">
          {product.description}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-bold text-lg">{product.variants?.[0]?.calculated_price?.original_amount}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex flex-col gap-2">
        <LocalizedClientLink href={`/products/${product.handle}`} className="w-full">
          <Button className="w-full">View Product</Button>
        </LocalizedClientLink>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
