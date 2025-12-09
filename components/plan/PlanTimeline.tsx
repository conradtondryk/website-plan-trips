"use client";

import { DayPlan } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PlanCard } from "./PlanCard";

interface PlanTimelineProps {
  dayPlan: DayPlan;
  selectedActivityId?: string | null;
  onActivityClick?: (activityId: string) => void;
  className?: string;
}

export function PlanTimeline({
  dayPlan,
  selectedActivityId,
  onActivityClick,
  className,
}: PlanTimelineProps) {
  if (dayPlan.activities.length === 0) {
    return (
      <div className={cn("text-center py-12", className)}>
        <p className="text-ink-medium">No activities planned for this day.</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {dayPlan.activities.map((activity, index) => (
        <div key={activity.id} className="relative">
          {/* Timeline connector */}
          {index < dayPlan.activities.length - 1 && (
            <div
              className="absolute left-6 top-full w-0.5 h-4 z-0"
              style={{
                background: "linear-gradient(to bottom, #FF6B6B, #FFA07A)",
                opacity: 0.3,
              }}
            />
          )}

          {/* Activity card with animation delay */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <PlanCard
              activity={activity}
              isSelected={activity.id === selectedActivityId}
              onClick={() => onActivityClick?.(activity.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
