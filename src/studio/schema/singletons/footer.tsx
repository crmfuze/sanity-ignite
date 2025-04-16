import { TagIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

/**
 * Footer schema Singleton.  Singletons are single documents that are displayed not in a collection, handy for things like site settings and other global configurations.
 * Learn more: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list
 */

export default defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        },
      ],
    }),
    defineField({
      name: 'companyLinks',
      title: 'Company Links',
      type: 'object',
      fields: [
        {
          name: 'sectionTitle',
          title: 'Section Title',
          type: 'string',
        },
        {
          name: 'links',
          title: 'Links',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'text',
                  title: 'Link Text',
                  type: 'string',
                },
                {
                  name: 'url',
                  title: 'URL',
                  type: 'string',
                },
                {
                  name: 'isExternal',
                  title: 'Is External Link',
                  type: 'boolean',
                  initialValue: false,
                },
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'ourProductsLinks',
      title: 'Our Products Links',
      type: 'object',
      fields: [
        {
          name: 'sectionTitle',
          title: 'Section Title',
          type: 'string',
        },
        {
          name: 'links',
          title: 'Links',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'text',
                  title: 'Link Text',
                  type: 'string',
                },
                {
                  name: 'url',
                  title: 'URL',
                  type: 'string',
                },
                {
                  name: 'isExternal',
                  title: 'Is External Link',
                  type: 'boolean',
                  initialValue: false,
                },
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'patnerProgramsLinks',
      title: 'Patner Programs Links',
      type: 'object',
      fields: [
        {
          name: 'sectionTitle',
          title: 'Section Title',
          type: 'string',
        },
        {
          name: 'links',
          title: 'Links',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'text',
                  title: 'Link Text',
                  type: 'string',
                },
                {
                  name: 'url',
                  title: 'URL',
                  type: 'string',
                },
                {
                  name: 'isExternal',
                  title: 'Is External Link',
                  type: 'boolean',
                  initialValue: false,
                },
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'legalLinks',
      title: 'Legal Links',
      type: 'object',
      fields: [
        {
          name: 'sectionTitle',
          title: 'Section Title',
          type: 'string',
        },
        {
          name: 'links',
          title: 'Links',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'text',
                  title: 'Link Text',
                  type: 'string',
                },
                {
                  name: 'url',
                  title: 'URL',
                  type: 'string',
                },
                {
                  name: 'isExternal',
                  title: 'Is External Link',
                  type: 'boolean',
                  initialValue: false,
                },
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        {
          name: 'sectionTitle',
          title: 'Section Title',
          type: 'string',
        },
        {
          name: 'links',
          title: 'Links',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'image',
                  title: 'Image',
                  type: 'image',
                  options: {
                    hotspot: true,
                  },
                  fields: [
                    {
                      name: 'alt',
                      title: 'Alt Text',
                      type: 'string',
                    },
                  ],
                },
                {
                  name: 'url',
                  title: 'URL',
                  type: 'string',
                },
                {
                  name: 'isExternal',
                  title: 'Is External Link',
                  type: 'boolean',
                  initialValue: false,
                },
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'ctaButton',
      title: 'Call to Action Button',
      type: 'object',
      fields: [
        {
          name: 'text',
          title: 'Button Text',
          type: 'string',
        },
        {
          name: 'url',
          title: 'Button URL',
          type: 'string',
        },
        {
          name: 'variant',
          title: 'Button Variant',
          type: 'string',
          options: {
            list: [
              { title: 'Primary', value: 'primary' },
              { title: 'Secondary', value: 'secondary' },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'visaImage',
      title: 'Visa Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'copyrightText',
      title: 'Copyright Text',
      type: 'object',
      fields: [
        {
          name: 'line1',
          title: 'Line 1',
          type: 'string',
          description: "First line of copyright text (e.g. '© 2024 Ambrosia Global LLC')",
        },
        {
          name: 'line2',
          title: 'Line 2',
          type: 'string',
          description: 'Second line of copyright text',
        },
        {
          name: 'line3',
          title: 'Line 3',
          type: 'string',
          description: "Third line of copyright text (e.g. 'All Rights Reserved')",
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Footer',
      };
    },
  },
});
