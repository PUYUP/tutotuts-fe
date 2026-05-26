'use client';

import { Box, ListItemText, MenuItem, MenuList } from "@mui/material";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { CategoryNode } from "../api/categories/route";
import { useRouter, useParams } from "next/navigation";

interface MenuNode {
    name: string;
    url: string;
}

const menus: MenuNode[] = [
    { name: "Privacy Policy", url: "/about/privacy-policy" },
    { name: "Term of Use", url: "/about/term-of-use" },
    { name: "Delete Account", url: "/about/delete-account" },
];

export default function ContentSidebar() {
    const router = useRouter();
    const params = useParams();
    const activeCategory = params?.category_id as string | undefined;

    const [categories, setCategories] = useState<CategoryNode[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    const load = useCallback(async () => {
        setLoading(true);
        const res = await fetch("/api/categories", {
            cache: 'force-cache',
        });
        const data: CategoryNode[] = await res.json();
        setCategories(data);
        setLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    // Expand parent if active category is a child
    useEffect(() => {
        if (!activeCategory || categories.length === 0) return;

        const parentOfActive = categories.find((cat) =>
            cat.children.some((child) => child.id === activeCategory)
        );

        if (parentOfActive) {
            setExpandedItems([parentOfActive.id]);
        } else {
            // Active category is a top-level item, expand it directly
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
            <SimpleTreeView
                expandedItems={expandedItems}
                onExpandedItemsChange={(_, items) => setExpandedItems(items)}
            >
                {categories.map((category) => (
                    <TreeItem
                        key={category.id}
                        itemId={category.id}
                        label={category.name}
                    >
                        {category.children.map((child) => (
                            <TreeItem
                                key={child.id}
                                itemId={child.id}
                                label={child.name}
                                onClick={() => goToArchive(child.id)}
                            />
                        ))}
                    </TreeItem>
                ))}
            </SimpleTreeView>

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