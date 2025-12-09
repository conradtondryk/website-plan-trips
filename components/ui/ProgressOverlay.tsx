"use client";

import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ProgressOverlayProps {
  isVisible: boolean;
  onComplete?: () => void;
}

const PROGRESS_MESSAGES = [
  "Finding the best spots...",
  "Discovering hidden gems...",
  "Crafting your itinerary...",
  "Adding local favourites...",
  "Polishing the details...",
  "Almost there...",
];

export function ProgressOverlay({ isVisible, onComplete }: ProgressOverlayProps) {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Reset state when visibility changes
  useEffect(() => {
    if (isVisible) {
      setProgress(0);
      setMessageIndex(0);
      setIsComplete(false);
    }
  }, [isVisible]);

  // Fake progress animation using psychological pacing
  // Fast start -> medium -> slow crawl (never hits 100 until actually complete)
  useEffect(() => {
    if (!isVisible || isComplete) return;

    const intervals: NodeJS.Timeout[] = [];

    // Phase 1: Quick start (0-40%) - 1.5 seconds, gives immediate feedback
    const phase1 = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 40) {
          clearInterval(phase1);
          return prev;
        }
        return prev + 2;
      });
    }, 75);
    intervals.push(phase1);

    // Phase 2: Medium pace (40-70%) - starts after 1.5s
    const phase2Timeout = setTimeout(() => {
      const phase2 = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 70) {
            clearInterval(phase2);
            return prev;
          }
          return prev + 1;
        });
      }, 150);
      intervals.push(phase2);
    }, 1500);

    // Phase 3: Slow crawl (70-92%) - starts after 4.5s
    const phase3Timeout = setTimeout(() => {
      const phase3 = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 92) {
            clearInterval(phase3);
            return prev;
          }
          return prev + 0.5;
        });
      }, 400);
      intervals.push(phase3);
    }, 4500);

    return () => {
      intervals.forEach(clearInterval);
      clearTimeout(phase2Timeout);
      clearTimeout(phase3Timeout);
    };
  }, [isVisible, isComplete]);

  // Rotate messages based on progress
  useEffect(() => {
    if (!isVisible) return;

    const thresholds = [0, 20, 40, 60, 80, 90];
    const newIndex = thresholds.filter((t) => progress >= t).length - 1;

    if (newIndex !== messageIndex && newIndex >= 0 && newIndex < PROGRESS_MESSAGES.length) {
      setMessageIndex(newIndex);
    }
  }, [progress, isVisible, messageIndex]);

  // Method to complete the progress (called externally when API finishes)
  const completeProgress = useCallback(() => {
    setIsComplete(true);
    setProgress(100);
    setMessageIndex(PROGRESS_MESSAGES.length - 1);

    // Small delay before calling onComplete to show 100%
    setTimeout(() => {
      onComplete?.();
    }, 400);
  }, [onComplete]);

  // Expose completeProgress through a custom event
  useEffect(() => {
    const handleComplete = () => completeProgress();
    window.addEventListener("tripPlanComplete", handleComplete);
    return () => window.removeEventListener("tripPlanComplete", handleComplete);
  }, [completeProgress]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-paper-cream/95 backdrop-blur-sm">
      <div className="w-full max-w-md px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-watercolor-coral to-watercolor-peach animate-pulse">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-display text-ink-dark mb-2">
            Planning Your Adventure
          </h2>
          <p className="text-ink-medium animate-fade-in" key={messageIndex}>
            {PROGRESS_MESSAGES[messageIndex]}
          </p>
        </div>

        {/* Progress bar container */}
        <div className="relative">
          {/* Background track */}
          <div className="h-3 rounded-full bg-white/50 border border-watercolor-coral/20 overflow-hidden">
            {/* Progress fill with watercolor gradient */}
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300 ease-out",
                "bg-gradient-to-r from-watercolor-coral via-watercolor-peach to-watercolor-gold"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Percentage text */}
          <div className="mt-3 text-center">
            <span className="text-sm font-medium text-ink-medium">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Decorative dots animation */}
        <div className="flex justify-center gap-2 mt-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-watercolor-coral/60 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper to trigger completion from outside the component
export function triggerProgressComplete() {
  window.dispatchEvent(new CustomEvent("tripPlanComplete"));
}
