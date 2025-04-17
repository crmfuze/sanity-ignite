import Card from '../modules/Card';
import { CardGridSection } from './types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '../ui/carousel';

import { useState, useEffect } from 'react';

export default function CardGrid({
  section: { heading, subtitle, cards },
}: {
  section: CardGridSection;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
    };

    api.on('select', handleSelect);

    return () => {
      api.off('select', handleSelect);
    };
  }, [api]);

  return (
    <section className="content-container py-12">
      {/* Heading */}
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h2 className="font-inter font-bold lg:text-[45px] lg:leading-[55px] md:text-[35px] md:leading-[40px] text-[30px] leading-[35px] tracking-[0px] mb-8">
          {heading}
        </h2>
        <p className="text-[#434343] font-poppins font-normal text-[20px] leading-[24px] tracking-[0px] ">
          {subtitle}
        </p>
      </div>
      {/* Desktop Carousel */}
      <div className="hidden md:block">
        <Carousel opts={{ align: 'center' }} className="w-full">
          <CarouselContent>
            {cards?.map((card, index) => (
              <CarouselItem key={index} className="basis-1/3">
                <Card card={card} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      {/* Mobile Version */}
      <div className="md:hidden px-8">
        <Carousel setApi={setApi} opts={{ align: 'center' }} className="w-full">
          <CarouselContent>
            {cards?.map((card, index) => (
              <CarouselItem key={index} className="basis-full">
                <Card card={card} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="py-2 text-center text-sm text-muted-foreground">
          {current} of {count}
        </div>
      </div>
    </section>
  );
}
