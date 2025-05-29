import { CiVideoOn } from 'react-icons/ci';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'video',
  title: 'Video',
  type: 'object',
  icon: CiVideoOn,
  fields: [
    defineField({
      name: 'url',
      title: 'Default URL (English)',
      type: 'string',
      description: 'Default video URL for English language',
    }),
    defineField({
      name: 'spanishUrl',
      title: 'Spanish URL',
      type: 'string',
      description: 'Video URL for Spanish language (optional)',
    }),
  ],
});
