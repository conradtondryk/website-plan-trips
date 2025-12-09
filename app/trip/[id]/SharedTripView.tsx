"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { SharedTrip } from "@/lib/types";
import { cn, formatDateRange, formatCurrency } from "@/lib/utils";
import { WatercolorBackground } from "@/components/layout/WatercolorBackground";
import { Header } from "@/components/layout/Header";
import { DayTabs } from "@/components/plan/DayTabs";
import { PlanTimeline } from "@/components/plan/PlanTimeline";

// Dynamic import for map to avoid SSR issues
const TripMap = dynamic(
  () => import("@/components/map/TripMap").then((mod) => mod.TripMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[300px] md:h-[400px] bg-paper-cream animate-pulse rounded-xl flex items-center justify-center">
        <span className="text-ink-light">Loading map...</span>
      </div>
    ),
  }
);

interface SharedTripViewProps {
  sharedTrip: SharedTrip;
}

export function SharedTripView({ sharedTrip }: SharedTripViewProps) {
  const router = useRouter();
  const { plan, formInput } = sharedTrip;
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);

  const handleActivityClick = (activityId: string) => {
    setSelectedActivityId(activityId === selectedActivityId ? null : activityId);
  };

  const currentDay = plan.days[selectedDayIndex];

  return (
    <WatercolorBackground>
      <Header />

      <main className="container mx-auto px-4 py-6">
        {/* Shared with you indicator */}
        <div className="mb-4 flex items-center gap-2 text-sm text-ink-medium">
          <svg
            className="w-4 h-4 text-watercolor-sky"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          Shared with you
        </div>

        {/* Map Section */}
        <div className="mb-6">
          <TripMap
            dayPlan={currentDay}
            centerCoordinates={plan.location.coordinates}
            selectedActivityId={selectedActivityId}
            onActivityClick={handleActivityClick}
            className="h-[300px] md:h-[400px]"
          />
        </div>

        {/* Trip Info Header */}
        <div className="mb-6">
          <h1 className="font-display text-3xl md:text-4xl text-ink-dark mb-2">
            {plan.tripName}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-ink-medium">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {plan.location.name}
            </span>
            <span className="text-ink-light">•</span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDateRange(formInput.startDate, formInput.endDate)}
            </span>
            <span className="text-ink-light">•</span>
            <span
              className={cn(
                "flex items-center gap-1",
                plan.budgetBreakdown.withinBudget
                  ? "text-watercolor-mint"
                  : "text-watercolor-coral"
              )}
            >
              {plan.budgetBreakdown.withinBudget ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
              Est. {formatCurrency(plan.budgetBreakdown.estimated, plan.budgetBreakdown.currency)}
            </span>
          </div>
        </div>

        {/* Day Tabs */}
        <DayTabs
          days={plan.days}
          selectedDayIndex={selectedDayIndex}
          onDaySelect={(index) => {
            setSelectedDayIndex(index);
            setSelectedActivityId(null);
          }}
          className="mb-6"
        />

        {/* Timeline */}
        <PlanTimeline
          dayPlan={currentDay}
          selectedActivityId={selectedActivityId}
          onActivityClick={handleActivityClick}
        />

        {/* Tips Section */}
        {plan.tips && plan.tips.length > 0 && (
          <div className="mt-8 card-watercolor p-6">
            <h2 className="font-display text-2xl text-ink-dark mb-4 flex items-center gap-2">
              <span>💡</span> Tips for This Trip
            </h2>
            <ul className="space-y-2">
              {plan.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-ink-medium">
                  <span className="text-watercolor-coral mt-1">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Plan Your Own Trip CTA */}
        <div className="mt-8 card-watercolor p-6 text-center">
          <h2 className="font-display text-2xl text-ink-dark mb-2">
            Love this trip?
          </h2>
          <p className="text-ink-medium mb-4">
            Plan your own personalized adventure with Tripper
          </p>
          <button
            onClick={() => router.push("/")}
            className="btn-watercolor px-8"
          >
            Plan Your Own Trip
          </button>
        </div>
      </main>
    </WatercolorBackground>
  );
}
