import { ComposeIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import { defaultFieldGroups } from '../config/fieldGroups';
import { definePathname } from '@tinloof/sanity-studio';
import pageSections from '../fields/pageSections';

export default defineType({
  name: 'product',
  title: 'Product Page',
  icon: ComposeIcon,
  type: 'document',
  groups: defaultFieldGroups,
  fields: [
    {
      name: 'title',
      type: 'string',
    },
    defineField({
      ...definePathname(),
      group: "settings",
    }),
    {
      group: 'content',
      name: 'specs',
      of: [
        {
          fields: [
            { name: 'lang', title: 'Language', type: 'string' },
            { name: 'title', title: 'Title', type: 'string' },
            {
              name: 'content',
              rows: 3,
              title: 'Content',
              type: 'text',
            },
          ],
          name: 'spec',
          type: 'object',
        },
      ],
      type: 'array',
    },
    {
      name: 'productVideo',
      title: 'Product Video',
      group: 'content',
      type: 'object',
      fields: [
        { name: 'title', title: 'Video Title', type: 'string' },
        { name: 'thumbnail', title: 'Video Thumbnail', type: 'image' },
        { name: 'heading', title: 'Heading', type: 'string' },
        { name: 'subheading', title: 'Subheading', type: 'string' },
        { name: 'video', title: 'Video', type: 'video' },
      ],
    },
    {
      name: 'ingredients',
      group: 'content',
      title: 'Product Ingredients',
      type: 'array',
      of: [
        {
          name: 'ingredient',
          title: 'Ingredient',
          type: 'object',
          fields: [
            { name: 'name', title: 'Name', type: 'string' },
            { name: 'heading', title: 'Heading', type: 'string' },
            { name: 'description', title: 'Description', type: 'text' },
            { name: 'image', title: 'Image', type: 'image' },
            {
              name: 'benefits',
              title: 'Ingredient Benefits',
              type: 'array',
              of: [
                {
                  name: 'benefit',
                  type: 'object',
                  fields: [
                    { name: 'description', type: 'text' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      fields: [
        { name: 'title', title: 'Title', type: 'string' },
        {
          name: 'products',
          of: [{ to: [{ type: 'product' }], type: 'reference' }],
          title: 'Addons',
          type: 'array',
          validation: (Rule) => Rule.max(3),
        },
      ],
      name: 'addons',
      type: 'object',
    },
    pageSections
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
});
