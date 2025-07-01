'use server';

import type { HttpTypes } from '@medusajs/types';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

import { sdk } from '../config';

import medusaError from '../util/medusa-error';
import {
  getAuthHeaders,
  getCacheOptions,
  getCacheTag,
  getCartId,
  getTrackingId,
  removeCartId,
  setCartId,
} from './cookies';
import { getRegion } from './regions';
import { getOrSetSalesChannel } from './customer';
import { AutoshipInterval } from '@/types/autoship';

/**
 * Retrieves a cart by its ID. If no ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to retrieve.
 * @returns The cart object if found, or null if not found.
 */
export async function retrieveCart(cartId?: string) {
  const id = cartId || (await getCartId());

  if (!id) {
    return null;
  }

  const headers = {
    ...(await getAuthHeaders()),
  };

  const next = {
    ...(await getCacheOptions('carts')),
  };

  return await sdk.client
    .fetch<HttpTypes.StoreCartResponse>(`/store/carts/${id}`, {
      method: 'GET',
      query: {
        fields:
          '*items, *region, *items.product, *items.variant, *items.thumbnail, *items.metadata, +items.total, *promotions, +shipping_methods.name',
      },
      headers,
      next,
      cache: 'no-cache',
    })
    .then(({ cart }) => cart)
    .catch(() => null);
}

export async function getOrSetCart(countryCode: string) {
  const region = await getRegion(countryCode);

  if (!region) {
    throw new Error(`Region not found for country code: ${countryCode}`);
  }

  const salesChannel = await getOrSetSalesChannel();

  if (!salesChannel?.id) {
    throw new Error('Sales channel not found');
  }

  let cart = await retrieveCart();

  const headers = {
    ...(await getAuthHeaders()),
  };

  const trackingId = { ...(await getTrackingId()) };

  if (!cart) {
    const cartResp = await sdk.store.cart.create(
      {
        region_id: region.id,
        sales_channel_id: salesChannel.id,
        metadata: { ...trackingId },
      },
      {},
      headers,
    );
    cart = cartResp.cart;

    await setCartId(cart.id);

    const cartCacheTag = await getCacheTag('carts');
    revalidateTag(cartCacheTag);
  }

  if (
    cart &&
    (cart?.region_id !== region.id ||
      cart?.metadata?.tracking_id !== trackingId.tracking_id ||
      cart?.sales_channel_id !== salesChannel.id)
  ) {
    await sdk.store.cart.update(
      cart.id,
      {
        region_id: region.id,
        sales_channel_id: salesChannel.id,
        metadata: { ...trackingId },
      },
      {},
      headers,
    );
    const cartCacheTag = await getCacheTag('carts');
    revalidateTag(cartCacheTag);
  }

  return cart;
}

export async function updateCart(data: HttpTypes.StoreUpdateCart) {
  const cartId = await getCartId();

  if (!cartId) {
    throw new Error('No existing cart found, please create one before updating');
  }

  const headers = {
    ...(await getAuthHeaders()),
  };

  const trackingId = await getTrackingId();

  // Ensure tracking_id is always included in metadata
  const updateData = {
    ...data,
    metadata: {
      ...trackingId,
      ...data.metadata,
    },
  };

  return sdk.store.cart
    .update(cartId, updateData, {}, headers)
    .then(async ({ cart }) => {
      const cartCacheTag = await getCacheTag('carts');
      revalidateTag(cartCacheTag);

      const fulfillmentCacheTag = await getCacheTag('fulfillment');
      revalidateTag(fulfillmentCacheTag);

      return cart;
    })
    .catch(medusaError);
}

export async function addToCart({
  variantId,
  quantity,
  countryCode,
  metadata,
}: {
  variantId: string;
  quantity: number;
  countryCode: string;
  metadata?: Record<string, any>;
}) {
  if (!variantId) {
    throw new Error('Missing variant ID when adding to cart');
  }

  const cart = await getOrSetCart(countryCode);

  if (!cart) {
    throw new Error('Error retrieving or creating cart');
  }

  const headers = {
    ...(await getAuthHeaders()),
  };

  await sdk.store.cart
    .createLineItem(
      cart.id,
      {
        variant_id: variantId,
        quantity,
        metadata,
      },
      {},
      headers,
    )
    .then(async () => {
      const cartCacheTag = await getCacheTag('carts');
      revalidateTag(cartCacheTag);

      const fulfillmentCacheTag = await getCacheTag('fulfillment');
      revalidateTag(fulfillmentCacheTag);
    })
    .catch(medusaError);
}

export async function updateLineItem({ lineId, quantity }: { lineId: string; quantity: number }) {
  if (!lineId) {
    throw new Error('Missing lineItem ID when updating line item');
  }

  const cartId = await getCartId();

  if (!cartId) {
    throw new Error('Missing cart ID when updating line item');
  }

  const headers = {
    ...(await getAuthHeaders()),
  };

  await sdk.store.cart
    .updateLineItem(cartId, lineId, { quantity }, {}, headers)
    .then(async () => {
      const cartCacheTag = await getCacheTag('carts');
      revalidateTag(cartCacheTag);

      const fulfillmentCacheTag = await getCacheTag('fulfillment');
      revalidateTag(fulfillmentCacheTag);
    })
    .catch(medusaError);
}

