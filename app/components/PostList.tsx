'use client';

import dynamic from 'next/dynamic';
import Box from "@mui/material/Box";
import PostCard from './PostCard';
import { useEffect, useState } from 'react';
import FacebookVideoPlayer from "./FBVideoPlayer";
import YouTubePlayer from "./YTVideoPlayer";
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const Masonry = dynamic(() => import('@mui/lab/Masonry'), { ssr: false });

function VideoPlayer({ sourceId, sourceUrl }: { sourceId: string; sourceUrl: string }) {
    switch (sourceId) {
        case "facebook":
            return <FacebookVideoPlayer videoUrl={sourceUrl} />;
        case "youtube":
            return <YouTubePlayer videoUrl={sourceUrl} autoPlay={false} />;
        default:
            return <img src={sourceUrl} className="w-full h-full object-cover" />;
    }
}

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

export default function PostList({ initialPosts }: { initialPosts: Post[] }) {
    const [mounted, setMounted] = useState(false);
    const [play, setPlay] = useState(false);
    const [post, setPost] = useState<Post | null>(null);

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        if (post) setPlay(true);
    }, [post]);

    if (!mounted) return null;

    return (
        <>
            <Box sx={{ width: "100%" }}>
                <Masonry
                    columns={{ xs: 1, sm: 2, md: 2, lg: 3, xl: 3 }}
                    spacing={{ xs: 0, sm: 2, md: 2, lg: 2, xl: 3 }}
                >
                    {initialPosts.map((p, idx) => (
                        <div key={p.id ?? idx}>
                            <Box sx={{ paddingBottom: { xs: 2, sm: 0 } }}>
                                <PostCard post={p} onPlay={setPost} />
                            </Box>
                        </div>
                    ))}
                </Masonry>
            </Box>

            <Modal
                open={play}
                onClose={() => setPlay(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className="fixed flex justify-center items-center w-full h-full top-0 left-0 right-0 bottom-0 bg-black/50">
                    <Box
                        sx={{
                            height: { xs: "90vh", sm: "90vh", md: "90vh" },
                            aspectRatio: "9 / 16",
                            position: "relative",
                            overflow: 'hidden',
                            padding: 5,
                        }}
                    >
                        <Box className="absolute -top-0 -right-0 z-10 bg-black/50 hover:bg-black/70 rounded-full">
                            <IconButton onClick={() => setPlay(false)}>
                                <CloseIcon className="text-white w-6 h-6" />
                            </IconButton>
                        </Box>
                        {post && <VideoPlayer sourceId={post.source_id} sourceUrl={post.source_url} />}
                    </Box>
                </Box>
            </Modal>
        </>
    );
}