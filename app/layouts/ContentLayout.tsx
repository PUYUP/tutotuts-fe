'use client';

import { Box, Button, Drawer, IconButton, Link, TextField } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import ContentSidebar from "../components/ContentSidebar";
import Image from "next/image";
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidth = 240;

export default function ContentLayout({ children }: { children: ReactNode }) {
    const [mounted, setMounted] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    const toggleDrawer = () => {
        setDrawerOpen(prev => !prev);
    };

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // Set initial size

        setMounted(true);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div>
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
                        <ContentSidebar />
                    </Drawer>
                )}
                <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
                    {windowSize.width < 1024 && (
                        <Box className="mb-4">
                            {/* Logo */}
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

                                <IconButton aria-label="delete" size="large" onClick={toggleDrawer}>
                                    <MenuIcon />
                                </IconButton>
                            </div>
                        </Box>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <TextField id="outlined-basic" placeholder="Search here..." variant="outlined" fullWidth size="small" />
                        <Button variant="contained" sx={{ paddingTop: 1, paddingBottom: 1 }}>Search</Button>
                    </Box>

                    {children}
                </Box>
            </Box>
        </div>
    );
}