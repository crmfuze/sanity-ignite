import { defineField } from 'sanity';

export default defineField({
  name: 'featuredProducts',
  title: 'Featured products section',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'products',
      of: [{ to: [{ type: 'product' }], type: 'reference' }],
      title: 'Products',
      type: 'array',
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare: ({ title }) => ({
      subtitle: 'Featured products section',
      title: title,
    }),
  },
});
