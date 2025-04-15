import { retrieveCart } from "@/lib/medusa/data/cart";

import CartDropdown from "../cart-dropdown";

export default async function CartButton() {
  const cart = await retrieveCart().catch(() => null);

  return <CartDropdown cart={cart} />;
}
