'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const scrollMap = new Map<string, number>();

export function ScrollRestoration() {
    const pathname = usePathname();
    const prevPathname = useRef<string | null>(null);

    useEffect(() => {
        if (prevPathname.current && prevPathname.current !== pathname) {
            scrollMap.set(prevPathname.current, window.scrollY);
        }
        prevPathname.current = pathname;

        const saved = scrollMap.get(pathname);
        if (!saved) return;

        // Coba restore scroll — tunggu content-ready dari Masonry
        const restore = () => window.scrollTo({ top: saved, behavior: 'instant' });

        // Fallback: langsung coba dulu
        requestAnimationFrame(restore);

        // Tunggu sinyal dari PostList bahwa Masonry sudah mount
        window.addEventListener('content-ready', restore, { once: true });

        const handleScroll = () => scrollMap.set(pathname, window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('content-ready', restore);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [pathname]);

    return null;
}