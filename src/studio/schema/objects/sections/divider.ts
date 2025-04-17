import { defineField, defineType } from 'sanity';
import { RemoveIcon } from '@sanity/icons';

export default defineType({
  name: 'divider',
  title: 'Divider',
  type: 'object',
  icon: RemoveIcon,
  fields: [
    defineField({
      name: 'heading',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
    }),
    defineField({
      name: 'button',
      title: 'Button',
      type: 'button',
    }),
  ],
  preview: {
    select: {
      buttonText: 'button.text',
    },
    prepare({ buttonText }) {
      return { title: `Divider${buttonText ? ` with button: ${buttonText}` : ''}` };
    },
  },
});
