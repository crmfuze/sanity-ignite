import { Image } from 'next-sanity/image';
import { urlForImage } from '@/lib/sanity/client/utils';
import { type PortableTextBlock } from 'next-sanity';
import PortableText from '@/components/modules/PortableText';
import ButtonsGroup from '../../modules/ButtonsGroup';
import type { HeroSection } from '../types';

export default function SimpleHero({ section }: { section: HeroSection }) {
  return (
    <section className="bg-[#FEFAFF] py-12">
      <div className="content-container flex flex-col-reverse lg:flex-row  items-center gap-4  ">
        {/* Left Content */}
        <div className="max-w-[600px] w-full text-center lg:text-left ">
          <h2 className="text-[#9B37AE] font-inter font-bold md:text-[45px] md:leading-[55px] text-[30px] leading-[40px] tracking-normal">
            {section?.heading}
          </h2>
          <PortableText
            className="mt-4 text-[#434343] text-sm md:text-[18px] md:leading-[33px] font-normal tracking-normal font-['Poppins']"
            value={section.text as PortableTextBlock[]}
          />
          {section?.buttons && section?.buttons.length ? (
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {section?.buttons.length > 1 && (
                <ButtonsGroup className="w-full md:w-auto" buttons={section?.buttons} />
              )}
            </div>
          ) : null}
        </div>

        {/* Right Image */}
        <div className="max-w-[722px] w-full flex justify-center ">
          {section.image?.asset && (
            <Image
              src={urlForImage(section.image)?.url() as string}
              alt="section?.image?.alt || ''"
              width={722}
              height={444}
              className="w-full"
            />
          )}
        </div>
      </div>
    </section>
  );
}