export async function deleteLineItem(lineId: string) {
  if (!lineId) {
    throw new Error('Missing lineItem ID when deleting line item');
  }

  const cartId = await getCartId();

  if (!cartId) {
    throw new Error('Missing cart ID when deleting line item');
  }

  const headers = {
    ...(await getAuthHeaders()),
  };

  await sdk.store.cart
    .deleteLineItem(cartId, lineId, headers)
    .then(async () => {
      const cartCacheTag = await getCacheTag('carts');
      revalidateTag(cartCacheTag);

      const fulfillmentCacheTag = await getCacheTag('fulfillment');
      revalidateTag(fulfillmentCacheTag);
    })
    .catch(medusaError);
}

export async function setShippingMethod({
  cartId,
  shippingMethodId,
}: {
  cartId: string;
  shippingMethodId: string;
}) {
  const headers = {
    ...(await getAuthHeaders()),
  };

  return sdk.store.cart
    .addShippingMethod(cartId, { option_id: shippingMethodId }, {}, headers)
    .then(async () => {
      const cartCacheTag = await getCacheTag('carts');
      revalidateTag(cartCacheTag);
    })
    .catch(medusaError);
}

export async function initiatePaymentSession(
  cart: HttpTypes.StoreCart,
  data: HttpTypes.StoreInitializePaymentSession,
) {
  const headers = {
    ...(await getAuthHeaders()),
  };

  return sdk.store.payment
    .initiatePaymentSession(cart, data, {}, headers)
    .then(async (resp) => {
      const cartCacheTag = await getCacheTag('carts');
      revalidateTag(cartCacheTag);
      return resp;
    })
    .catch(medusaError);
}

export async function applyPromotions(codes: string[]) {
  const cartId = await getCartId();

  if (!cartId) {
    throw new Error('No existing cart found');
  }

  const headers = {
    ...(await getAuthHeaders()),
  };

  return sdk.store.cart
    .update(cartId, { promo_codes: codes }, {}, headers)
    .then(async () => {
      const cartCacheTag = await getCacheTag('carts');
      revalidateTag(cartCacheTag);

      const fulfillmentCacheTag = await getCacheTag('fulfillment');
      revalidateTag(fulfillmentCacheTag);
    })
    .catch(medusaError);
}

// TODO: applyAmbrosiaCash
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyGiftCard(code: string) {
  //   const cartId = getCartId()
  //   if (!cartId) return "No cartId cookie found"
  //   try {
  //     await updateCart(cartId, { gift_cards: [{ code }] }).then(() => {
  //       revalidateTag("cart")
  //     })
  //   } catch (error: any) {
  //     throw error
  //   }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function removeDiscount(code: string) {
  // const cartId = getCartId()
  // if (!cartId) return "No cartId cookie found"
  // try {
  //   await deleteDiscount(cartId, code)
  //   revalidateTag("cart")
  // } catch (error: any) {
  //   throw error
  // }
}

// TODO: removeAmbrosiaCash
export async function removeGiftCard(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  codeToRemove: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  giftCards: unknown[],
  // giftCards: GiftCard[]
) {
  //   const cartId = getCartId()
  //   if (!cartId) return "No cartId cookie found"
  //   try {
  //     await updateCart(cartId, {
  //       gift_cards: [...giftCards]
  //         .filter((gc) => gc.code !== codeToRemove)
  //         .map((gc) => ({ code: gc.code })),
  //     }).then(() => {
  //       revalidateTag("cart")
  //     })
  //   } catch (error: any) {
  //     throw error
  //   }
}

export async function resetCart() {
  const currentCart = await retrieveCart();

  if (!currentCart) {
    return null;
  }

  // Get current cart items to re-add them
  const items = currentCart.items || [];
  const region = currentCart.region;
  const salesChannelId = currentCart.sales_channel_id;

  // Remove current cart ID to force creation of new cart
  removeCartId();

  const headers = {
    ...(await getAuthHeaders()),
  };

  const trackingId = { ...(await getTrackingId()) };

  // Create new cart
  const cartResp = await sdk.store.cart.create(
    {
      region_id: region?.id,
      sales_channel_id: salesChannelId,
      metadata: { ...trackingId },
    },
    {},
    headers,
  );

  const newCart = cartResp.cart;
  await setCartId(newCart.id);

  // Re-add items to new cart
  for (const item of items) {
    if (item.variant_id) {
      await sdk.store.cart.createLineItem(
        newCart.id,
        {
          variant_id: item.variant_id,
          quantity: item.quantity,
        },
        {},
        headers,
      );
    }
  }

  const cartCacheTag = await getCacheTag('carts');
  revalidateTag(cartCacheTag);

  const fulfillmentCacheTag = await getCacheTag('fulfillment');
  revalidateTag(fulfillmentCacheTag);

  return retrieveCart();
}

