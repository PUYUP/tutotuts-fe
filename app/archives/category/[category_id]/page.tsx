import ContentSidebar from "@/app/components/ContentSidebar";
import PostListServer from "@/app/components/PostListServer";
import ContentLayout from "@/app/layouts/ContentLayout";

interface Props {
    params: Promise<{ category_id: string }>;
}

export default async function ArchiveCategory({ params }: Props) {
    const { category_id } = await params;

    return (
        <ContentLayout sidebar={<ContentSidebar activeId={category_id} />}>
            <div className="block">
                <div className="block mb-10">
                    <p className="text-lg text-gray-600 mt-2">
                        A collection of curated tutorials and step-by-step guides to help you
                        learn new things and solve problems. Support creator by watching the
                        video.
                    </p>
                </div>

                <PostListServer categoryId={category_id} />
            </div>
        </ContentLayout>
    );
}
