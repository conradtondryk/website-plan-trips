"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

export function LocationInput({
  value,
  onChange,
  error,
  className,
}: LocationInputProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor="location" className="block text-sm font-medium text-ink-medium">
        Where are you going? <span className="text-watercolor-coral">*</span>
      </label>
      <div
        className={cn(
          "flex items-center rounded-xl border bg-paper-white overflow-hidden",
          "border-watercolor-coral/30 focus-within:border-watercolor-coral focus-within:ring-2 focus-within:ring-watercolor-coral/20",
          error && "border-destructive focus-within:border-destructive focus-within:ring-destructive/20"
        )}
      >
        <div className="flex items-center justify-center w-12 h-full border-r border-watercolor-coral/20">
          <svg
            className="w-5 h-5 text-watercolor-coral"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <Input
          id="location"
          type="text"
          placeholder="Paris, Tokyo, New York..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 border-0 bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      {error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
