"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import CategorySelect from "@/app/components/CategorySelect";

interface Category {
    id: string;
    name: string;
}

interface TutorialCategory {
    category_id: string;
    categories: Category;
}

interface Tutorial {
    id: string;
    title: string;
    slug: string;
    content: string;
    thumbnail_url: string | null;
    created_at: string;
    tutorial_categories: TutorialCategory[];
}

const PAGE_SIZE = 12;

export default function ArchiveList() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentPage = Number(searchParams.get("page") ?? 1);
    const currentCategory = searchParams.get("category") ?? "";

    const [tutorials, setTutorials] = useState<Tutorial[]>([]);
    const [loading, setLoading] = useState(true);

    const from = (currentPage - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const fetchTutorials = useCallback(async () => {
        setLoading(true);
        const params = new URLSearchParams({
            from: String(from),
            to: String(to),
            ...(currentCategory && { categoryId: currentCategory }),
        });
        const res = await fetch(`/api/posts?${params}`);
        const data = await res.json();
        setTutorials(Array.isArray(data) ? data : []);
        setLoading(false);
    }, [from, to, currentCategory]);

    useEffect(() => {
        fetchTutorials();
    }, [fetchTutorials]);

    const updateParams = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) params.set(key, value);
        else params.delete(key);
        if (key === "category") params.delete("page");
        router.push(`?${params.toString()}`);
    };

    const handleCategoryChange = (_path: string[], categoryId: string) => {
        updateParams("category", categoryId);
    };

    const hasMore = tutorials.length === PAGE_SIZE;

    return (
        <div>
            {/* Category Filter */}
            <div className="mb-8">
                <CategorySelect onChange={handleCategoryChange} />
                {currentCategory && (
                    <button
                        onClick={() => updateParams("category", "")}
                        className="mt-2 text-xs text-gray-400 hover:text-gray-600 underline transition-colors"
                    >
                        Clear filter
                    </button>
                )}
            </div>

            {/* List */}
            {loading ? (
                <div className="space-y-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex gap-4 animate-pulse">
                            <div className="w-32 aspect-video rounded-lg bg-gray-100 shrink-0" />
                            <div className="flex-1 space-y-2 py-1">
                                <div className="h-4 bg-gray-100 rounded w-3/4" />
                                <div className="h-3 bg-gray-100 rounded w-1/4" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : tutorials.length === 0 ? (
                <p className="text-gray-400 text-sm py-12 text-center">No tutorials found.</p>
            ) : (
                <div className="divide-y divide-gray-100">
                    {tutorials.map((tutorial) => {
                        const cats = tutorial.tutorial_categories?.map((tc) => tc.categories) ?? [];
                        return (
                            <div key={tutorial.id} className="flex gap-4 py-4 items-start group hover:bg-gray-50 -mx-3 px-3 rounded-lg transition-colors">
                                <Link href={`/posts/${tutorial.slug}`} className="flex gap-4 flex-1 min-w-0">
                                    {/* Thumbnail */}
                                    <div className="relative w-32 aspect-video shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                        {tutorial.thumbnail_url ? (
                                            <Image
                                                src={tutorial.thumbnail_url}
                                                alt={tutorial.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <svg className="w-6 h-6 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-gray-600 transition-colors mb-1.5">
                                            {tutorial.title}
                                        </h2>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-xs text-gray-400">
                                                {new Date(tutorial.created_at).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </span>
                                            {cats.map((cat) => (
                                                <span
                                                    key={cat.id}
                                                    className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full"
                                                >
                                                    {cat.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </Link>

                                {/* Edit Button */}
                                <Link
                                    href={`/admin/edit/${tutorial.id}`}
                                    className="shrink-0 p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
                                    title="Edit"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {!loading && (tutorials.length > 0 || currentPage > 1) && (
                <div className="flex items-center justify-between pt-8 mt-4 border-t border-gray-100">
                    <button
                        disabled={currentPage <= 1}
                        onClick={() => updateParams("page", String(currentPage - 1))}
                        className="text-sm text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Previous
                    </button>

                    <span className="text-xs text-gray-400">Page {currentPage}</span>

                    <button
                        disabled={!hasMore}
                        onClick={() => updateParams("page", String(currentPage + 1))}
                        className="text-sm text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors"
                    >
                        Next
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}