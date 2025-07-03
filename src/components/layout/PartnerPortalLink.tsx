'use client';

import { mlmsoftSSO } from '@/lib/medusa/data/distributor';
import { useState } from 'react';

interface PartnerPortalLinkProps {
  className?: string;
  children: React.ReactNode;
}

export default function PartnerPortalLink({ className, children }: PartnerPortalLinkProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const ssoResponse = await mlmsoftSSO();
      
      if ('mlmsoft_access_token' in ssoResponse && 'mlmsoft_refresh_token' in ssoResponse) {
        const { mlmsoft_access_token, mlmsoft_refresh_token } = ssoResponse;
        const authUrl = `https://ambrosia.my-office.app/#auth(${mlmsoft_access_token}, ${mlmsoft_refresh_token}, undefined)`;
        window.open(authUrl, '_blank');
      } else {
        // No auth, open base URL
        window.open('https://ambrosia.my-office.app/', '_blank');
      }
    } catch {
      // Error getting auth, open base URL
      window.open('https://ambrosia.my-office.app/', '_blank');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <a
      href="https://ambrosia.my-office.app/"
      onClick={handleClick}
      className={className}
      style={{ opacity: isLoading ? 0.7 : 1 }}
    >
      {children}
    </a>
  );
}