import { defineField, defineType } from 'sanity';
import { Microscope } from 'lucide-react';

export default defineType({
  name: 'scienceBanner',
  type: 'object',
  title: 'Science Banner',
  icon: <Microscope size={18} />,
  fields: [
    defineField({
      name: 'imagePosition',
      type: 'string',
      initialValue: 'left',
      title: 'Image position',
      options: { list: ['left', 'right'] },
    }),
    defineField({
      name: 'contentPosition',
      type: 'string',
      initialValue: 'left',
      title: 'Content position',
      options: { list: ['left', 'right', 'center'] },
    }),
    defineField({
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
    }),
    defineField({
      name: 'scienceBlock',
      title: 'Science Block',
      type: 'object',
      fields: [
        defineField({
          name: 'heading',
          type: 'string',
        }),
        defineField({
          name: 'content',
          type: 'text',
        }),
        defineField({
          name: 'benefits',
          title: 'Benefits',
          type: 'array',
          of: [
            defineField({
              name: 'benefit',
              title: 'Benefit',
              type: 'object',
              fields: [
                defineField({
                  name: 'title',
                  type: 'string',
                  title: 'Title',
                }),
                defineField({
                  name: 'iconName',
                  type: 'string',
                  title: 'Icon Name',
                  description: 'Enter a Lucide icon name (e.g., "Check", "Star", "Heart")',
                  placeholder: 'Check',
                }),
              ],
              preview: {
                select: {
                  title: 'title',
                  iconName: 'iconName',
                },
                prepare({ title, iconName }) {
                  return { 
                    title: title || 'Untitled', 
                    subtitle: iconName ? `Icon: ${iconName}` : 'No icon'
                  };
                },
              },
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'button',
      type: 'button',
    }),
  ],
  preview: {
    select: {
      title: 'scienceBlock.heading'
    }
  },
});
