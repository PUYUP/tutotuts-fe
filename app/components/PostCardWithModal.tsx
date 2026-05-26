'use client';

import { useState } from 'react';
import PostCard from './PostCard';
import VideoModal from './VideoModal';

type Post = {
    id: string;
    title: string;
    slug: string;
    source_id: string;
    source_url: string;
    content: string;
    thumbnail_url: string | null;
    image_before_url: string | null;
    image_after_url: string | null;
    created_at: string;
};

export default function PostCardWithModal({ post }: { post: Post }) {
    const [activePost, setActivePost] = useState<Post | null>(null);

    return (
        <>
            <PostCard post={post} onPlay={setActivePost} />
            <VideoModal post={activePost} onClose={() => setActivePost(null)} />
        </>
    );
}