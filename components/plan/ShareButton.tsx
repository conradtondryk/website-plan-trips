"use client";

import { useState, useEffect } from "react";
import { TripPlan, TripFormInput } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ShareButtonProps {
  plan: TripPlan;
  formInput: TripFormInput;
  className?: string;
}

export function ShareButton({ plan, formInput, className }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    // Check for native share support on client
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  const handleShare = async () => {
    setIsOpen(true);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, formInput }),
      });

      const result = await response.json();

      if (result.success) {
        setShareUrl(result.shareUrl);
      } else {
        setError(result.error || "Failed to create share link");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (!shareUrl) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: plan.tripName,
          text: `Check out my trip plan for ${plan.location.name}!`,
          url: shareUrl,
        });
      } catch {
        // User cancelled or error
      }
    }
  };

  return (
    <>
      <button
        onClick={handleShare}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full",
          "bg-paper-cream hover:bg-watercolor-peach/20",
          "text-ink-dark font-medium text-sm",
          "transition-all duration-200",
          "hover:shadow-watercolor",
          className
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

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md bg-paper-white border-watercolor-peach/30">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-ink-dark">
              Share Your Trip
            </DialogTitle>
            <DialogDescription className="text-ink-medium">
              Share this trip plan with friends and family
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 rounded-full border-2 border-watercolor-coral border-t-transparent animate-spin" />
              </div>
            )}

            {error && (
              <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            {shareUrl && !isLoading && (
              <>
                {/* Share URL Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-4 py-2 rounded-xl bg-paper-cream text-ink-dark text-sm border border-watercolor-peach/30 focus:outline-none"
                  />
                  <button
                    onClick={handleCopy}
                    className={cn(
                      "px-4 py-2 rounded-xl font-medium text-sm transition-all",
                      copied
                        ? "bg-watercolor-mint text-white"
                        : "bg-watercolor-coral text-white hover:bg-watercolor-peach"
                    )}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>

                {/* Native Share Button (if available) */}
                {canNativeShare && (
                  <button
                    onClick={handleNativeShare}
                    className="w-full py-3 rounded-xl bg-paper-cream text-ink-dark font-medium hover:bg-watercolor-peach/20 transition-all flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                    Share via...
                  </button>
                )}

                {/* Expiration Notice */}
                <p className="text-xs text-ink-light text-center">
                  This link will expire in 30 days
                </p>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
