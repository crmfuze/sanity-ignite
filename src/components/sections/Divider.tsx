import { DividerSection } from './types';
import { Button } from '../ui/button';
import Link from 'next/link';
import { getLinkByLinkObject } from '@/lib/links';

export default function Divider({ section }: { section: DividerSection }) {
  const { heading, description, button } = section;

  return (
    <div className="flex items-center justify-center bg-custom mx-auto py-12 px-4 sm:px-6">
      <div className="main-container">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Left Side */}
          <div className="text-center lg:text-left lg:w-1/2">
            <h1 className="font-bold text-white mb-4 font-inter text-3xl md:text-4xl lg:text-5xl leading-tight">
              {heading}
            </h1>
            <p className="text-white lg:mb-8 mb-4 font-poppins text-base md:text-lg lg:text-xl leading-relaxed">
              {description}
            </p>
          </div>

          {/* Right Side: Button */}
          <div className="lg:w-1/2 flex justify-center lg:justify-end mt-8 lg:mt-0">
            <Button asChild variant={button?.variant} size={'xl'} key={button?._key}>
              <Link
                href={button?.link ? getLinkByLinkObject(button.link) || '' : ''}
                target={button?.link?.openInNewTab ? '_blank' : '_self'}
              >
                {button?.text}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
