'use client';

import { useIsPresentationTool } from 'next-sanity/hooks';
import { useEffect } from 'react';

export default function WeglotWrapper() {
  const isPresentationTool = useIsPresentationTool();
  const weglotApiKey = process.env.NEXT_PUBLIC_WEGLOT_API_KEY;
  const weglotScriptId = 'weglot-script';

  useEffect(() => {
    // Only load Weglot if we're not in the presentation tool
    if (isPresentationTool === false) {
      // Check if script already exists
      if (!document.getElementById(weglotScriptId)) {
        const script = document.createElement('script');
        script.src = 'https://cdn.weglot.com/weglot.min.js';
        script.id = weglotScriptId;
        script.async = true;
        script.onload = () => {
          if ((window as any)?.Weglot) {
            (window as any).Weglot.initialize({
              api_key: weglotApiKey,
            });
          }
        };
        document.head.appendChild(script);
      }
    }

    // Clean up function runs when component unmounts or when dependencies change
    return () => {
      const script = document.getElementById(weglotScriptId);
      if (script) {
        script.remove();
      }

      // Clean up Weglot instance if it exists
      if ((window as any)?.Weglot) {
        try {
          // Remove Weglot elements
          const weglotElements = document.querySelectorAll('.weglot-container, [data-wg-notranslate]');
          weglotElements.forEach(el => el.remove());
          
          // Clear Weglot object
          (window as any).Weglot = undefined;
        } catch (e) {
          console.error('Error cleaning up Weglot:', e);
        }
      }
    };
  }, [isPresentationTool, weglotApiKey]);

  // Component renders nothing - it just manages the Weglot script
  return null;
}
