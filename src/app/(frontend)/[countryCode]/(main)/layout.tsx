import { retrieveCart } from '@/lib/medusa/data/cart';
import { retrieveCustomer } from '@/lib/medusa/data/customer';
import CartMismatchBanner from '@/components/modules/layout/components/cart-mismatch-banner';

export default async function PageLayout(props: { children: React.ReactNode }) {
  const customer = await retrieveCustomer();
  const cart = await retrieveCart();

  return (
    <>
      {customer && cart && <CartMismatchBanner customer={customer} cart={cart} />}
      {props.children}
    </>
  );
}
