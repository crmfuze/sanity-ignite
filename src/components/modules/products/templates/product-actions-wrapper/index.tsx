import { type HttpTypes } from "@medusajs/types";

import { listProducts } from "@/lib/medusa/data/products";
import ProductActions from "@/components/modules/products/components/product-actions";
import { getOrSetSalesChannel } from "@/lib/medusa/data/customer";

/**
 * Fetches real time pricing for a product and renders the product actions component.
 */
export default async function ProductActionsWrapper({
  id,
  region,
}: {
  id: string;
  region: HttpTypes.StoreRegion;
}) {
  const sales_channel = await getOrSetSalesChannel();

  const product = await listProducts({
    queryParams: { id: [id] },
    regionId: region.id,
    sales_channel_id: sales_channel?.id
  }).then(({ response }) => response.products[0]);

  if (!product) {
    return null;
  }

  return <ProductActions product={product} region={region} />;
}
