'use client';

/**
 * This config is used to configure your Sanity Studio.
 * Learn more: https://www.sanity.io/docs/configuration
 */

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './src/studio/schema';
import { structure } from './src/studio/structure';
import {
  presentationTool,
  defineDocuments,
  defineLocations,
  type DocumentLocation,
} from 'sanity/presentation';
import { assist } from '@sanity/assist';
import { clientEnv } from '@/env/clientEnv';

// Plugins
import { iconPicker } from 'sanity-plugin-icon-picker';

// Define the home location for the presentation tool
const homeLocation = {
  title: 'Home',
  href: '/',
} satisfies DocumentLocation;

// resolveHref() is a convenience function that resolves the URL
// path for different document types and used in the presentation tool.
// It ignores region codes that are added by middleware
function resolveHref(documentType?: string, slug?: string): string | undefined {
  // We don't include region code here as it's handled by middleware
  switch (documentType) {
    case 'page':
      return slug ? `/${slug}` : undefined;
    case 'product':
      return slug ? `/products/${slug}` : undefined;
    default:
      console.warn('Invalid document type:', documentType);
      return undefined;
  }
}

// Main Sanity configuration
export default defineConfig({
  basePath: '/studio',
  name: 'default',
  title: 'Ambrosia Global Studio',
  projectId: clientEnv.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: clientEnv.NEXT_PUBLIC_SANITY_DATASET,
  plugins: [
    // Presentation tool configuration for Visual Editing
    presentationTool({
      previewUrl: {
        // origin: SANITY_STUDIO_PREVIEW_URL,
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
      resolve: {
        // The Main Document Resolver API provides a method of resolving a main document from a given route or route pattern. https://www.sanity.io/docs/presentation-resolver-api#57720a5678d9
        mainDocuments: defineDocuments([
          {
            route: '/:countryCode',
            filter: `_type == "homePage" && _id == "homePage"`,
          },
          {
            route: '/:countryCode/:slug',
            filter: `_type == "page" && slug.current == $slug || _id == $slug`,
          },
          {
            route: '/:countryCode/products/:slug',
            filter: `_type == "product" && (pathname.current == "/products/" + $slug || _id == $slug)`,
          },
        ]),
        // Locations Resolver API allows you to define where data is being used in your application. https://www.sanity.io/docs/presentation-resolver-api#8d8bca7bfcd7
        locations: {
          settings: defineLocations({
            locations: [homeLocation],
            message: 'This document is used on all pages',
            tone: 'positive',
          }),
          page: defineLocations({
            select: {
              name: 'name',
              slug: 'slug.current',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.name || 'Untitled',
                  href: resolveHref('page', doc?.slug)!,
                },
              ],
            }),
          }),
          product: defineLocations({
            select: {
              title: 'title',
              pathname: 'pathname.current',
            },
            resolve: (doc) => {
              // Extract slug from pathname (e.g. "/products/ambrobiome" -> "ambrobiome")
              const slug = doc?.pathname?.replace('/products/', '');
              return {
                locations: [
                  {
                    title: doc?.title || 'Untitled',
                    href: resolveHref('product', slug)!,
                  },
                ],
              };
            },
          }),
        },
      },
    }),
    structureTool({
      structure, // Custom studio structure configuration, imported from ./src/structure.ts
    }),
    // Additional plugins for enhanced functionality
    assist(),
    visionTool(),
    iconPicker(),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter((template) => template.schemaType !== 'product'),
  },
});
