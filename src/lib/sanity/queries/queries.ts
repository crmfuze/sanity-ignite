import { defineQuery } from 'next-sanity';
import {
  postFragment,
  pageFragment,
  menuFragment,
  categoryFragment,
  personFragment,
  postCardFragment,
  pageBuilderFragment,
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
  ${pageFragment}
}`);

export const blogPageQuery = defineQuery(`*[_type == "blogPage"][0]{
  _id,
  _type,
  ...,
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

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    ${postFragment}
  }
`);

export const categoryQuery = defineQuery(`
  *[_type == "category" && slug.current == $slug] [0] {
    ${categoryFragment}
  }
`);

export const personQuery = defineQuery(`
  *[_type == "person" && slug.current == $slug] [0] {
    ${personFragment}
  }
`);

export const postPagesSlugs = defineQuery(`
  *[_type == "post" && defined(slug.current)][0..$limit].slug.current
`);

export const categorySlugs = defineQuery(`
  *[_type == "category" && defined(slug.current)][0..$limit].slug.current
`);

export const personSlugs = defineQuery(`
  *[_type == "person" && defined(slug.current)][0..$limit].slug.current
`);

export const postsArchiveQuery = defineQuery(`
  {
    "allResults": *[
      _type == "post"
      &&
      (
        !defined( $filters.categorySlug ) || references(*[_type == "category" && slug.current == $filters.categorySlug]._id)
      )
      &&
      (
        !defined( $filters.personSlug ) || references(*[_type == "person" && slug.current == $filters.personSlug]._id)
      )
      //
      // Add more filter here if needed
      //
      // The filter value should be passed as a property of the $filter parameter
      //
      // (
      //   !defined( $filters.anotherFilter ) || fieldname == $filters.anotherFilter)
      // )
    ] | order(_createdAt desc, _id desc)
  }
  {
    "total": count(allResults),
    "results": allResults[$from..$to] {
      ${postCardFragment}
    }
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
  patnerProgramsLinks {
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
