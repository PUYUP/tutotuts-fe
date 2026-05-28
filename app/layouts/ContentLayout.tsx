'use client';

import { Box, Drawer, IconButton, Link } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import MenuIcon from '@mui/icons-material/Menu';
import Script from "next/script";

const drawerWidth = 240;

export default function ContentLayout({
    children,
    sidebar, // ✅ Terima sidebar sebagai prop, bukan di-import langsung
}: {
    children: ReactNode;
    sidebar: ReactNode;
}) {
    const [mounted, setMounted] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    const toggleDrawer = () => setDrawerOpen(prev => !prev);

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        setMounted(true);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="block">
            <Box sx={{ maxWidth: { xs: '100%', sm: '100%', md: '100%', lg: '1024px' }, margin: '0 auto' }}>
                <Box sx={{ display: 'flex' }}>
                    {mounted && (
                        <Drawer
                            sx={{
                                width: drawerWidth,
                                flexShrink: 0,
                                '& .MuiDrawer-paper': {
                                    width: drawerWidth,
                                    boxSizing: 'border-box',
                                },
                            }}
                            variant={windowSize.width > 1024 ? "permanent" : "temporary"}
                            anchor="left"
                            open={windowSize.width > 1024 ? true : drawerOpen}
                            onClose={() => setDrawerOpen(false)}
                        >
                            {sidebar} {/* ✅ Render sebagai slot */}
                        </Drawer>
                    )}
                    <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
                        {windowSize.width < 1024 && (
                            <Box className="mb-4">
                                <div className="flex items-center justify-between">
                                    <Link href={"/"} style={{ marginLeft: -8 }}>
                                        <Image
                                            src="/tutotuts-logo.png"
                                            alt="Tutotuts Logo"
                                            width={220}
                                            height={100}
                                            priority
                                            className="w-auto h-10 lg:h-14"
                                        />
                                    </Link>
                                    <IconButton aria-label="menu" size="large" onClick={toggleDrawer}>
                                        <MenuIcon />
                                    </IconButton>
                                </div>
                            </Box>
                        )}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <div className="gcse-search"></div>
                        </Box>
                        {children}
                    </Box>
                </Box>
            </Box>
            <Script async src="https://cse.google.com/cse.js?cx=a01387873d052466b" />
        </div>
    );
}