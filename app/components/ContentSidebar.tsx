import { CategoryNode } from "../api/categories/route";
import CategoryTree from "./CategoryTree";
import ContentSidebarShell from "./ContentSidebarShell";

async function getCategories(): Promise<CategoryNode[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`, {
        next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return res.json();
}

export default async function ContentSidebar({ activeId }: { activeId?: string }) {
    const categories = await getCategories();

    return (
        <ContentSidebarShell>
            <CategoryTree categories={categories} activeId={activeId} />
        </ContentSidebarShell>
    );
}