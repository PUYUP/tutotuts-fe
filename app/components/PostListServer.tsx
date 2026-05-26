// components/PostListServer.tsx
import PostList from './PostList';

export default async function PostListServer() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`, {
        cache: 'no-store', // atau 'force-cache' / revalidate jika ingin caching
    });

    const posts = res.ok ? await res.json() : [];

    return <PostList initialPosts={posts} />;
}