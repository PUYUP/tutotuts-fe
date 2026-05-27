'use client';

import { useState } from 'react';
import VideoModal from './VideoModal';
import Image from 'next/image';
import MarkdownIt from 'markdown-it';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const md = new MarkdownIt();

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
    tutorial_categories: TutorialCategory[];
};

type TutorialCategory = {
    category_id: string;
    categories: {
        id: string;
        name: string;
    };
};

function PlayButton() {
    return (
        <button className="w-16 h-16 rounded-full bg-[#ef4444] backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-105 transition cursor-pointer">
            <PlayArrowIcon sx={{ fontSize: 48, color: "#ffffff" }} />
        </button>
    );
}

export default function DetailCardWithModal({ post }: { post: Post }) {
    const [activePost, setActivePost] = useState<Post | null>(null);
    const categories = post.tutorial_categories?.map((tc) => tc.categories) ?? [];

    function playVideo(post: any) {
        setActivePost(post);
    }

    return (
        <>
            {/* Categories */}
            {categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {categories.map((cat) => (
                        <a
                            key={cat.id}
                            href={`/archives/${cat.id}`}
                            className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                            {cat.name}
                        </a>
                    ))}
                </div>
            )}

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-4">
                {post.title}
            </h1>

            {/* Before / After Images + Play Button */}
            {(post.image_before_url || post.image_after_url) && (
                <div className="relative">
                    <div className="grid grid-cols-2">
                        <div className="relative" style={{ paddingBottom: '177.78%' }}>
                            <div className="absolute inset-0 w-full h-full overflow-hidden">
                                {post.image_before_url && (
                                    <Image
                                        src={post.image_before_url}
                                        alt={post.title}
                                        fill
                                        className="object-cover"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="relative" style={{ paddingBottom: '177.78%' }}>
                            <div className="absolute inset-0 w-full h-full overflow-hidden">
                                {post.image_after_url && (
                                    <Image
                                        src={post.image_after_url}
                                        alt={post.title}
                                        fill
                                        className="object-cover"
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Play Button — absolute center between before and after */}
                    {post.source_url && post.image_before_url && post.image_after_url && (
                        <div onClick={() => playVideo(post)} className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                            <div>
                                <PlayButton />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Content */}
            {post.content && (
                <div
                    className={"prose prose-sm max-w-none text-sm post-content mt-6"}
                    dangerouslySetInnerHTML={{ __html: md.render(String(post.content ?? "")) }}
                />
            )}


            <VideoModal post={activePost} onClose={() => setActivePost(null)} />
        </>
    );
}