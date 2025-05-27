import React from 'react';
import { HeroSection } from '../types';

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
    </div>
  );
}
