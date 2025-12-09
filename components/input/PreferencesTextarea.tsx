"use client";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface PreferencesTextareaProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function PreferencesTextarea({
  value,
  onChange,
  className,
}: PreferencesTextareaProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor="preferences" className="block text-sm font-medium text-ink-medium">
        Preferences <span className="text-ink-light">(optional)</span>
      </label>
      <Textarea
        id="preferences"
        placeholder="Tell us your do's and don'ts... (e.g., 'we love Italian food but hate crowds, prefer outdoor activities, one of us is vegetarian')"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "min-h-[120px] resize-none input-watercolor",
          "placeholder:text-ink-light/70"
        )}
        maxLength={1000}
      />
      <div className="flex justify-between text-xs text-ink-light">
        <p>Share any preferences, dietary restrictions, or interests</p>
        <p>{value.length}/1000</p>
      </div>
    </div>
  );
}
