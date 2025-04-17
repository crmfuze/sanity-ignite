import { defineField, defineType } from 'sanity';
import { InlineIcon } from '@sanity/icons';
import card from './card';

export default defineType({
  name: 'cardGrid',
  type: 'object',
  icon: InlineIcon,
  title: 'Card Grid',
  fields: [
    defineField({
      name: 'heading',
      type: 'string',
    }),
    defineField({
      name: 'subtitle',
      type: 'string',
    }),
    defineField({
      name: 'cards',
      type: 'array',
      of: [card],
    }),
  ],
});
