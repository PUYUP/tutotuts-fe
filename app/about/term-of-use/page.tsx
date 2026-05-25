"use client";

import { useState, useEffect } from "react";

export default function PrivacyPolicy() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#faf8f5] font-serif">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,500;1,8..60,300&display=swap');

                body { font-family: 'Source Serif 4', serif; }
                .display-font { font-family: 'Playfair Display', serif; }

                .prose-content h1 { font-family: 'Playfair Display', serif; font-size: 1.875rem; font-weight: 700; color: #1c1917; margin-top: 2rem; margin-bottom: 0.75rem; }
                .prose-content h2 { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 600; color: #1c1917; margin-top: 2rem; margin-bottom: 0.5rem; }
                .prose-content h3 { font-family: 'Playfair Display', serif; font-size: 1.25rem; font-weight: 600; color: #292524; margin-top: 1.5rem; margin-bottom: 0.5rem; }
                .prose-content p { color: #57534e; line-height: 1.8; margin-top: 0.75rem; }
                .prose-content ul { list-style: none; padding-left: 1rem; margin-top: 0.75rem; }
                .prose-content ul li { color: #57534e; line-height: 1.8; padding-left: 1rem; position: relative; margin-bottom: 0.25rem; }
                .prose-content ul li::before { content: '—'; position: absolute; left: -0.5rem; color: #d97706; }
                .prose-content ol { list-style: decimal; padding-left: 1.5rem; margin-top: 0.75rem; }
                .prose-content ol li { color: #57534e; line-height: 1.8; margin-bottom: 0.25rem; }
                .prose-content a { color: #d97706; text-decoration: underline; text-underline-offset: 2px; }
                .prose-content strong { color: #1c1917; font-weight: 600; }
                .prose-content em { font-style: italic; }
                .prose-content hr { border: none; border-top: 1px solid #e7e5e4; margin: 2rem 0; }
                .prose-content blockquote { border-left: 3px solid #d97706; padding-left: 1rem; margin: 1.5rem 0; color: #78716c; font-style: italic; }

                .section-enter { animation: fadeUp 0.5s ease forwards; }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            {/* Top bar */}
            <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#faf8f5]/95 backdrop-blur border-b border-stone-200 shadow-sm" : ""}`}>
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="display-font text-lg font-bold text-stone-800 tracking-tight">
                        YourApp
                    </div>
                    <div className="text-xs text-stone-400 font-sans tracking-widest uppercase">
                        Last updated: January 2025
                    </div>
                </div>
            </div>

            {/* Hero */}
            <div className="pt-28 pb-12 px-6 max-w-4xl mx-auto">
                <div className="text-xs font-sans tracking-[0.2em] text-amber-600 uppercase mb-4">
                    Legal · Privacy
                </div>
                <h1 className="display-font text-5xl md:text-6xl font-bold text-stone-900 leading-tight mb-6">
                    Privacy<br />
                    <span className="italic font-normal text-stone-500">Policy</span>
                </h1>
                <p className="text-stone-500 text-lg leading-relaxed max-w-lg">
                    We believe privacy is a right, not a feature. This document explains, without jargon, exactly how we handle your data.
                </p>
                <div className="mt-10 flex items-center gap-4">
                    <div className="h-px bg-stone-300 flex-1 max-w-xs" />
                    <div className="text-amber-500 text-xl">◈</div>
                    <div className="h-px bg-stone-300 w-8" />
                </div>
            </div>

            {/* Content area */}
            <main className="max-w-4xl mx-auto px-6 pb-32 section-enter">
                <div className="prose-content">
                    {/* ===== PASTE YOUR HTML CONTENT HERE ===== */}
                </div>

                {/* Footer */}
                <div className="mt-16 pt-8 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="text-sm text-stone-400">
                        © 2025 YourApp, Inc. · All rights reserved.
                    </div>
                    <div className="flex gap-4 text-sm">
                        <a href="#" className="text-stone-400 hover:text-stone-700 transition-colors underline underline-offset-2">
                            Terms of Service
                        </a>
                        <a href="#" className="text-stone-400 hover:text-stone-700 transition-colors underline underline-offset-2">
                            Cookie Policy
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
}