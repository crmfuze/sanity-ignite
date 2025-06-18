import { type HttpTypes } from '@medusajs/types';

import { listCartShippingMethods } from '@/lib/medusa/data/fulfillment';
import { listCartPaymentMethods } from '@/lib/medusa/data/payment';
import Addresses from '@/components/modules/checkout/components/addresses';
import Payment from '@/components/modules/checkout/components/payment';
import Review from '@/components/modules/checkout/components/review';
import Shipping from '@/components/modules/checkout/components/shipping';

export default async function CheckoutForm({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null;
  customer: HttpTypes.StoreCustomer | null;
}) {
  if (!cart) {
    return null;
  }

  const requiresShipping = cart.items?.some((item) => item.requires_shipping) ?? false;
  const shippingMethods = requiresShipping ? await listCartShippingMethods(cart.id) : [];
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? '');

  if (!paymentMethods || (requiresShipping && !shippingMethods)) {
    return null;
  }

  return (
    <div className="w-full grid grid-cols-1 gap-y-8">
      <Addresses cart={cart} customer={customer} requiresShipping={requiresShipping} />

      {requiresShipping && (
        <Shipping cart={cart} availableShippingMethods={shippingMethods} />
      )}

      <Payment cart={cart} availablePaymentMethods={paymentMethods} />

      <Review cart={cart} />
    </div>
  );
}
