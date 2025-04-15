import { defineType, defineField } from 'sanity';
import { BlockContentIcon } from '@sanity/icons';

export default defineType({
  name: 'blockContentSection',
  title: 'Block Content Section',
  type: 'object',
  icon: BlockContentIcon,
  fields: [
    defineField({
      name: 'content',
      title: 'Content',
      type: 'blockContent',
    }),
  ],
  preview: {
    select: {
      content: 'content',
    },
    prepare() {
      return {
        title: 'Block Content Section',
      };
    },
  },
});
