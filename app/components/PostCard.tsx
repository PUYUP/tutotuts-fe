"use client";

import MarkdownIt from "markdown-it";
import Image from "next/image";
import { useState } from "react";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const md = new MarkdownIt();

function PlayButton() {
    return (
        <button className="w-16 h-16 rounded-full bg-[#ef4444] backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-105 transition cursor-pointer">
            <PlayArrowIcon sx={{ fontSize: 48, color: "#ffffff" }} />
        </button>
    );
}

export default function PostCard({ post, onPlay }: { post: any, onPlay: (post: any) => void }) {
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

    function playVideo(post: any) {
        onPlay(post);
    }

    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="bg-gray-100 px-4 py-3 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                    <div className="block flex-1">
                        <div className="text-xs text-gray-500 mb-1">
                            {post.categoryPath ? post.categoryPath.join(" / ") : "None"}
                        </div>
                        <h3 className="font-bold text-gray-900 line-clamp-2 flex-1 text-sm md:text-base">{post.title}</h3>
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

            <div className="block relative">
                <div className="grid grid-cols-2">
                    {post.sourceUrl && (
                        <div className="relative" style={{ paddingBottom: '177.78%' }}>
                            <div className="absolute inset-0 w-full h-full overflow-hidden">
                                <Image
                                    src={post.images.thumbnail}
                                    alt="thumbnail"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col">
                        <div className="relative" style={{ paddingBottom: '88.89%' }}>
                            <Image
                                src={post.images.before}
                                alt="before"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="relative" style={{ paddingBottom: '88.89%' }}>
                            <Image
                                src={post.images.after}
                                alt="after"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>

                <div onClick={() => playVideo(post)} className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                    <div>
                        <PlayButton />
                    </div>
                </div>
            </div>

            <div className="p-4">
                <div
                    className="prose prose-sm max-w-none text-sm post-content"
                    dangerouslySetInnerHTML={{ __html: md.render(String(post.content ?? "")) }}
                />
            </div>
        </div>
    );
}