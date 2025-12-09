"use client";

import { TripType, TRIP_TYPE_OPTIONS } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TripTypeSelectorProps {
  value: TripType;
  onChange: (value: TripType) => void;
  className?: string;
}

export function TripTypeSelector({
  value,
  onChange,
  className,
}: TripTypeSelectorProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm font-medium text-ink-medium">
        Trip Type
      </label>
      <div className="flex gap-2 flex-wrap">
        {TRIP_TYPE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "trip-type-pill flex items-center gap-2",
              "focus:outline-none focus:ring-2 focus:ring-watercolor-coral/50",
              value === option.value && "text-white"
            )}
            data-selected={value === option.value}
          >
            <span className="text-lg">{option.icon}</span>
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
