import { defineField } from "sanity";

export default defineField({
  name: "homePageHero",
  title: "Home Page Hero",
  type: 'object',
  group: 'content',
  fields: [
    defineField({
      name: 'image',
      type: 'image',
    }),
    defineField({
      name: 'heading',
      type: 'string'
    }),
    defineField({
      name: 'subtitle',
      type: 'string',
    }),
    defineField({
      name: 'video',
      type: 'video',
    })
  ]
})