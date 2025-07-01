import { retrieveCart } from '@/lib/medusa/data/cart';
import { retrieveCustomer } from '@/lib/medusa/data/customer';
import PaymentWrapper from '@/components/modules/checkout/components/payment-wrapper';
import CheckoutForm from '@/components/modules/checkout/templates/checkout-form';
import CheckoutSummary from '@/components/modules/checkout/templates/checkout-summary';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { listCartShippingMethods } from '@/lib/medusa/data/fulfillment';
import { listCartPaymentMethods } from '@/lib/medusa/data/payment';

export const metadata: Metadata = {
  title: 'Checkout',
};

export default async function Checkout() {
  const cart = await retrieveCart();

  if (!cart) {
    return notFound();
  }

  const customer = await retrieveCustomer();
  const shipping_methods = await listCartShippingMethods(cart.id);
  const payment_methods = await listCartPaymentMethods(cart.region?.id ?? '');

  return (
    <div className="grid grid-cols-1 small:grid-cols-[1fr_416px] content-container gap-x-40 py-12">
      <PaymentWrapper cart={cart}>
        <CheckoutForm
          cart={cart}
          customer={customer}
          shipping_methods={shipping_methods}
          payment_methods={payment_methods}
        />
      </PaymentWrapper>
      <CheckoutSummary cart={cart} />
    </div>
  );
}
