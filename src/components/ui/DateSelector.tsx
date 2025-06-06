"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";
import { Calendar } from "@/src/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";

interface DateRangePickerProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  className?: string;
  placeholder?: string;
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  className,
  placeholder = "Pick a date range",
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={cn("grid gap-2 z-100 bg-white", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="flex justify-between items-center w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <span className="font-medium">
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "MMM dd")} -{" "}
                    {format(dateRange.to, "MMM dd")}
                  </>
                ) : (
                  format(dateRange.from, "MMM dd, y")
                )
              ) : (
                placeholder
              )}
            </span>
            <img
              className="h-[24px] w-[24px] text-gray-500"
              src="/icons/calendar.svg"
              alt="Calendar"
            />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 border border-gray-200" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={onDateRangeChange}
            numberOfMonths={2}
            className="rounded-md border border-gray-200 bg-white"
          />
          <div className="flex items-center justify-between p-3  border border-gray-200 bg-white ">
            <div className="text-sm  text-white">
              {dateRange?.from && dateRange?.to && (
                <span>
                  {Math.ceil(
                    (dateRange.to.getTime() - dateRange.from.getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  days selected
                </span>
              )}
            </div>
            <div className="flex gap-2 ">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onDateRangeChange(undefined);
                }}
                disabled={!dateRange?.from && !dateRange?.to}
              >
                Clear
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setOpen(false);
                  alert(
                    `Selected Date Range: ${
                      dateRange?.from ? dateRange.from : ""
                    } - ${
                      dateRange?.to ? dateRange.to : ""
                    }`
                  );
                }}
                className="bg-primary  text-white"
              >
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
