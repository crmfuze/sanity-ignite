import { CogIcon, HomeIcon, PackageIcon } from '@sanity/icons';
import type { StructureResolver } from 'sanity/structure';

/**
 * Structure builder is useful whenever you want to control how documents are grouped and
 * listed in the studio or for adding additional in-studio previews or content to documents.
 * Learn more: https://www.sanity.io/docs/structure-builder-introduction
 */

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Website Content')
    .items([
      S.listItem()
        .title('Home')
        .child(S.document().schemaType('homePage').documentId('homePage'))
        .icon(HomeIcon),
      S.documentTypeListItem('product').title('Products').icon(PackageIcon),
      // Filter out "AI Assist Context" and "Settings" content from the list of content types
      ...S.documentTypeListItems().filter((listItem) => {
        const id = listItem.getId();
        return typeof id !== 'undefined'
          ? ![
              'settings',
              'homePage',
              'assist.instruction.context',
              'footer',
              'product',
            ].includes(id)
          : false;
      }),
      S.listItem()
        .title('Site Settings')
        .child(
          S.list()
            .title('Settings Documents')
            .items([
              S.listItem()
                .title('Menu & SEO')
                .child(S.document().schemaType('settings').documentId('siteSettings')),
              S.listItem()
                .title('Footer')
                .child(S.document().schemaType('footer').documentId('footer')),
            ]),
        )
        .icon(CogIcon),
    ]);
