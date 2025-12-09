"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { TripType, TripFormInput } from "@/lib/types";
import { cn } from "@/lib/utils";
import { TripTypeSelector } from "./TripTypeSelector";
import { LocationInput } from "./LocationInput";
import { DateRangePicker } from "./DateRangePicker";
import { BudgetInput } from "./BudgetInput";
import { PreferencesTextarea } from "./PreferencesTextarea";

interface FormErrors {
  location?: string;
  dates?: string;
  budget?: string;
}

export function TripForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Form state
  const [location, setLocation] = useState("");
  const [tripType, setTripType] = useState<TripType>("holiday");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [budget, setBudget] = useState("");
  const [preferences, setPreferences] = useState("");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!location.trim()) {
      newErrors.location = "Please enter a destination";
    }

    if (!startDate || !endDate) {
      newErrors.dates = "Please select your travel dates";
    }

    if (!budget || parseInt(budget, 10) <= 0) {
      newErrors.budget = "Please enter a valid budget";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const formData: TripFormInput = {
        location: location.trim(),
        tripType,
        startDate: format(startDate!, "yyyy-MM-dd"),
        endDate: format(endDate!, "yyyy-MM-dd"),
        budget: parseInt(budget, 10),
        preferences: preferences.trim() || undefined,
      };

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setErrors({ location: result.error || "Something went wrong" });
        return;
      }

      // Store plan data in sessionStorage for the results page
      sessionStorage.setItem("tripPlan", JSON.stringify(result.plan));
      sessionStorage.setItem("tripFormInput", JSON.stringify(formData));

      // Navigate to results page
      router.push("/plan");
    } catch (error) {
      console.error("Form submission error:", error);
      setErrors({ location: "Connection error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <LocationInput
        value={location}
        onChange={(val) => {
          setLocation(val);
          if (errors.location) setErrors({ ...errors, location: undefined });
        }}
        error={errors.location}
      />

      <TripTypeSelector value={tripType} onChange={setTripType} />

      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={(date) => {
          setStartDate(date);
          if (errors.dates) setErrors({ ...errors, dates: undefined });
        }}
        onEndDateChange={(date) => {
          setEndDate(date);
          if (errors.dates) setErrors({ ...errors, dates: undefined });
        }}
        error={errors.dates}
      />

      <BudgetInput
        value={budget}
        onChange={(val) => {
          setBudget(val);
          if (errors.budget) setErrors({ ...errors, budget: undefined });
        }}
        error={errors.budget}
      />

      <PreferencesTextarea value={preferences} onChange={setPreferences} />

      <button
        type="submit"
        disabled={isLoading}
        className={cn(
          "btn-watercolor w-full text-lg",
          "disabled:opacity-70 disabled:cursor-not-allowed",
          "focus:outline-none focus:ring-2 focus:ring-watercolor-coral/50 focus:ring-offset-2"
        )}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Planning Your Adventure...
          </span>
        ) : (
          "Start Your Adventure"
        )}
      </button>
    </form>
  );
}