export async function submitPromotionForm(currentState: unknown, formData: FormData) {
  const code = formData.get('code') as string;
  try {
    await applyPromotions([code]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return e.message;
  }
}

// TODO: Pass a POJO instead of a form entity here
export async function setAddresses(currentState: unknown, formData: FormData) {
  try {
    if (!formData) {
      throw new Error('No form data found when setting addresses');
    }
    const cartId = getCartId();
    if (!cartId) {
      throw new Error('No existing cart found when setting addresses');
    }

    const data = {
      shipping_address: {
        first_name: formData.get('shipping_address.first_name'),
        last_name: formData.get('shipping_address.last_name'),
        address_1: formData.get('shipping_address.address_1'),
        address_2: '',
        company: formData.get('shipping_address.company'),
        postal_code: formData.get('shipping_address.postal_code'),
        city: formData.get('shipping_address.city'),
        country_code: formData.get('shipping_address.country_code'),
        province: formData.get('shipping_address.province'),
        phone: formData.get('shipping_address.phone'),
      },
      email: formData.get('email'),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    const sameAsBilling = formData.get('same_as_billing');
    if (sameAsBilling === 'on') data.billing_address = data.shipping_address;

    if (sameAsBilling !== 'on')
      data.billing_address = {
        first_name: formData.get('billing_address.first_name'),
        last_name: formData.get('billing_address.last_name'),
        address_1: formData.get('billing_address.address_1'),
        address_2: '',
        company: formData.get('billing_address.company'),
        postal_code: formData.get('billing_address.postal_code'),
        city: formData.get('billing_address.city'),
        country_code: formData.get('billing_address.country_code'),
        province: formData.get('billing_address.province'),
        phone: formData.get('billing_address.phone'),
      };
    await updateCart(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return e.message;
  }

  // Check if cart requires shipping to determine next step
  const cart = await retrieveCart();
  const requiresShipping = cart?.items?.some((item) => item.requires_shipping) ?? false;
  const nextStep = requiresShipping ? 'delivery' : 'payment';

  redirect(`/${formData.get('shipping_address.country_code')}/checkout?step=${nextStep}`);
}

/**
 * Places an order for a cart. If no cart ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to place an order for.
 * @returns The cart object if the order was successful, or null if not.
 */
export async function placeOrder(cartId?: string) {
  const id = cartId || (await getCartId());

  if (!id) {
    throw new Error('No existing cart found when placing an order');
  }

  const headers = {
    ...(await getAuthHeaders()),
  };

  const cartRes = await sdk.store.cart
    .complete(id, {}, headers)
    .then(async (cartRes) => {
      const cartCacheTag = await getCacheTag('carts');
      revalidateTag(cartCacheTag);
      return cartRes;
    })
    .catch(medusaError);

  if (cartRes?.type === 'order') {
    const countryCode =
      cartRes.order.shipping_address?.country_code?.toLowerCase() ||
      cartRes.order.billing_address?.country_code?.toLowerCase();

    const orderCacheTag = await getCacheTag('orders');
    revalidateTag(orderCacheTag);

    removeCartId();
    redirect(`/${countryCode}/order/${cartRes?.order.id}/confirmed`);
  }

  return cartRes.cart;
}

/**
 * Updates the countrycode param and revalidates the regions cache
 * @param regionId
 * @param countryCode
 */
export async function updateRegion(countryCode: string, currentPath: string) {
  const cartId = await getCartId();
  const region = await getRegion(countryCode);

  if (!region) {
    throw new Error(`Region not found for country code: ${countryCode}`);
  }

  if (cartId) {
    await updateCart({ region_id: region.id });
    const cartCacheTag = await getCacheTag('carts');
    revalidateTag(cartCacheTag);
  }

  const regionCacheTag = await getCacheTag('regions');
  revalidateTag(regionCacheTag);

  const productsCacheTag = await getCacheTag('products');
  revalidateTag(productsCacheTag);

  redirect(`/${countryCode}${currentPath}`);
}

export async function listCartOptions() {
  const cartId = await getCartId();
  const headers = {
    ...(await getAuthHeaders()),
  };
  const next = {
    ...(await getCacheOptions('shippingOptions')),
  };

  return await sdk.client.fetch<{
    shipping_options: HttpTypes.StoreCartShippingOption[];
  }>('/store/shipping-options', {
    query: { cart_id: cartId },
    next,
    headers,
    cache: 'no-cache',
  });
}

export async function updateAutoshipData(
  autoship_interval: AutoshipInterval,
  autoship_period: number,
) {
  const cartId = getCartId();

  if (!cartId) {
    throw new Error('No existing cart found when placing an order');
  }

  await updateCart({
    metadata: {
      autoship_interval,
      autoship_period,
    },
  });

  revalidateTag('cart');
}
