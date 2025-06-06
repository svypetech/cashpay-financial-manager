import { useState } from "react";
import { DateRange } from "react-day-picker";

interface UseDateRangeFilterProps {
  initialDateRange?: DateRange;
}

export const useDateRangeFilter = ({
  initialDateRange,
}: UseDateRangeFilterProps = {}) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    initialDateRange
  );

  const clearDateRange = () => {
    setDateRange(undefined);
  };

  // Check if filter is active
  const isFilterActive = () => {
    return dateRange?.from !== undefined || dateRange?.to !== undefined;
  };

  // Format date range for display
  const formatDateRange = () => {
    if (!dateRange?.from && !dateRange?.to) {
      return "Filter by date";
    }

    if (dateRange?.from && dateRange?.to) {
      return `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`;
    }

    if (dateRange?.from) {
      return `From ${dateRange.from.toLocaleDateString()}`;
    }

    return "Filter by date";
  };

  return {
    dateRange,
    setDateRange,
    clearDateRange,
    formatDateRange,
    isFilterActive,
  };
};
