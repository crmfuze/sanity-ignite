import { type HttpTypes } from '@medusajs/types';
import { Text } from '@medusajs/ui';

import LocalizedClientLink from '@/components/modules/common/components/localized-client-link';

import Thumbnail from './products/components/thumbnail';

export default function ProductCard({
  product,
  isFeatured,
}: {
  product: HttpTypes.StoreProduct;
  isFeatured?: boolean;
}) {
  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div data-testid="product-wrapper">
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="full"
          isFeatured={isFeatured}
        />
        <div className="flex txt-compact-medium mt-4 justify-between">
          <Text className="text-ui-fg-subtle" data-testid="product-title">
            {product.title}
          </Text>
        </div>
      </div>
    </LocalizedClientLink>
  );
}
