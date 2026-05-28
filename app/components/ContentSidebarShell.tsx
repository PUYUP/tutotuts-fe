'use client';

import { Box, ListItemText, MenuItem, MenuList } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

interface MenuNode {
    name: string;
    url: string;
}

const menus: MenuNode[] = [
    { name: "Privacy Policy", url: "/about/privacy-policy" },
    { name: "Term of Use", url: "/about/term-of-use" },
    { name: "Delete Account", url: "/about/delete-account" },
];

export default function ContentSidebarShell({ children }: { children: React.ReactNode }) {
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

            {children}

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