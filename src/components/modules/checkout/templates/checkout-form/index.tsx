'use client';

import { type HttpTypes } from '@medusajs/types';

import Addresses from '@/components/modules/checkout/components/addresses';
import Payment from '@/components/modules/checkout/components/payment';
import Review from '@/components/modules/checkout/components/review';
import Shipping from '@/components/modules/checkout/components/shipping';

export default function CheckoutForm({
  cart,
  customer,
  shipping_methods,
  payment_methods,
}: {
  cart: HttpTypes.StoreCart | null;
  customer: HttpTypes.StoreCustomer | null;
  shipping_methods: HttpTypes.StoreCartShippingOption[] | null;
  payment_methods: HttpTypes.StorePaymentProvider[] | null;
}) {
  if (!cart) {
    return null;
  }

  const requiresShipping = cart.items?.some((item) => item.requires_shipping) ?? false;

  if (!payment_methods || (requiresShipping && !shipping_methods)) {
    return null;
  }

  return (
    <div className="w-full grid grid-cols-1 gap-y-8">
      <Addresses cart={cart} customer={customer} requiresShipping={requiresShipping} />

      {requiresShipping && <Shipping cart={cart} availableShippingMethods={shipping_methods} />}

      <Payment cart={cart} availablePaymentMethods={payment_methods} />

      <Review cart={cart} />
    </div>
  );
}
