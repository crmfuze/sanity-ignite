/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';

export function useWeglotLanguage() {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');

  useEffect(() => {
    const detectLanguageChange = () => {
      if (typeof window !== 'undefined' && (window as any)?.Weglot) {
        const weglot = (window as any).Weglot;
        
        // Get current language from Weglot
        const getCurrentLang = () => {
          try {
            return weglot.getCurrentLang() || 'en';
          } catch (e) {
            return 'en';
          }
        };

        // Set initial language
        setCurrentLanguage(getCurrentLang());

        // Listen for language changes
        const handleLanguageChange = () => {
          const newLang = getCurrentLang();
          setCurrentLanguage(newLang);
        };

        // Weglot fires this event when language changes
        weglot.on('languageChanged', handleLanguageChange);

        // Alternative: Watch for URL changes (Weglot changes URL)
        const observer = new MutationObserver(() => {
          const newLang = getCurrentLang();
          if (newLang !== currentLanguage) {
            setCurrentLanguage(newLang);
          }
        });

        observer.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ['lang'],
        });

        return () => {
          if (weglot?.off) {
            weglot.off('languageChanged', handleLanguageChange);
          }
          observer.disconnect();
        };
      }
    };

    // Check if Weglot is already loaded
    if ((window as any)?.Weglot) {
      detectLanguageChange();
    } else {
      // Wait for Weglot to load
      const interval = setInterval(() => {
        if ((window as any)?.Weglot) {
          clearInterval(interval);
          detectLanguageChange();
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [currentLanguage]);

  return currentLanguage;
}