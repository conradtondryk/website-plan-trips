"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  error?: string;
  className?: string;
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  error,
  className,
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: startDate,
    to: endDate,
  });

  React.useEffect(() => {
    setDate({ from: startDate, to: endDate });
  }, [startDate, endDate]);

  const handleSelect = (range: DateRange | undefined) => {
    setDate(range);
    onStartDateChange(range?.from);
    onEndDateChange(range?.to);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm font-medium text-ink-medium">
        When are you traveling? <span className="text-watercolor-coral">*</span>
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              "input-watercolor h-auto py-3",
              !date && "text-ink-light",
              error && "border-destructive"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-ink-light" />
            {date?.from ? (
              date.to ? (
                <>
                  <span className="text-ink-dark">
                    {format(date.from, "MMM d, yyyy")}
                  </span>
                  <span className="mx-2 text-ink-light">to</span>
                  <span className="text-ink-dark">
                    {format(date.to, "MMM d, yyyy")}
                  </span>
                </>
              ) : (
                <span className="text-ink-dark">
                  {format(date.from, "MMM d, yyyy")}
                </span>
              )
            ) : (
              <span>Pick your travel dates</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-paper-white" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
            disabled={{ before: new Date() }}
            className="rounded-xl"
          />
        </PopoverContent>
      </Popover>
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
