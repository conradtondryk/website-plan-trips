"use client";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface PreferencesTextareaProps {
  dos: string;
  donts: string;
  onDosChange: (value: string) => void;
  onDontsChange: (value: string) => void;
  className?: string;
}

export function PreferencesTextarea({
  dos,
  donts,
  onDosChange,
  onDontsChange,
  className,
}: PreferencesTextareaProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <p className="text-sm text-ink-medium">
          Help us personalise your trip by telling us what you love and what you'd rather avoid.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="dos" className="block text-sm font-medium text-ink-medium">
          Do's <span className="text-ink-light">(optional)</span>
        </label>
        <Textarea
          id="dos"
          placeholder="Things you'd love to do or see... (e.g., 'we love Italian food, outdoor activities, local markets, sunset views')"
          value={dos}
          onChange={(e) => onDosChange(e.target.value)}
          className={cn(
            "min-h-[100px] resize-none input-watercolor",
            "placeholder:text-ink-light/70"
          )}
          maxLength={500}
        />
        <div className="flex justify-end text-xs text-ink-light">
          <p>{dos.length}/500</p>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="donts" className="block text-sm font-medium text-ink-medium">
          Don'ts <span className="text-ink-light">(optional)</span>
        </label>
        <Textarea
          id="donts"
          placeholder="Things you'd rather avoid... (e.g., 'we hate crowds, no seafood, avoid long walks, not into museums')"
          value={donts}
          onChange={(e) => onDontsChange(e.target.value)}
          className={cn(
            "min-h-[100px] resize-none input-watercolor",
            "placeholder:text-ink-light/70"
          )}
          maxLength={500}
        />
        <div className="flex justify-end text-xs text-ink-light">
          <p>{donts.length}/500</p>
        </div>
      </div>
    </div>
  );
}
