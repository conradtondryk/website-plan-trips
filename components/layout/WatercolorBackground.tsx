"use client";

import { cn } from "@/lib/utils";

interface WatercolorBackgroundProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "warm" | "cool" | "mint";
}

export function WatercolorBackground({
  children,
  className,
  variant = "default",
}: WatercolorBackgroundProps) {
  return (
    <div className={cn("relative min-h-screen overflow-hidden", className)}>
      {/* Background base */}
      <div className="fixed inset-0 bg-paper-white -z-10" />

      {/* Decorative watercolor splashes */}
      <div
        className={cn(
          "watercolor-splash fixed -top-32 -right-32 w-96 h-96 -z-10",
          variant === "warm" && "watercolor-splash",
          variant === "cool" && "watercolor-splash-sky",
          variant === "mint" && "watercolor-splash-mint"
        )}
        style={{
          background:
            variant === "default"
              ? "radial-gradient(ellipse at center, rgba(255, 107, 107, 0.3) 0%, rgba(255, 167, 122, 0.15) 40%, transparent 70%)"
              : undefined,
        }}
      />

      <div
        className={cn(
          "watercolor-splash fixed -bottom-48 -left-48 w-[500px] h-[500px] -z-10",
          variant === "warm" && "watercolor-splash-mint",
          variant === "cool" && "watercolor-splash",
          variant === "mint" && "watercolor-splash-sky"
        )}
        style={{
          background:
            variant === "default"
              ? "radial-gradient(ellipse at center, rgba(77, 150, 255, 0.25) 0%, rgba(155, 89, 182, 0.1) 40%, transparent 70%)"
              : undefined,
        }}
      />

      <div
        className="watercolor-splash fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] -z-10 opacity-10"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255, 217, 61, 0.4) 0%, transparent 60%)",
        }}
      />

      {/* Content */}
      <div className="relative z-0">{children}</div>
    </div>
  );
}
