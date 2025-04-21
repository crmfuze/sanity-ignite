'use client';
import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Image } from 'next-sanity/image';
import { urlForImage } from '@/lib/sanity/client/utils';
import { ProductPageQueryResult } from '@/sanity.types';

type SupplementCardProps = {
  ingredients: NonNullable<ProductPageQueryResult>['ingredients'];
};

const SupplementCard: React.FC<SupplementCardProps> = ({ ingredients }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleClick = (index: number) => {
    setSelectedIndex(index);
  };

  if (!ingredients) {
    return;
  }

  const selectedItem = ingredients[selectedIndex];

  return (
    <div className="px-4 lg:px-20 py-12 mt-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg shadow-md">
      <div className="flex flex-col-reverse lg:flex-row-reverse gap-10">
        <div className="flex flex-col gap-5 w-full lg:w-1/3 lg:order-2">
          {ingredients.map((ingredient, index) => (
            <div
              key={index}
              onClick={() => handleClick(index)}
              className={`cursor-pointer p-4 rounded-lg transition duration-300 ease-in-out ${
                selectedIndex === index
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-white hover:bg-purple-100'
              }`}
            >
              <h1
                className={`text-lg font-semibold ${selectedIndex === index ? 'text-white' : 'text-gray-800'}`}
              >
                {ingredient.heading}
              </h1>
            </div>
          ))}
          <div>
            <h2>
              *These statements have not been evaluated by the Food and Drug Administration. (FDA)
            </h2>
            <h2>This product is not intended to diagnose, treat, cure or prevent any disease.</h2>
          </div>
        </div>

        <div className="flex bg-white rounded-lg shadow-lg flex-col px-6 pt-4 pb-10 lg:w-2/3 lg:order-1">
          {selectedItem.image && (
            <Image
              className="mt-4 w-full rounded-xl"
              src={urlForImage(selectedItem.image)?.url() as string}
              alt={selectedItem.name || ''}
              width={198}
              height={672}
            />
          )}
          <h2 className="text-3xl font-bold text-[#9B37AE] pt-4">{selectedItem.name}</h2>
          <p className="mt-4 text-gray-600 text-md font-medium">{selectedItem.description}</p>
          <h2 className="text-3xl font-bold text-[#9B37AE] pt-4">Benefits:</h2>
          <ul className="mt-6 flex flex-col gap-6">
            {selectedItem.benefits?.map((benefit, index) => (
              <div key={index} className="flex gap-3 items-center">
                <Check className="bg-[#9B37AE] rounded-full font-bold p-1 text-white text-lg" />
                <h2 className="text-gray-800">{benefit?.description}</h2>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SupplementCard;
