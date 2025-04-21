import { ProductPageQueryResult } from '@/sanity.types';
import { Check } from 'lucide-react';
import SupplementCard from '../../components/supplement-card';
import { StoreProduct } from '@medusajs/types';
import ImageGallery from '../../components/image-gallery';

type ProductIngredientsProps = {
  product: StoreProduct;
  ingredients: NonNullable<ProductPageQueryResult>['ingredients'];
};

export default async function ProductIngredients({
  product,
  ingredients,
}: ProductIngredientsProps) {
  return (
    <>
      <div className="lg:mt-48 p-4 lg:p-0 block lg:flex justify-center items-center gap-10 ">
        <div className="lg:w-1/2 w-full lg:block hidden  lg:max-w-full h-auto">
          <ImageGallery images={product?.images || []} />
        </div>
        <div className="w-full lg:w-[50%] mt-10 lg:mt-0">
          <h2 className="text-3xl text-[#9B37AE] font-bold leading-7">Main Ingredients:</h2>
          <div className="flex flex-col gap-6 mt-5">
            {ingredients?.map((ingredient) => (
              <div key={ingredient._key} className="flex gap-3 px-5 items-center pb-2 border-b-2">
                <Check className="bg-[#9B37AE] rounded-full font-bold p-1 text-white text-lg" />
                <h2 className="text-xl font-bold text-[#1E1E1E]">{ingredient.name}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <SupplementCard ingredients={ingredients} />
      </div>
    </>
  );
}
