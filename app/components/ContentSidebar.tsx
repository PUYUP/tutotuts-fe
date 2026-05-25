'use client';

import { Box, Link, ListItemText, MenuItem, MenuList, Typography } from "@mui/material";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { CategoryNode } from "../api/categories/route";

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
    const [categories, setCategories] = useState<CategoryNode[]>([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        const res = await fetch("/api/categories");
        setCategories(await res.json());
        setLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

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
            <SimpleTreeView>
                {categories.map((category) => (
                    <TreeItem key={category.id} itemId={category.id} label={category.name}>
                        {category.children.map((child) => (
                            <TreeItem key={child.id} itemId={child.id} label={child.name} />
                        ))}
                    </TreeItem>
                ))}
            </SimpleTreeView>

            <MenuList dense sx={{ marginTop: 'auto' }}>
                {
                    menus.map((menu) => (
                        <MenuItem key={menu.name}>
                            <ListItemText>{menu.name}</ListItemText>
                        </MenuItem>
                    ))
                }
            </MenuList>
        </Box>
    );
}