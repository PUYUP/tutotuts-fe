"use client";

import { useEffect, useRef, useState, useCallback, useId } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

declare global {
    interface Window {
        FB: {
            init: (options: object) => void;
            XFBML: { parse: (el?: HTMLElement) => void };
        };
        fbAsyncInit?: () => void;
    }
}

interface FacebookVideoPlayerProps {
    /** Full Facebook video URL, e.g. https://www.facebook.com/video/1234567890 */
    videoUrl: string;
    /** Width of the player (default: "100%") */
    width?: string | number;
    /** Aspect ratio for the loading skeleton (default: "16/9") */
    aspectRatio?: "16/9" | "4/3" | "1/1" | "9/16";
    /** Auto-play when loaded (default: false) */
    autoPlay?: boolean;
    /** Show captions (default: false) */
    showCaptions?: boolean;
    /** Optional title shown above player */
    title?: string;
    /** Callback fired when the SDK finishes parsing this player */
    onReady?: () => void;
}

const ASPECT_MAP: Record<NonNullable<FacebookVideoPlayerProps["aspectRatio"]>, string> = {
    "16/9": "56.25%",
    "4/3": "75%",
    "1/1": "100%",
    "9/16": "177.78%",
};

// ─── SDK loader (singleton promise) ──────────────────────────────────────────

let sdkPromise: Promise<void> | null = null;

function loadFacebookSDK(appId = ""): Promise<void> {
    if (sdkPromise) return sdkPromise;

    sdkPromise = new Promise((resolve) => {
        if (typeof window === "undefined") return resolve();
        if (window.FB) return resolve();

        window.fbAsyncInit = () => {
            window.FB.init({ appId, xfbml: true, version: "v19.0" });
            resolve();
        };

        if (!document.getElementById("facebook-jssdk")) {
            const script = document.createElement("script");
            script.id = "facebook-jssdk";
            script.src = "https://connect.facebook.net/en_US/sdk.js";
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
        }
    });

    return sdkPromise;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function FacebookVideoPlayer({
    videoUrl,
    width = "100%",
    aspectRatio = "9/16",
    autoPlay = false,
    showCaptions = false,
    title,
    onReady,
}: FacebookVideoPlayerProps) {
    const containerId = useId().replace(/:/g, "");
    const containerRef = useRef<HTMLDivElement>(null);
    const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
    const [isVisible, setIsVisible] = useState(false);

    const paddingTop = ASPECT_MAP[aspectRatio];

    // Intersection Observer – only parse when player enters viewport
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
            { threshold: 0.1 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const parsePlayer = useCallback(() => {
        const el = containerRef.current;
        if (!el || !window.FB) return;
        try {
            window.FB.XFBML.parse(el);
            setTimeout(() => { setStatus("ready"); onReady?.(); }, 800);
        } catch {
            setStatus("error");
        }
    }, [onReady]);

    useEffect(() => {
        if (!isVisible) return;
        loadFacebookSDK(process.env.NEXT_PUBLIC_FACEBOOK_APP_ID)
            .then(parsePlayer)
            .catch(() => setStatus("error"));
    }, [isVisible, parsePlayer]);

    const normalizedWidth = typeof width === "number" ? `${width}px` : width;

    return (
        <div ref={containerRef} className="fb-video-player" style={{ width: normalizedWidth }}>

            {/* ── Header ── */}
            {title && (
                <div className="fb-video-player__header">
                    <svg className="fb-video-player__fb-icon" viewBox="0 0 24 24" aria-hidden="true">
                        <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span className="fb-video-player__title">{title}</span>
                </div>
            )}

            {/* ── Stage: aspect-ratio box ── */}
            <div
                className="fb-video-player__stage"
                style={{ paddingTop: status === "ready" ? "0" : paddingTop }}
            >
                {/* Loading skeleton */}
                {status === "loading" && (
                    <div className="fb-video-player__skeleton" aria-label="Loading video">
                        <div className="fb-video-player__skeleton-shine" />
                        <div className="fb-video-player__skeleton-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <polygon points="5,3 19,12 5,21" />
                            </svg>
                        </div>
                    </div>
                )}

                {/* Error state */}
                {status === "error" && (
                    <div className="fb-video-player__error">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <p>Video tidak dapat dimuat</p>
                        <span>{videoUrl}</span>
                    </div>
                )}

                {/* Facebook embed div – always rendered so SDK can find it */}
                <div
                    id={containerId}
                    className={`fb-video fb-video-player__embed${status !== "ready" ? " fb-video-player__embed--hidden" : ""}`}
                    data-href={videoUrl}
                    data-width={normalizedWidth === "100%" ? "auto" : normalizedWidth}
                    data-allowfullscreen="true"
                    data-autoplay={autoPlay ? "true" : "false"}
                    data-show-captions={showCaptions ? "true" : "false"}
                />
            </div>

            <style>{`
        .fb-video-player {
          --fb-blue: #1877f2;
          --fb-radius: 0px;
          --fb-shadow: 0 4px 24px rgba(0,0,0,.12);
          --fb-bg: #ffffff;
          --fb-text: #1c1e21;
          --fb-muted: #65676b;
          --fb-border: #e4e6eb;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .fb-video-player__header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px 10px;
          background: var(--fb-bg);
          border: 1px solid var(--fb-border);
          border-bottom: none;
          border-radius: var(--fb-radius) var(--fb-radius) 0 0;
        }

        .fb-video-player__fb-icon {
          width: 20px; height: 20px;
          color: var(--fb-blue);
          flex-shrink: 0;
        }

        .fb-video-player__title {
          font-size: 14px;
          font-weight: 600;
          color: var(--fb-text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ── Aspect-ratio stage ── */
        .fb-video-player__stage {
          position: relative;
          width: 100%;
          background: #000;
          overflow: hidden;
          box-shadow: var(--fb-shadow);
          border: 1px solid var(--fb-border);
          border-top: ${title ? "none" : ""};

        }

        /* Skeleton & error: fill the padded stage absolutely */
        .fb-video-player__skeleton,
        .fb-video-player__error {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .fb-video-player__skeleton {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          z-index: 2;
        }

        .fb-video-player__skeleton-shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            transparent 35%,
            rgba(255,255,255,.06) 50%,
            transparent 65%
          );
          background-size: 200% 100%;
          animation: fb-shimmer 1.8s infinite;
        }

        @keyframes fb-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .fb-video-player__skeleton-icon {
          position: relative;
          width: 56px; height: 56px;
          background: rgba(255,255,255,.12);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(4px);
        }

        .fb-video-player__skeleton-icon svg {
          width: 22px; height: 22px;
          color: rgba(255,255,255,.5);
          transform: translateX(2px);
        }

        .fb-video-player__error {
          background: #1c1e21;
          flex-direction: column;
          gap: 8px;
          padding: 24px;
          z-index: 2;
        }

        .fb-video-player__error svg {
          width: 40px; height: 40px;
          color: #e41e3f;
          opacity: .8;
        }

        .fb-video-player__error p {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: #e4e6eb;
        }

        .fb-video-player__error span {
          font-size: 11px;
          color: var(--fb-muted);
          word-break: break-all;
          text-align: center;
          max-width: 280px;
        }

        /* Embed */
        .fb-video-player__embed {
          display: block;
          width: 100% !important;
          transition: opacity .3s ease;
        }

        .fb-video-player__embed iframe {
          width: 100% !important;
          display: block;
        }

        .fb-video-player__embed--hidden {
          opacity: 0;
          pointer-events: none;
          position: absolute;
          top: 0; left: 0;
        }
      `}</style>
        </div>
    );
}