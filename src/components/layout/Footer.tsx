// import Logo from '../icons/Logo';
import { sanityFetch } from '@/lib/sanity/client/live';
import { footerQuery } from '@/lib/sanity/queries/queries';
// import { Button } from '../ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default async function Footer() {
  const { data: footerData } = await sanityFetch({
    query: footerQuery,
  });

  if (!footerData) {
    return null;
  }

  return (
    <footer className="bg-[#F8F8F8] text-[#434343]">
      <div className="content-container pt-12 pb-8">
        {/* Logo */}
        <div className="flex justify-start mb-4">
          <Image
            src={footerData?.logo?.asset?.url || ''}
            alt={footerData?.logo?.alt || ''}
            width={191}
            height={77}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Footer Sections */}

          <div>
            <h3 className="font-inter font-semibold text-[13px] leading-[30px] tracking-[0px] mb-2">
              {footerData?.companyLinks?.sectionTitle}
            </h3>
            <ul className="space-y-1 font-poppins font-normal text-[13px] leading-[30px] tracking-[0px] text-[#434343]">
              {footerData?.companyLinks?.links?.map((link, i: number) =>
                link.text && link.url ? (
                  <li key={i}>
                    <Link href={link.url} target={link.isExternal ? '_blank' : '_self'}>
                      {link.text}
                    </Link>
                  </li>
                ) : null,
              )}
            </ul>
          </div>
          <div>
            <h3 className="font-inter font-semibold text-[13px] leading-[30px] tracking-[0px] mb-2">
              {footerData?.ourProductsLinks?.sectionTitle}
            </h3>
            <ul className="space-y-1 font-poppins font-normal text-[13px] leading-[30px] tracking-[0px] text-[#434343]">
              {footerData?.ourProductsLinks?.links?.map((link, i: number) =>
                link.text && link.url ? (
                  <li key={i}>
                    <Link href={link.url} target={link.isExternal ? '_blank' : '_self'}>
                      {link.text}
                    </Link>
                  </li>
                ) : null,
              )}
            </ul>
          </div>
          <div>
            <h3 className="font-inter font-semibold text-[13px] leading-[30px] tracking-[0px] mb-2">
              {footerData?.patnerProgramsLinks?.sectionTitle}
            </h3>
            <ul className="space-y-1 font-poppins font-normal text-[13px] leading-[30px] tracking-[0px] text-[#434343]">
              {footerData?.patnerProgramsLinks?.links?.map((link, i: number) =>
                link.text && link.url ? (
                  <li key={i}>
                    <Link href={link.url} target={link.isExternal ? '_blank' : '_self'}>
                      {link.text}
                    </Link>
                  </li>
                ) : null,
              )}
            </ul>
          </div>
          <div>
            <h3 className="font-inter font-semibold text-[13px] leading-[30px] tracking-[0px] mb-2">
              {footerData?.legalLinks?.sectionTitle}
            </h3>
            <ul className="space-y-1 font-poppins font-normal text-[13px] leading-[30px] tracking-[0px] text-[#434343]">
              {footerData?.legalLinks?.links?.map((link, i: number) =>
                link.text && link.url ? (
                  <li key={i}>
                    <Link href={link.url} target={link.isExternal ? '_blank' : '_self'}>
                      {link.text}
                    </Link>
                  </li>
                ) : null,
              )}
            </ul>
          </div>

          <div className="flex flex-col md:col-span-1 col-span-2 items-end">
            {/* Social Media Icons */}
            <div className="flex justify-end space-x-4 md:mt-4 mt-8">
              {footerData?.socialLinks?.links?.map((link, i: number) =>
                link?.url ? (
                  <Link key={i} href={link.url} target={link.isExternal ? '_blank' : '_self'}>
                    <Image
                      src={link?.image?.asset?.url || ''}
                      alt={link?.image?.alt || ''}
                      width={15}
                      height={15}
                      className="object-contain flex justify-end"
                    />
                  </Link>
                ) : null,
              )}
            </div>

            {/* Visa Image and Copyright */}
            <div className="mt-4 ">
              <Image
                src={footerData?.visaImage?.asset?.url || ''}
                alt="Visa"
                width={176}
                height={27}
                className="object-contain flex justify-end w-full"
              />
              <p className="mt-8 md:text-right text-center">{footerData?.copyrightText?.line1}</p>
              <p className="md:text-right text-center">{footerData?.copyrightText?.line3}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
