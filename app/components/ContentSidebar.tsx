'use client';

import { Box, Link, ListItemText, MenuItem, MenuList, Typography } from "@mui/material";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import Image from "next/image";

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
                <TreeItem itemId="cooking" label="Cooking">
                    <TreeItem itemId="cooking-community" label="@mui/x-data-grid" />
                    <TreeItem itemId="cooking-pro" label="@mui/x-data-grid-pro" />
                    <TreeItem itemId="cooking-premium" label="@mui/x-data-grid-premium" />
                </TreeItem>
                <TreeItem itemId="home-maintenance" label="Home Maintenance">
                    <TreeItem itemId="home-maintenance-community" label="@mui/x-data-grid" />
                    <TreeItem itemId="home-maintenance-pro" label="@mui/x-data-grid-pro" />
                    <TreeItem itemId="home-maintenance-premium" label="@mui/x-data-grid-premium" />
                </TreeItem>
                <TreeItem itemId="automotive" label="Automotive">
                    <TreeItem itemId="automotive-community" label="@mui/x-date-pickers" />
                    <TreeItem itemId="automotive-pro" label="@mui/x-date-pickers-pro" />
                </TreeItem>
                <TreeItem itemId="gadgets" label="Gadgets">
                    <TreeItem itemId="gadgets-community" label="@mui/x-charts" />
                    <TreeItem itemId="gadgets-pro" label="@mui/x-charts-pro" />
                </TreeItem>
                <TreeItem itemId="craft" label="Craft">
                    <TreeItem itemId="craft-community" label="@mui/x-tree-view" />
                    <TreeItem itemId="craft-pro" label="@mui/x-tree-view-pro" />
                </TreeItem>
                <TreeItem itemId="life-hacks" label="Life Hacks">
                    <TreeItem itemId="life-hacks-community" label="@mui/x-tree-view" />
                    <TreeItem itemId="life-hacks-pro" label="@mui/x-tree-view-pro" />
                </TreeItem>
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