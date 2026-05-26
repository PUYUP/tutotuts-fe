import Box from "@mui/material/Box";
import Link from "next/link";
import PostCardWithModal from './PostCardWithModal';

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
    return (
        <div className="block">
            <Box sx={{ width: "100%", display: "flex", flexDirection: "row", gap: 0, flexWrap: "wrap", justifyContent: 'space-between' }}>
                {initialPosts.map((p, idx) => (
                    <Box
                        key={p.id ?? idx}
                        sx={{
                            width: {
                                xs: '100%',
                                sm: 'calc(100% - 8px)',
                                md: 'calc(50% - 8px)',
                                lg: 'calc(50% - 8px)',
                            },
                            marginBottom: 2
                        }}>
                        {/*
                        * Link untuk SEO — crawler bisa follow href ini
                        * tanpa perlu JavaScript
                        */}
                        <Link
                            href={`/posts/${p.slug}`}
                            prefetch={true}
                            style={{ display: "block", textDecoration: "none" }}
                        >
                            {/* Konten statis yang di-render server */}
                        </Link>

                        {/* Card + modal hanya untuk interaksi play video */}
                        <PostCardWithModal post={p} />
                    </Box>
                ))}
            </Box>
        </div>
    );
}