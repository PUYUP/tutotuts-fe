"use client";

import MarkdownIt from "markdown-it";
import Image from "next/image";
import { useState } from "react";
import { CategoryNode } from "../data/categories";

const md = new MarkdownIt();

function getCategoryPath(nodes: CategoryNode[], targetId: string): string[] | null {
    for (const node of nodes) {
        if (node.id === targetId) {
            return [node.name];
        }
        if (node.children?.length) {
            const childPath = getCategoryPath(node.children, targetId);
            if (childPath) return [node.name, ...childPath];
        }
    }
    return null;
}

export default function PostCard({ post }: { post: any }) {
    const [votes, setVotes] = useState<number>(post.votes ?? 0);
    const [voted, setVoted] = useState<boolean>(false);

    function handleVote() {
        if (voted) {
            setVotes((v) => v - 1);
            setVoted(false);
        } else {
            setVotes((v) => v + 1);
            setVoted(true);
        }
    }

    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="bg-gray-100 px-4 py-3 h-26 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                    <div className="block flex-1">
                        <h3 className="font-bold text-gray-900 line-clamp-2 flex-1">{post.title}</h3>
                        <div className="mt-1 text-xs text-neutral-600">
                            23 hours ago
                        </div>
                    </div>

                    {/* It Works Stats + Vote Button */}
                    <div className="flex flex-col items-center shrink-0">
                        <button
                            onClick={handleVote}
                            className={`flex flex-col items-center px-2 py-1 rounded-lg border text-xs font-semibold transition-all
                                ${voted
                                    ? "bg-green-500 border-green-500 text-white"
                                    : "bg-white border-gray-300 text-gray-500 hover:border-green-400 hover:text-green-500"
                                }`}
                        >
                            <span className="text-base leading-none">✓</span>
                            <span className="mt-0.5">It Works</span>
                        </button>
                        <span className="text-xs text-green-700 mt-1">
                            {votes} {votes === 1 ? "vote" : "votes"}
                        </span>
                    </div>
                </div>


            </div>

            <div className="block">
                <div className="grid grid-cols-2">
                    {post.sourceUrl && (
                        <div className="relative" style={{ paddingBottom: '177.78%' }}>
                            <iframe
                                src={post.sourceUrl}
                                style={{ border: 'none', overflow: 'hidden' }}
                                allowFullScreen={true}
                                className="absolute inset-0 w-full h-full"
                                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                            />
                        </div>
                    )}

                    <div className="flex flex-col">
                        <div className="relative" style={{ paddingBottom: '88.89%' }}>
                            <Image
                                src={post.image.before}
                                alt="before"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="relative" style={{ paddingBottom: '88.89%' }}>
                            <Image
                                src={post.image.after}
                                alt="after"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4">
                <div className="text-sm text-gray-700 mb-3">
                    <strong>Category:</strong>{" "}
                    {post.categoryPath ? post.categoryPath.join(" / ") : "None"}
                </div>
                <div
                    className="prose prose-sm max-w-none text-sm"
                    dangerouslySetInnerHTML={{ __html: md.render(String(post.content ?? "")) }}
                />
            </div>
        </div>
    );
}