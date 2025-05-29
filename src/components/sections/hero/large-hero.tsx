import React from 'react';
import { HeroSection } from '../types';
import ButtonsGroup from '../../modules/ButtonsGroup';

export default function LargeHero({
  children,
  section,
}: {
  children: React.ReactNode;
  section: HeroSection;
}) {
  return (
    <div className="relative aspect-[16/9]">
      {children}
      <div className="absolute bottom-0 left-1/2 z-10 flex w-full -translate-x-1/2 flex-col items-center justify-center gap-8 text-balance px-4 py-8 text-center lg:max-w-[680px] lg:py-16">
        <h1 className="text-4xl font-bold leading-tight tracking-tighter lg:text-5xl text-white">
          {section.heading}
        </h1>
        
        {/* Buttons */}
        {section?.buttons && section?.buttons.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ButtonsGroup className="w-full md:w-auto" buttons={section.buttons} />
          </div>
        )}
      </div>
    </div>
  );
}
