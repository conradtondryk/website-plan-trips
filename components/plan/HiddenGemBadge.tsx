"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HiddenGemBadgeProps {
  reason: string;
  className?: string;
}

export function HiddenGemBadge({ reason, className }: HiddenGemBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>
          <span
            role="button"
            tabIndex={0}
            className={cn(
              "hidden-gem-star inline-flex items-center gap-1 cursor-pointer",
              "focus:outline-none focus:ring-2 focus:ring-watercolor-gold/50 rounded",
              className
            )}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                setIsOpen(!isOpen);
              }
            }}
            aria-label="Hidden gem - tap to learn more"
          >
            <span className="text-lg">⭐</span>
            <span className="text-xs font-medium text-watercolor-gold hidden sm:inline">
              Hidden Gem
            </span>
          </span>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="tooltip-watercolor max-w-[280px] p-4"
          sideOffset={8}
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">💎</span>
              <span className="font-display text-lg text-ink-dark">Hidden Gem</span>
            </div>
            <p className="text-sm text-ink-medium leading-relaxed">{reason}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
