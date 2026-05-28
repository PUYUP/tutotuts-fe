import { CategoryNode } from "../api/categories/route";
import Link from "next/link";

/** Cari semua ancestor IDs dari targetId dalam tree */
function getAncestorIds(nodes: CategoryNode[], targetId: string): Set<string> {
    function search(
        nodes: CategoryNode[],
        target: string,
        ancestors: string[]
    ): string[] | null {
        for (const node of nodes) {
            if (node.id === target) return ancestors;
            if (node.children?.length) {
                const result = search(node.children, target, [...ancestors, node.id]);
                if (result !== null) return result;
            }
        }
        return null;
    }
    return new Set(search(nodes, targetId, []) ?? []);
}

function RecursiveNavItem({
    node,
    activeId,
    ancestorIds,
}: {
    node: CategoryNode;
    activeId?: string;
    ancestorIds: Set<string>;
}) {
    const hasChildren = node.children && node.children.length > 0;
    const isActive = node.id === activeId;
    const isOpen = isActive || ancestorIds.has(node.id);

    if (hasChildren) {
        return (
            <li>
                <details open={isOpen} className="category-details">
                    <summary className={`category-summary${isActive ? " category-active" : ""}`}>
                        <Link
                            href={`/archives/category/${node.id}`}
                            className="category-link category-parent-link"
                        >
                            {node.name}
                        </Link>
                    </summary>
                    <ul className="category-children">
                        {node.children.map((child) => (
                            <RecursiveNavItem
                                key={child.id}
                                node={child}
                                activeId={activeId}
                                ancestorIds={ancestorIds}
                            />
                        ))}
                    </ul>
                </details>
            </li>
        );
    }

    return (
        <li>
            <Link
                href={`/archives/category/${node.id}`}
                className={`category-link${isActive ? " category-active" : ""}`}
            >
                {node.name}
            </Link>
        </li>
    );
}

export default function CategoryTree({
    categories,
    activeId,
}: {
    categories: CategoryNode[];
    activeId?: string;
}) {
    const ancestorIds = activeId ? getAncestorIds(categories, activeId) : new Set<string>();

    return (
        <nav aria-label="Category navigation" className="category-nav">
            <ul className="category-root">
                {categories.map((category) => (
                    <RecursiveNavItem
                        key={category.id}
                        node={category}
                        activeId={activeId}
                        ancestorIds={ancestorIds}
                    />
                ))}
            </ul>
        </nav>
    );
}