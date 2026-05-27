// components/PostListServer.tsx
import PostList from './PostList';
import { Box, Typography } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

interface Props {
    categoryId?: string;
}

export default async function PostListServer({ categoryId }: Props) {
    const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`);
    if (categoryId) url.searchParams.set('categoryId', categoryId);

    const res = await fetch(url.toString(), { cache: 'no-store' });
    const posts = res.ok ? await res.json() : [];

    if (!posts.length) {
        return (
            <Box className="flex flex-col items-center justify-center py-24 gap-3 text-center">
                <InboxIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
                <Typography variant="h6" color="text.secondary">No tutorials found</Typography>
                <Typography variant="body2" color="text.disabled">
                    There are no tutorials available{categoryId ? ' in this category' : ''}.
                </Typography>
            </Box>
        );
    }

    return <PostList initialPosts={posts} />;
}