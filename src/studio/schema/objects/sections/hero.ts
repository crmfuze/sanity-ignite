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
      validation: (Rule) =>
        Rule.custom((value, { parent }) => {
          const parentType = parent as { mediaType?: string };
          return parentType?.mediaType === 'video' || value ? true : 'Required for non-video heroes';
        }),
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
      type: 'video',
      validation: (Rule) =>
        Rule.custom((value, { parent }) => {
          const parentType = parent as { mediaType?: string };
          return parentType?.mediaType === 'video' && !value ? 'Required' : true;
        }),
    }),
    defineField({
      hidden: ({ parent }) => parent?.mediaType !== 'video',
      name: 'contentPosition',
      title: 'Content Position',
      type: 'string',
      initialValue: 'right',
      options: {
        layout: 'radio',
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Right', value: 'right' },
        ],
      },
      description: 'Choose which side the content (heading and buttons) appears on',
    }),
    defineField({
      name: 'buttons',
      type: 'array',
      of: [{ type: 'button' }],
      validation: (Rule) =>
        Rule.custom((value, { parent }) => {
          const parentType = parent as { mediaType?: string };
          if (parentType?.mediaType === 'video') {
            return !value || value.length <= 4 ? true : 'Maximum 4 buttons for video heroes';
          }
          return value && value.length >= 2 && value.length <= 4 ? true : 'Requires 2-4 buttons for non-video heroes';
        }),
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
        content: 'Hero Section',
        media: image || DocumentTextIcon,
      };
    },
  },
});
