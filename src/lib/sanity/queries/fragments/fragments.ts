export const twitterFragment = /* groq */ `
  _type,
  site,
  creator,
  cardType,
  handle,
`;

export const imageFragment = /* groq */ `
  _type,
  crop {
    _type,
    right,
    top,
    left,
    bottom
  },
  hotspot {
    _type,
    x,
    y,
    height,
    width,
  },
  asset->{...},
`;

export const openGraphFragment = /* groq */ `
  _type,
  siteName,
  url,
  description,
  title,
  image {
    ${imageFragment}
  },
`;

export const metaAttributesFragment = /* groq */ `
  _type,
  attributeValueString,
  attributeType,
  attributeKey,
  attributeValueImage {
    ${imageFragment}
  },
`;

export const additionalMetaTagFragment = /* groq */ `
  _key,
  _type,
  metaAttributes[] {
    ${metaAttributesFragment}
  },
`;

export const seoFragment = /* groq */ `
  _type,
  metaTitle,
  noIndex,
  seoKeywords,
  metaDescription,
  metaImage{
    ${imageFragment}
  },
  additionalMetaTags[]{
    ${additionalMetaTagFragment}
  },
  openGraph {
    ${openGraphFragment}
  },
  twitter {
    ${twitterFragment}
  }
`;

export const linkFragment = /* groq */ `
  _type,
  type,
  openInNewTab,
  external,
  href,
  internal->{
    _type,
    _id,
    "slug": slug.current
  },
`;

const customLinkFragment = /* groq */ `
  ...customLink{
    ${linkFragment}
  },
`;

const markDefsFragment = /* groq */ `
  markDefs[]{
    ...,
    ${customLinkFragment}
  },
`;

const contentFragment = /* groq */ `
  content[]{
    ...,
    ${markDefsFragment}
  },
`;

export const buttonFragment = /* groq */ `
  _key,
  _type,
  variant,
  text,
  link {
    ${linkFragment}
  },
`;

export const buttonsFragment = /* groq */ `
  buttons[]{
    ${buttonFragment}
  },
`;

export const heroSectionFragment = /* groq */ `
  _type,
  mediaType,
  heading,
  text,
  image,
  largeImage,
  video,
  contentPosition,
  ${buttonsFragment}
`;

export const mediaTextSectionFragment = /* groq */ `
  _type,
  heading,
  text,
  media,
  imagePosition,
  button {${buttonFragment}}
`;

export const productFragment = /* groq */ `
  _id,
  _type,
  title,
  ingredients[]{
    ingredient {
      name,
      heading,
      description,
      image,
      benefits[] {
        description
      }
    }
  },
  specs[]{
    lang,
    title,
    content
  },
  addons{
    title,
    products[]->{
      _id,
      _type,
      title,
    }
  }
`;

export const dividerSectionFragment = /* groq */ `
  _type,
  heading,
  description,
  button {${buttonFragment}},
`;

export const ctaSectionFragment = /* groq */ `
  _type,
  heading,
  text,
  ${buttonsFragment}
`;

export const subscribeSectionFragment = /* groq */ `
  _type,
  heading,
  text
`;

export const cardGridFragment = /* groq */ `
  _type,
  heading,
  subtitle,
  ${contentFragment}
  icon,
`;

export const blockContentSectionFragment = /* groq */ `
  _type,
  content[]{
    ...,
    ${markDefsFragment}
  },
`;

export const cardGridsSectionFragment = /* groq */ `
  _type,  
  heading,
  subtitle,
  cards[]{
    ${cardGridFragment}
  },
`;

export const featuredProductsSectionFragment = /* groq */ `
  _type,
  title,
  products[]->{
    ${productFragment}
  }
`;

export const pageBuilderFragment = /* groq */ `
  pageSections[]{
    ...,
    _key,
    _type,
    _type == 'blockContentSection' => {${blockContentSectionFragment}},
    _type == 'cardGrid' => {${cardGridsSectionFragment}},
    _type == 'cta' => {${ctaSectionFragment}},
    _type == 'divider' => {${dividerSectionFragment}},
    _type == 'hero' => {${heroSectionFragment}},
    _type == 'mediaText' => {${mediaTextSectionFragment}},
    _type == 'subscribe' => {${subscribeSectionFragment}},
    _type == 'featuredProducts' => {${featuredProductsSectionFragment}}
  },
`;

export const menuItemFragment = /* groq */ `
  _type,
  _key,
  text,
  type,
  link {
    ${linkFragment}
  },
`;

export const menuFragment = /* groq */ `
  menu[]{
    ${menuItemFragment}
    childMenu[]{
      ${menuItemFragment}
    }
  }
`;

export const pageFragment = /* groq */ `
  ${pageBuilderFragment}
  seo {
    ${seoFragment}
  },
`;

export const homepageHeroFragment = /* groq */ `
  homePageHero {
    image,
    heading,
    subtitle,
    video
  }
`;

export const productVideoFragment = /* groq */ `
  productVideoSection {
    title,
    thumbnailUrl,
    heading, 
    subheading,
    video
  }
`;