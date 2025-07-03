import { defineQuery } from 'next-sanity';
import {
  pageFragment,
  menuFragment,
  pageBuilderFragment,
  homepageHeroFragment,
} from './fragments/fragments';

export const settingsQuery = defineQuery(`*[_type == "settings" && _id == "siteSettings"][0]{
  title,
  logo,
  description,
  ${menuFragment}
}`);

export const homePageQuery = defineQuery(`*[_type == "homePage"][0]{
  _id,
  _type,
  ...,
  ${homepageHeroFragment},
  ${pageFragment}
}`);

export const getPageQuery = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    ${pageFragment}
  }
`);

export const productPageQuery = defineQuery(`
    *[_type == 'product' && pathname.current == ("/products/" + $handle)][0] {
    ...,
    ${pageBuilderFragment}
}`);

export const getSitemapQuery = defineQuery(`
  *[((_type in ["page", "post"] && defined(slug.current)) || (_type == "homePage")) && seo.noIndex != true]{
    "href": select(
      _type == "page" => "/" + slug.current,
      _type == "post" => "/posts/" + slug.current,
      _type == "homePage" => "/",
      slug.current
    ),
    _updatedAt
  }
`);

export const footerQuery = defineQuery(`*[_type == "footer"][0] {
  logo {
    asset->{
      url
    },
    alt
  },
  companyLinks {
    sectionTitle,
    links[] {
      text,
      url,
      isExternal
    }
  },
  ourProductsLinks {
    sectionTitle,
    links[] {
      text,
      url,
      isExternal
    }
  },
  partnerProgramsLinks {
    sectionTitle,
    links[] {
      text,
      url,
      isExternal
    }
  },
  legalLinks {
    sectionTitle,
    links[] {
      text,
      url,
      isExternal
    }
  },
  socialLinks {
    sectionTitle,
    links[] {
      image {
        asset-> {
          url
        },
        alt
      },
      url,
      isExternal
    }
  },
  ctaButton {
    text,
    url,
    variant
  },
  visaImage {
    asset-> {
      url
    }
  },
  copyrightText {
    line1,
    line2,
    line3
  }
}
`);
