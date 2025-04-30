import { defineField, defineType } from 'sanity';
import { Microscope } from 'lucide-react';
import { preview } from 'sanity-plugin-icon-picker';
import { options } from '../icons';

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
                  name: 'icon',
                  type: 'icons',
                }),
              ],
              preview: {
                select: {
                  title: 'title',
                  icon: 'icon.icon',
                },
                prepare({ title, icon }) {
                  return { title, media: preview({ ...icon, options }) };
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
