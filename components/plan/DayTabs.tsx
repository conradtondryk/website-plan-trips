"use client";

import { DayPlan } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

interface DayTabsProps {
  days: DayPlan[];
  selectedDayIndex: number;
  onDaySelect: (index: number) => void;
  className?: string;
}

export function DayTabs({
  days,
  selectedDayIndex,
  onDaySelect,
  className,
}: DayTabsProps) {
  return (
    <div className={cn("overflow-x-auto scrollbar-hide", className)}>
      <div className="flex gap-2 min-w-max pb-2">
        {days.map((day, index) => (
          <button
            key={day.date}
            type="button"
            onClick={() => onDaySelect(index)}
            className={cn(
              "day-tab whitespace-nowrap",
              "focus:outline-none focus:ring-2 focus:ring-watercolor-coral/50"
            )}
            data-selected={selectedDayIndex === index}
          >
            <span className="font-medium">Day {index + 1}</span>
            <span className="text-xs ml-1 opacity-70">
              {formatDate(day.date)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
