import { Metadata } from 'next';
import PostList from './components/PostList';

export const metadata: Metadata = {
  title: 'tutotuts - Search Engine for Video Tutorials',
  description: 'The best place to find tutorials and step-by-step guides to help you learn new things and solve problems. Support creator by watching the video.',
  keywords: ['tutorials', 'how-to', 'guides', 'DIY', 'cooking', 'health', 'motorcycle', 'automotive', 'gadgets', 'home improvement', 'life hacks', 'learning', 'education', 'video tutorials', 'step-by-step', 'instructions'],
  authors: [{ name: 'tutotuts' }],
  themeColor: '#ffffff',
  openGraph: {
    title: 'tutotuts - The Search Engine for Video Tutorials',
    description: 'The best place to find tutorials and step-by-step guides to help you learn new things and solve problems.',
    siteName: 'tutotuts',
  }
};

export default function Home() {
  return (
    <div className="block pb-4 px-4 sm:px-8 md:px-8 lg:px-14 max-w-8xl mx-auto">
      <div className="block mb-10">
        <p className="text-lg text-gray-600 mt-2">
          A collection of curated tutorials and step-by-step guides to help you
          learn new things and solve problems. Support creator by watching the
          video.
        </p>
      </div>

      <PostList />
    </div>
  );
}