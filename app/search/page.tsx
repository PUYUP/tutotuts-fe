import { Metadata } from 'next';
import ContentLayout from '@/app/layouts/ContentLayout';
import ContentSidebar from '@/app/components/ContentSidebar';
import PostListServer from '@/app/components/PostListServer';
import { Box, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface Props {
    searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const { q } = await searchParams;
    return {
        title: q ? `"${q}" — Search Results | tutotuts` : 'Search | tutotuts',
        description: q
            ? `Video tutorial search results for "${q}"`
            : 'Search video tutorials on tutotuts',
    };
}

export default async function SearchPage({ searchParams }: Props) {
    const { q } = await searchParams;
    const query = q?.trim() ?? '';

    return (
        <ContentLayout sidebar={<ContentSidebar />}>
            <div className="block">
                <div className="block mb-6">
                    {query ? (
                        <>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                <Typography variant="body2" color="text.secondary">
                                    Search results for
                                </Typography>
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                &ldquo;{query}&rdquo;
                            </Typography>
                        </>
                    ) : (
                        <Typography variant="body1" color="text.secondary">
                            Enter a keyword to search tutorials.
                        </Typography>
                    )}
                </div>

                {query && <PostListServer searchQuery={query} />}
            </div>
        </ContentLayout>
    );
}
