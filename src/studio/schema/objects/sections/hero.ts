import { defineField, defineType } from 'sanity';
import { DocumentTextIcon } from '@sanity/icons';

export default defineType({
  name: 'hero',
  type: 'object',
  icon: DocumentTextIcon,
  title: 'Hero',
  fields: [
    defineField({
      initialValue: 'image',
      name: 'mediaType',
      options: {
        layout: 'dropdown',
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Large Image', value: 'largeImage' },
          { title: 'Video', value: 'video' },
        ],
      },
      title: 'Media Type',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      hidden: ({ parent }) => parent?.mediaType !== 'image',
      name: 'text',
      type: 'blockContent',
    }),
    defineField({
      hidden: ({ parent }) => parent?.mediaType !== 'image',
      name: 'image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        }),
      ],
      validation: (Rule) =>
        Rule.custom((value, { parent }) => {
          const parentType = parent as { mediaType?: string };
          return parentType?.mediaType === 'image' && !value ? 'Required' : true;
        }),
    }),
    defineField({
      hidden: ({ parent }) => parent?.mediaType !== 'largeImage',
      name: 'largeImage',
      title: 'Large Image',
      type: 'image',
      validation: (Rule) =>
        Rule.custom((value, { parent }) => {
          const parentType = parent as { mediaType?: string };
          return parentType?.mediaType === 'largeImage' && !value ? 'Required' : true;
        }),
    }),
    defineField({
      hidden: ({ parent }) => parent?.mediaType !== 'video',
      name: 'video',
      title: 'Video',
      type: 'mux.video',
      validation: (Rule) =>
        Rule.custom((value, { parent }) => {
          const parentType = parent as { mediaType?: string };
          return parentType?.mediaType === 'video' && !value ? 'Required' : true;
        }),
    }),
    defineField({
      name: 'buttons',
      type: 'array',
      of: [{ type: 'button' }],
      validation: (Rule) => Rule.min(2).max(4),
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      image: 'image',
    },
    prepare({ title, image }) {
      return {
        title: title || 'Untitled',
        content: 'Hero text',
        media: image || DocumentTextIcon,
      };
    },
  },
});
