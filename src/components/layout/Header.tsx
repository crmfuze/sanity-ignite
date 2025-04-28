import { sanityFetch } from '@/lib/sanity/client/live';
import { settingsQuery } from '@/lib/sanity/queries/queries';
import { retrieveCart } from '@/lib/medusa/data/cart';
import NavBar from './NavBar';

export default async function Header() {
  const { data: settings } = await sanityFetch({
    query: settingsQuery,
  });

  const cart = await retrieveCart().catch(() => null);

  if (!settings) {
    return null;
  }

  return (
    <header className="relative">
      <NavBar
        logo={settings.logo || { _type: 'image' }}
        menuItems={settings.menu || []}
        cart={cart}
      />
    </header>
  );
}
