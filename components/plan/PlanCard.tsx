"use client";

import { Activity, ACTIVITY_ICONS, PriceRange } from "@/lib/types";
import { cn, formatTime } from "@/lib/utils";
import { HiddenGemBadge } from "./HiddenGemBadge";

interface PlanCardProps {
  activity: Activity;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

function PriceIndicator({ priceRange }: { priceRange: PriceRange }) {
  const levels = ["$", "$$", "$$$", "$$$$"];
  const activeIndex = levels.indexOf(priceRange);

  return (
    <span className="price-indicator" aria-label={`Price: ${priceRange}`}>
      {levels.map((level, index) => (
        <span
          key={level}
          className={cn(index <= activeIndex && "active")}
        >
          $
        </span>
      ))}
    </span>
  );
}

function ActivityTypeBadge({ type }: { type: Activity["type"] }) {
  const badgeClasses: Record<Activity["type"], string> = {
    restaurant: "badge-restaurant",
    museum: "badge-museum",
    activity: "badge-activity",
    attraction: "badge-attraction",
    nightlife: "badge-nightlife",
    scenic: "badge-scenic",
  };

  return (
    <span className={cn("badge-watercolor", badgeClasses[type])}>
      {ACTIVITY_ICONS[type]} {type}
    </span>
  );
}

export function PlanCard({
  activity,
  isSelected,
  onClick,
  className,
}: PlanCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={cn(
        "w-full text-left card-watercolor p-4 transition-all duration-200 cursor-pointer",
        "hover:shadow-watercolor-lg hover:-translate-y-0.5",
        "focus:outline-none focus:ring-2 focus:ring-watercolor-coral/50",
        isSelected && "ring-2 ring-watercolor-coral shadow-watercolor-lg",
        className
      )}
    >
      {/* Time */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-medium text-watercolor-coral">
          {formatTime(activity.time)}
        </span>
        {activity.isHiddenGem && activity.hiddenGemReason && (
          <HiddenGemBadge reason={activity.hiddenGemReason} />
        )}
      </div>

      {/* Activity Name */}
      <h3 className="font-display text-xl text-ink-dark mb-2 flex items-center gap-2">
        <span className="text-2xl">{ACTIVITY_ICONS[activity.type]}</span>
        {activity.name}
      </h3>

      {/* Description */}
      <p className="text-sm text-ink-medium mb-3 line-clamp-2">
        {activity.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <ActivityTypeBadge type={activity.type} />
        <PriceIndicator priceRange={activity.priceRange} />
      </div>
    </div>
  );
}
