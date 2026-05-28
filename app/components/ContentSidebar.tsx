'use client';

import { Box, ListItemText, MenuItem, MenuList } from "@mui/material";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { CategoryNode } from "../api/categories/route";
import { useRouter, useParams } from "next/navigation";
import { categoriesCache } from "@/lib/categoriesCache";

interface MenuNode {
    name: string;
    url: string;
}

const menus: MenuNode[] = [
    { name: "Privacy Policy", url: "/about/privacy-policy" },
    { name: "Term of Use", url: "/about/term-of-use" },
    { name: "Delete Account", url: "/about/delete-account" },
];

// ✅ Rekursif: kumpulkan semua ancestor ID dari node yang aktif
function findAncestorIds(nodes: CategoryNode[], targetId: string, path: string[] = []): string[] {
    for (const node of nodes) {
        const currentPath = [...path, node.id];
        if (node.id === targetId) return path; // kembalikan path TANPA dirinya sendiri (hanya ancestors)
        if (node.children?.length) {
            const found = findAncestorIds(node.children, targetId, currentPath);
            if (found.length > 0 || node.children.some(c => c.id === targetId)) {
                // Cek apakah target ditemukan di subtree ini
                const result = findAncestorIds(node.children, targetId, currentPath);
                if (result !== currentPath) return result; // target ditemukan
            }
        }
    }
    return [];
}

// ✅ Helper yang lebih clean untuk mencari ancestors
function getAncestorIds(nodes: CategoryNode[], targetId: string): string[] {
    function search(nodes: CategoryNode[], target: string, ancestors: string[]): string[] | null {
        for (const node of nodes) {
            if (node.id === target) return ancestors;
            if (node.children?.length) {
                const result = search(node.children, target, [...ancestors, node.id]);
                if (result !== null) return result;
            }
        }
        return null;
    }
    return search(nodes, targetId, []) ?? [];
}

// ✅ Recursive TreeItem component
function RecursiveTreeItem({
    node,
    onLeafClick,
}: {
    node: CategoryNode;
    onLeafClick: (id: string) => void;
}) {
    const hasChildren = node.children && node.children.length > 0;

    return (
        <TreeItem
            key={node.id}
            itemId={node.id}
            label={node.name}
            onClick={!hasChildren ? () => onLeafClick(node.id) : undefined}
        >
            {hasChildren &&
                node.children.map((child) => (
                    <RecursiveTreeItem
                        key={child.id}
                        node={child}
                        onLeafClick={onLeafClick}
                    />
                ))}
        </TreeItem>
    );
}

export default function ContentSidebar() {
    const router = useRouter();
    const params = useParams();
    const activeCategory = params?.category_id as string | undefined;

    const [categories, setCategories] = useState<CategoryNode[]>(() => {
        // ✅ Inisialisasi langsung dari cache jika ada
        return categoriesCache.get() ?? [];
    });
    const [loading, setLoading] = useState(!categoriesCache.get());
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    const load = useCallback(async () => {
        // ✅ Skip fetch jika cache sudah ada
        if (categoriesCache.get()) return;

        setLoading(true);
        const res = await fetch("/api/categories");
        const data: CategoryNode[] = await res.json();
        categoriesCache.set(data);
        setCategories(data);
        setLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    // ✅ Auto-expand semua ancestor dari active category
    useEffect(() => {
        if (!activeCategory || categories.length === 0) return;

        const ancestors = getAncestorIds(categories, activeCategory);
        if (ancestors.length > 0) {
            setExpandedItems(ancestors);
        } else {
            // Active category adalah top-level, expand dirinya sendiri
            setExpandedItems([activeCategory]);
        }
    }, [activeCategory, categories]);

    const goToArchive = (id: string) => {
        router.push(`/archives/category/${id}`);
    };

    return (
        <Box className="flex flex-col h-full">
            <Box className="flex items-center p-4">
                <Link href={"/"} style={{ marginLeft: -6 }}>
                    <Image
                        src="/tutotuts-logo.png"
                        alt="Tutotuts Logo"
                        width={220}
                        height={100}
                        priority
                        className="w-auto h-10 lg:h-14"
                    />
                </Link>
            </Box>

            {loading ? (
                <Box className="p-4 text-sm text-gray-400">Loading...</Box>
            ) : (
                <SimpleTreeView
                    expandedItems={expandedItems}
                    onExpandedItemsChange={(_, items) => setExpandedItems(items)}
                >
                    {categories.map((category) => (
                        <RecursiveTreeItem
                            key={category.id}
                            node={category}
                            onLeafClick={goToArchive}
                        />
                    ))}
                </SimpleTreeView>
            )}

            <MenuList dense sx={{ marginTop: 'auto' }}>
                {menus.map((menu) => (
                    <Link href={menu.url} key={menu.name}>
                        <MenuItem>
                            <ListItemText>{menu.name}</ListItemText>
                        </MenuItem>
                    </Link>
                ))}
            </MenuList>
        </Box>
    );
}