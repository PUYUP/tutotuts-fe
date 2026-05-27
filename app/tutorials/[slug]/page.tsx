import ContentLayout from "@/app/layouts/ContentLayout";
import Image from "next/image";
import { notFound } from "next/navigation";
import MarkdownIt from "markdown-it";
import DetailCardWithModal from "@/app/components/DetailWithModal";
const md = new MarkdownIt();

interface Category {
    id: string;
    name: string;
}

interface TutorialCategory {
    category_id: string;
    categories: Category;
}

interface Tutorial {
    id: string;
    title: string;
    slug: string;
    content: string;
    source_url: string;
    source_id: string;
    thumbnail_url: string | null;
    image_before_url: string | null;
    image_after_url: string | null;
    is_published: boolean;
    created_at: string;
    tutorial_categories: TutorialCategory[];
}

async function getTutorial(slug: string): Promise<Tutorial | null> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts?slug=${slug}`,
        { cache: "no-store" }
    );
    if (!res.ok) return null;
    return res.json();
}

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function TutorialDetailPage({ params }: Props) {
    const { slug } = await params;
    const tutorial = await getTutorial(slug);

    if (!tutorial) notFound();

    return (
        <ContentLayout>
            <div className="max-w-3xl mx-auto">
                <DetailCardWithModal post={tutorial} />
            </div>
        </ContentLayout>
    );
}