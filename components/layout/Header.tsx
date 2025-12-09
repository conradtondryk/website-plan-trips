"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
  showShareButton?: boolean;
  onShareClick?: () => void;
}

export function Header({ className, showShareButton, onShareClick }: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full backdrop-blur-sm bg-paper-white/80",
        "border-b border-watercolor-peach/20",
        className
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            {/* Logo icon - compass/map pin style */}
            <svg
              className="w-8 h-8 text-watercolor-coral group-hover:scale-110 transition-transform"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="16"
                cy="16"
                r="14"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M16 6L20 16L16 26L12 16L16 6Z"
                fill="url(#logo-gradient)"
                stroke="currentColor"
                strokeWidth="1"
              />
              <circle cx="16" cy="16" r="3" fill="currentColor" />
              <defs>
                <linearGradient id="logo-gradient" x1="16" y1="6" x2="16" y2="26">
                  <stop stopColor="#FF6B6B" />
                  <stop offset="1" stopColor="#FFA07A" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="font-display text-2xl text-ink-dark group-hover:text-watercolor-coral transition-colors">
            Tripper
          </span>
        </Link>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {showShareButton && onShareClick && (
            <button
              onClick={onShareClick}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full",
                "bg-paper-cream hover:bg-watercolor-peach/20",
                "text-ink-dark font-medium text-sm",
                "transition-all duration-200",
                "hover:shadow-watercolor"
              )}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              Share
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
