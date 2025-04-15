'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { FiMenu, FiX } from 'react-icons/fi';
import { SettingsQueryResult } from '@/sanity.types';
import { getLinkByLinkObject } from '@/lib/links';
import { urlForImage } from '@/lib/sanity/client/utils';

export default function NavBar({
  logo,
  menuItems,
}: {
  logo: NonNullable<NonNullable<SettingsQueryResult>['logo']>;
  menuItems: NonNullable<NonNullable<SettingsQueryResult>['menu']>;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Icons
  const icons = [
    // { icon: FaEnvelope, label: 'Contact' },
    { icon: FaShoppingCart, label: 'Cart' },
    { icon: FaUser, label: 'User' },
  ];

  return (
    <nav className="bg-white shadow-md relative z-10">
      <div className="main-container">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              {logo?.asset && (
                <Image
                  src={urlForImage(logo)?.width(150).height(50).url() as string}
                  alt={logo?.alt || ''}
                  width={150}
                  height={50}
                />
              )}
            </Link>
          </div>

          {/* Nav Links (Desktop) */}
          <div className="hidden lg:flex space-x-6 items-center">
            {menuItems.map((item) => (
              <Link
                key={item._key}
                href={item.link ? getLinkByLinkObject(item.link) || '#' : '#'}
                className="font-poppins font-semibold text-[14px] leading-[21px] tracking-[0px] text-[#434343] hover:text-[#9B37AE] hover:underline"
                {...(item.link?.openInNewTab
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                {item.text}
              </Link>
            ))}
          </div>

          {/* Button and Icons */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Icons with Borders */}
            <div className="flex items-center space-x-4">
              {icons.map((IconComponent, index) => (
                <div
                  key={index}
                  className={`flex items-center ${
                    index !== icons.length - 1 ? 'border-r pr-4 border-gray-300' : ''
                  } ${index !== 0 ? '' : ''}`}
                >
                  <IconComponent.icon className="h-6 w-6 text-[#434343] hover:text-[#9B37AE] cursor-pointer" />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              className="outline-none mobile-menu-button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <FiX className="h-6 w-6 text-gray-700" />
              ) : (
                <FiMenu className="h-6 w-6 text-gray-700" />
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
              <Link
                href={item.link ? getLinkByLinkObject(item.link) || '#' : '#'}
                className="block hover:bg-gray-200 px-3 py-2 rounded-md font-poppins font-semibold text-[14px] leading-[21px] tracking-[0px] text-[#434343] hover:text-[#9B37AE] hover:underline"
                onClick={() => setIsMobileMenuOpen(false)}
                {...(item.link?.openInNewTab
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                {item.text}
              </Link>
            </li>
          ))}

          {/* Flag and Icons */}
          <li>
            <Link
              href="/account"
              className="block hover:bg-gray-200 px-3 py-2 rounded-md font-poppins font-semibold text-[14px] leading-[21px] tracking-[0px] text-[#434343] hover:text-[#9B37AE] hover:underline"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Account
            </Link>
            <Link
              href="/cart"
              className="block hover:bg-gray-200 px-3 py-2 rounded-md font-poppins font-semibold text-[14px] leading-[21px] tracking-[0px] text-[#434343] hover:text-[#9B37AE] hover:underline"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Cart
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
