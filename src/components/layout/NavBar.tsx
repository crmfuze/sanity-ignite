'use client';

import Image from 'next/image';
import { useState, Suspense } from 'react';
import { ShoppingBag, User, Menu, X } from 'lucide-react';
import { SettingsQueryResult } from '@/sanity.types';
import { getLinkByLinkObject } from '@/lib/links';
import { urlForImage } from '@/lib/sanity/client/utils';
import LocalizedClientLink from '../modules/common/components/localized-client-link';
import { HttpTypes } from '@medusajs/types';
import CartDropdown from '../modules/layout/components/cart-dropdown';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

export default function NavBar({
  logo,
  menuItems,
  cart,
}: {
  logo: NonNullable<NonNullable<SettingsQueryResult>['logo']>;
  menuItems: NonNullable<NonNullable<SettingsQueryResult>['menu']>;
  cart?: HttpTypes.StoreCart | null;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md relative z-10">
      <div className="content-container">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <LocalizedClientLink href="/">
              {logo?.asset && (
                <Image
                  src={urlForImage(logo)?.width(150).url() as string}
                  alt={logo?.alt || ''}
                  width={150}
                  height={50}
                  className="object-contain"
                />
              )}
            </LocalizedClientLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-6 items-center">
            <NavigationMenu>
              <NavigationMenuList>
                {menuItems.map((item) => (
                  <NavigationMenuItem key={item._key} className="hover:text-[#9B37AE]">
                    {item.childMenu ? (
                      // Dropdown menu for items with children
                      <>
                        <NavigationMenuTrigger className={cn(navigationMenuTriggerStyle())}>
                          {item.text}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="p-1 w-[200px]">
                            {item.childMenu.map((child) => (
                              <NavigationMenuLink key={child._key} asChild>
                                <LocalizedClientLink
                                  href={child.link ? getLinkByLinkObject(child.link) || '#' : '#'}
                                  className="block p-2 hover:bg-gray-100 hover:text-[#9B37AE] rounded-md"
                                  {...(child.link?.openInNewTab
                                    ? { target: '_blank', rel: 'noopener noreferrer' }
                                    : {})}
                                >
                                  {child.text}
                                </LocalizedClientLink>
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      // Simple link for items without children
                      <NavigationMenuLink asChild>
                        <LocalizedClientLink
                          href={item.link ? getLinkByLinkObject(item.link) || '#' : '#'}
                          className={cn(navigationMenuTriggerStyle(), 'cursor-pointer')}
                          {...(item.link?.openInNewTab
                            ? { target: '_blank', rel: 'noopener noreferrer' }
                            : {})}
                        >
                          {item.text}
                        </LocalizedClientLink>
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Account and Cart */}
          <div className="hidden lg:flex items-center gap-x-6 h-full">
            <div className="flex items-center space-x-4">
              <LocalizedClientLink
                className="hover:text-ui-fg-base"
                href="/account"
                data-testid="nav-account-link"
              >
                <User className="h-6 w-6 text-[#434343] hover:text-[#9B37AE] cursor-pointer" />
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-ui-fg-base flex gap-2"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  <div className="flex items-center text-[#434343] hover:text-[#9B37AE] cursor-pointer">
                    <ShoppingBag className="h-6 w-6" />
                    <span className="ml-1">(0)</span>
                  </div>
                </LocalizedClientLink>
              }
            >
              <CartDropdown cart={cart} />
            </Suspense>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              className="outline-none mobile-menu-button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Overlay) */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? 'max-h-screen' : 'max-h-0'
        } lg:hidden absolute top-16 left-0 w-full bg-white shadow-md z-20`}
      >
        <ul className="px-2 pt-2 pb-3 space-y-2">
          {/* Navigation Links */}
          {menuItems.map((item) => (
            <li key={item._key}>
              <LocalizedClientLink
                href={item.link ? getLinkByLinkObject(item.link) || '#' : '#'}
                className="block hover:bg-gray-200 px-3 py-2 rounded-md font-poppins font-semibold text-[14px] leading-[21px] tracking-[0px] text-[#434343] hover:text-[#9B37AE] hover:underline"
                onClick={() => setIsMobileMenuOpen(false)}
                {...(item.link?.openInNewTab
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                {item.text}
              </LocalizedClientLink>
            </li>
          ))}

          {/* Flag and Icons */}
          <li>
            <LocalizedClientLink
              href="/account"
              className="block hover:bg-gray-200 px-3 py-2 rounded-md font-poppins font-semibold text-[14px] leading-[21px] tracking-[0px] text-[#434343] hover:text-[#9B37AE] hover:underline"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Account
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/cart"
              className="block hover:bg-gray-200 px-3 py-2 rounded-md font-poppins font-semibold text-[14px] leading-[21px] tracking-[0px] text-[#434343] hover:text-[#9B37AE] hover:underline"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Cart
            </LocalizedClientLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
