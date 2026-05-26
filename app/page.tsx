import { Metadata } from 'next';
import ContentLayout from './layouts/ContentLayout';
import PostListServer from './components/PostListServer';

export const metadata: Metadata = {
  title: 'tutotuts - Search Engine for Video Tutorials',
  description: 'Search across YouTube, Facebook, and Instagram to find the best video tutorials for any skill. Support creator by watching the video.',
  keywords: ['tutorials', 'how-to', 'guides', 'DIY', 'cooking', 'health', 'motorcycle', 'automotive', 'gadgets', 'home improvement', 'life hacks', 'learning', 'education', 'video tutorials', 'step-by-step', 'instructions'],
  authors: [{ name: 'tutotuts' }],
  themeColor: '#ffffff',
  openGraph: {
    title: 'tutotuts - The Search Engine for Video Tutorials',
    description: 'Search across YouTube, Facebook, and Instagram to find the best video tutorials for any skill.',
    siteName: 'tutotuts',
  }
};

export default function Home() {
  return (
    <ContentLayout>
      <div className="block">
        <div className="block mb-10">
          <p className="text-lg text-gray-600 mt-2">
            A collection of curated tutorials and step-by-step guides to help you
            learn new things and solve problems. Support creator by watching the
            video.
          </p>
        </div>

        <PostListServer />
      </div>
    </ContentLayout>
  );
}