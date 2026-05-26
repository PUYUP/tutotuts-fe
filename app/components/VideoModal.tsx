'use client';

import Box from "@mui/material/Box";
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useCallback } from 'react';
import FacebookVideoPlayer from "./FBVideoPlayer";
import YouTubePlayer from "./YTVideoPlayer";
import Button from "@mui/material/Button";

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

export function useVideoModal() {
    const [post, setPost] = useState<Post | null>(null);

    const open = useCallback((p: Post) => setPost(p), []);
    const close = useCallback(() => setPost(null), []);

    return { post, open, close };
}

export default function VideoModal({
    post,
    onClose,
}: {
    post: Post | null;
    onClose: () => void;
}) {
    return (
        <Modal open={!!post} onClose={onClose}>
            <Box className="fixed flex justify-center items-center w-full h-full top-0 left-0 bg-black/50">
                <Box
                    sx={{
                        height: { xs: "90vh", sm: "90vh", md: "90vh" },
                        aspectRatio: "9 / 16",
                        position: "relative",
                        overflow: 'hidden',
                        padding: 5,
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <Box className="absolute bottom-0 right-0 left-0 flex justify-center">
                        <Button
                            variant="text"
                            startIcon={<CloseIcon />}
                            sx={{ textWrap: "nowrap", color: "white" }}
                            onClick={onClose}
                        >
                            Close
                        </Button>
                    </Box>
                    {post && <VideoPlayer sourceId={post.source_id} sourceUrl={post.source_url} />}
                </Box>
            </Box>
        </Modal>
    );
}