"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface BudgetInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

export function BudgetInput({
  value,
  onChange,
  error,
  className,
}: BudgetInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    onChange(numericValue);
  };

  // Format for display
  const displayValue = value
    ? new Intl.NumberFormat("en-GB").format(parseInt(value, 10) || 0)
    : "";

  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor="budget" className="block text-sm font-medium text-ink-medium">
        Budget <span className="text-watercolor-coral">*</span>
      </label>
      <div
        className={cn(
          "flex items-center rounded-xl border bg-paper-white overflow-hidden",
          "border-watercolor-coral/30 focus-within:border-watercolor-coral focus-within:ring-2 focus-within:ring-watercolor-coral/20",
          error && "border-destructive focus-within:border-destructive focus-within:ring-destructive/20"
        )}
      >
        <div className="flex items-center justify-center w-12 h-full border-r border-watercolor-coral/20">
          <span className="text-watercolor-gold font-semibold text-lg">£</span>
        </div>
        <Input
          id="budget"
          type="text"
          inputMode="numeric"
          placeholder="Enter budget in your local currency"
          value={displayValue}
          onChange={handleChange}
          className="flex-1 border-0 bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      <p className="text-xs text-ink-light">
        Enter your total trip budget (accommodation, food, activities, etc.)
      </p>
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
