import React from 'react';
import { preview } from 'sanity-plugin-icon-picker';
import * as LucideIcons from 'lucide-react';
import { defineType } from 'sanity';

export const options = {
  configurations: [
    {
      title: 'Lucide Icons',
      provider: 'li',
      icons: () =>
        Object.entries(LucideIcons).map(([name, Component]) => ({
          name,
          // @ts-expect-error Base example
          component: () => <Component width="1.5em" height="1em" />,
          tags: [name],
        })),
    },
  ],
};

export default defineType({
  title: 'Icons',
  name: 'icons',
  type: 'object',
  fields: [
    {
      title: 'Icon',
      name: 'icon',
      type: 'iconPicker',
      options,
    },
  ],
  preview: {
    select: {
      provider: 'icon.provider',
      name: 'icon.name',
    },
    prepare(icon) {
      return { title: icon.provider, subtitle: icon.name, media: preview({ ...icon, options }) };
    },
  },
});
