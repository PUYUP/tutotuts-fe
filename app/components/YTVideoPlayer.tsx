"use client";

import { useEffect, useRef, useState, useId, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface YouTubePlayerProps {
    /** YouTube video URL or ID
     *  Accepts:
     *  - https://www.youtube.com/watch?v=VIDEO_ID
     *  - https://youtu.be/VIDEO_ID
     *  - https://www.youtube.com/embed/VIDEO_ID
     *  - Raw VIDEO_ID string
     */
    videoUrl: string;
    /** Aspect ratio (default: "16/9") */
    aspectRatio?: "16/9" | "4/3" | "1/1" | "9/16";
    /** Auto-play when entering viewport (default: false) */
    autoPlay?: boolean;
    /** Mute by default — required for autoplay to work (default: false) */
    muted?: boolean;
    /** Show related videos at end (default: false) */
    showRelated?: boolean;
    /** Start time in seconds (default: 0) */
    startAt?: number;
    /** Show YouTube controls (default: true) */
    controls?: boolean;
    /** Optional caption shown below player */
    caption?: string;
    /** Callback when iframe is ready */
    onReady?: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function extractVideoId(input: string): string | null {
    if (!input) return null;

    // Already a bare ID (11 chars, alphanumeric + - _)
    if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) return input.trim();

    try {
        const url = new URL(input);

        // youtu.be/ID
        if (url.hostname === "youtu.be") {
            return url.pathname.slice(1).split("?")[0] || null;
        }

        // youtube.com/watch?v=ID
        const v = url.searchParams.get("v");
        if (v) return v;

        // youtube.com/embed/ID or youtube.com/shorts/ID
        const match = url.pathname.match(/\/(embed|shorts|v)\/([a-zA-Z0-9_-]{11})/);
        if (match) return match[2];
    } catch {
        // not a URL
    }

    return null;
}

const ASPECT_MAP: Record<NonNullable<YouTubePlayerProps["aspectRatio"]>, string> = {
    "16/9": "56.25%",
    "4/3": "75%",
    "1/1": "100%",
    "9/16": "177.78%",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function YouTubePlayer({
    videoUrl,
    aspectRatio = "9/16",
    autoPlay = false,
    muted = false,
    showRelated = false,
    startAt = 0,
    controls = true,
    caption,
    onReady,
}: YouTubePlayerProps) {
    const uid = useId().replace(/:/g, "");
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
    const [isVisible, setIsVisible] = useState(false);

    const videoId = extractVideoId(videoUrl);

    // ── Intersection Observer: trigger load only when visible ──
    useEffect(() => {
        const el = wrapperRef.current;
        if (!el || !videoId) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [videoId]);

    // ── Build embed URL ──
    const embedUrl = useCallback((): string => {
        if (!videoId) return "";
        const params = new URLSearchParams({
            rel: showRelated ? "1" : "0",
            autoplay: autoPlay ? "1" : "0",
            mute: muted || autoPlay ? "1" : "0", // autoplay requires mute
            controls: controls ? "1" : "0",
            start: String(startAt),
            modestbranding: "1",
            playsinline: "1",
            enablejsapi: "1",
            origin: typeof window !== "undefined" ? window.location.origin : "",
        });
        return `https://www.youtube.com/embed/${videoId}?${params}`;
    }, [videoId, showRelated, autoPlay, muted, controls, startAt]);

    // ── Render iframe once visible ──
    useEffect(() => {
        if (!isVisible || !videoId) return;
        setStatus("loading");
    }, [isVisible, videoId]);

    const handleLoad = useCallback(() => {
        setStatus("ready");
        onReady?.();
    }, [onReady]);

    const handleError = useCallback(() => {
        setStatus("error");
    }, []);

    const paddingTop = ASPECT_MAP[aspectRatio];

    if (!videoId) {
        return (
            <div className="yt-player yt-player--invalid">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p>URL video YouTube tidak valid</p>
                <span>{videoUrl}</span>
                <YTStyles />
            </div>
        );
    }

    return (
        <figure className="yt-player" id={`yt-${uid}`}>
            {/* ── Responsive ratio box ── */}
            <div className="yt-player__stage" ref={wrapperRef} style={{ paddingTop }}>

                {/* Skeleton / Loading */}
                {(status === "idle" || status === "loading") && (
                    <div className="yt-player__skeleton" aria-hidden="true">
                        <div className="yt-player__skeleton-bg" />
                        <div className="yt-player__skeleton-shimmer" />
                        <div className="yt-player__play-badge">
                            {/* YouTube play icon */}
                            <svg viewBox="0 0 68 48" aria-hidden="true">
                                <path
                                    className="yt-player__play-badge-bg"
                                    d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"
                                />
                                <path
                                    className="yt-player__play-badge-arrow"
                                    d="M45 24 27 14v20"
                                />
                            </svg>
                        </div>
                        {status === "loading" && (
                            <div className="yt-player__spinner">
                                <div className="yt-player__spinner-ring" />
                            </div>
                        )}
                    </div>
                )}

                {/* Error */}
                {status === "error" && (
                    <div className="yt-player__error">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <p>Video tidak dapat dimuat</p>
                        <a
                            href={`https://www.youtube.com/watch?v=${videoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="yt-player__error-link"
                        >
                            Buka di YouTube →
                        </a>
                    </div>
                )}

                {/* Iframe — only injected when visible */}
                {isVisible && status !== "error" && (
                    <iframe
                        className={`yt-player__iframe ${status === "ready" ? "yt-player__iframe--visible" : ""}`}
                        src={embedUrl()}
                        title={`YouTube video ${videoId}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        loading="lazy"
                        onLoad={handleLoad}
                        onError={handleError}
                    />
                )}
            </div>

            {/* Caption */}
            {caption && (
                <figcaption className="yt-player__caption">{caption}</figcaption>
            )}

            <YTStyles />
        </figure>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

function YTStyles() {
    return (
        <style>{`
      .yt-player {
        --yt-red: #ff0000;
        --yt-red-dark: #cc0000;
        --yt-black: #0f0f0f;
        --yt-surface: #1a1a1a;
        --yt-muted: #aaa;
        --yt-radius: 0;
        --yt-shadow: 0 8px 32px rgba(0,0,0,.18);
        margin: 0;
        display: block;
        font-family: "Roboto", -apple-system, BlinkMacSystemFont, sans-serif;
      }

      /* ── Stage (aspect-ratio trick) ── */
      .yt-player__stage {
        position: relative;
        width: 100%;
        height: 0;
        background: var(--yt-black);
        border-radius: var(--yt-radius);
        overflow: hidden;
        box-shadow: var(--yt-shadow);
      }

      /* ── Iframe ── */
      .yt-player__iframe {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        border: none;
        opacity: 0;
        transition: opacity .4s ease;
      }

      .yt-player__iframe--visible {
        opacity: 1;
      }

      /* ── Skeleton ── */
      .yt-player__skeleton {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2;
      }

      .yt-player__skeleton-bg {
        position: absolute;
        inset: 0;
        background: linear-gradient(160deg, #1a1a1a 0%, #0a0a0a 100%);
      }

      .yt-player__skeleton-shimmer {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          105deg,
          transparent 30%,
          rgba(255,255,255,.04) 50%,
          transparent 70%
        );
        background-size: 200% 100%;
        animation: yt-shimmer 2s infinite;
      }

      @keyframes yt-shimmer {
        0%   { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }

      /* ── Play badge ── */
      .yt-player__play-badge {
        position: relative;
        z-index: 3;
        opacity: .7;
      }

      .yt-player__play-badge svg {
        width: 68px;
        height: 48px;
        filter: drop-shadow(0 2px 8px rgba(0,0,0,.6));
      }

      .yt-player__play-badge-bg {
        fill: var(--yt-red);
        transition: fill .2s;
      }

      .yt-player__play-badge-arrow {
        fill: #fff;
      }

      /* ── Loading spinner ── */
      .yt-player__spinner {
        position: absolute;
        bottom: 16px;
        right: 16px;
        z-index: 4;
      }

      .yt-player__spinner-ring {
        width: 20px;
        height: 20px;
        border: 2px solid rgba(255,255,255,.15);
        border-top-color: var(--yt-red);
        border-radius: 50%;
        animation: yt-spin .8s linear infinite;
      }

      @keyframes yt-spin {
        to { transform: rotate(360deg); }
      }

      /* ── Error ── */
      .yt-player__error {
        position: absolute;
        inset: 0;
        background: var(--yt-black);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px;
        padding: 24px;
        z-index: 3;
      }

      .yt-player__error svg {
        width: 36px;
        height: 36px;
        color: var(--yt-red);
      }

      .yt-player__error p {
        margin: 0;
        font-size: 14px;
        font-weight: 500;
        color: #e0e0e0;
      }

      .yt-player__error-link {
        font-size: 13px;
        color: var(--yt-red);
        text-decoration: none;
        font-weight: 600;
        letter-spacing: .3px;
      }

      .yt-player__error-link:hover {
        text-decoration: underline;
      }

      /* ── Caption ── */
      .yt-player__caption {
        margin: 8px 4px 0;
        font-size: 13px;
        color: var(--yt-muted);
        line-height: 1.5;
        text-align: center;
      }

      /* ── Invalid state ── */
      .yt-player--invalid {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 32px;
        background: #111;
        border-radius: var(--yt-radius);
        box-shadow: var(--yt-shadow);
      }

      .yt-player--invalid svg {
        width: 36px;
        height: 36px;
        color: var(--yt-red);
      }

      .yt-player--invalid p {
        margin: 0;
        font-size: 14px;
        font-weight: 500;
        color: #e0e0e0;
      }

      .yt-player--invalid span {
        font-size: 11px;
        color: #666;
        word-break: break-all;
        text-align: center;
        max-width: 300px;
      }
    `}</style>
    );
}