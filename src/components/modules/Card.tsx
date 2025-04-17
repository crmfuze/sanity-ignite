import PortableText from './PortableText';
import { type PortableTextBlock } from 'next-sanity';
import { CardGridSection } from '../sections/types';

export default function Card({
  card: { heading, subtitle, content },
}: {
  card: NonNullable<CardGridSection['cards']>[number];
}) {
  return (
    <div className="bg-[#FDF5FF] p-6 rounded-2xl text-left flex flex-col md:flex-row items-start gap-6">
      {/* Left Side - Circle */}
      <div className="w-16 h-16 bg-[#9B37AE] rounded-full flex-shrink-0"></div>

      {/* Right Side - Text Content */}
      <div className="flex flex-col w-full">
        <h3 className="text-[#434343] font-poppins font-semibold text-[16px] leading-[24px] tracking-[0px]">
          {heading}
        </h3>
        <p className="text-[#434343] font-poppins font-normal text-[16px] leading-[24px] tracking-[0px] ">
          {subtitle}
        </p>
        {/* Content  */}
        <div className="mt-8">
          <div className="md:-ml-20 text-[#434343] font-poppins font-normal text-[13px] leading-[23px] tracking-[0px]">
            <PortableText className="text-xl" value={content as PortableTextBlock[]} />
          </div>
        </div>
      </div>
    </div>
  );
}
