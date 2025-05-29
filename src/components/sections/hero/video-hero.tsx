import React from 'react';
import { stegaClean } from 'next-sanity';
import { HeroSection } from '../types';
import Video from '@/components/modules/Video';
import ButtonsGroup from '../../modules/ButtonsGroup';

export default function VideoHero({ section }: { section: HeroSection }) {
  const contentPosition = stegaClean(section.contentPosition) || 'right';
  const isContentLeft = contentPosition === 'left';
  
  console.log('VideoHero contentPosition:', contentPosition, 'isContentLeft:', isContentLeft);
  
  const videoSection = (
    <div className="w-full lg:w-2/3">
      {section.video?.url && (
        <div className="shadow-lg rounded-2xl overflow-hidden mb-0">
          <Video 
            src={section.video.url} 
            spanishSrc={section.video.spanishUrl} 
            controls={true} 
            aspectRatio="16/9" 
          />
        </div>
      )}
    </div>
  );

  const contentSection = (section.heading || (section?.buttons && section?.buttons.length > 0)) && (
    <div className="w-full lg:w-1/3 flex flex-col justify-center bg-[#FEFAFF] rounded-2xl p-8 lg:p-10">
      {section.heading && (
        <h2 className="text-3xl font-bold leading-tight tracking-tighter lg:text-4xl mb-6 text-gray-900">
          {section.heading}
        </h2>
      )}

      {/* Buttons */}
      {section?.buttons && section?.buttons.length > 0 && (
        <div className="flex flex-col gap-4">
          <ButtonsGroup className="w-full" buttons={section.buttons} />
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white py-16">
      <div className="content-container">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch">
          {isContentLeft ? (
            <>
              {contentSection}
              {videoSection}
            </>
          ) : (
            <>
              {videoSection}
              {contentSection}
            </>
          )}
        </div>
      </div>
    </div>
  );
}