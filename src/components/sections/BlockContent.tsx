import CustomPortableText from '@/components/modules/PortableText';
import type { PortableTextBlock } from 'next-sanity';

type BlockContentProps = {
  section: {
    content: PortableTextBlock[];
  };
};

export default function BlockContent({ section }: BlockContentProps) {
  const { content } = section;

  if (!content || !Array.isArray(content)) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <CustomPortableText value={content} />
      </div>
    </div>
  );
}
