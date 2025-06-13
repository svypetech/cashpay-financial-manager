"use client";

import useFetchDashboardUsersCount from "@/src/hooks/dashboard/useFetchUserCount";
import TotalUsersCardSkeleton from "../skeletons/TotalUsersCardSkeleton";
import Error from "../ui/Error";

interface UserStats {
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  inactiveUsers: number;
}

export default function TotalUsersCard() {
  const { userCount, isLoading, isError } = useFetchDashboardUsersCount();

  // Show skeleton while loading
  if (isLoading) {
    return <TotalUsersCardSkeleton />;
  }

  // Show error component if there's an error
  if (isError) {
    return (
      <div className="bg-white rounded-lg shadow-sm md:p-4 ">
        <Error text="Failed to load user data" />
      </div>
    );
  }

  // Calculate dynamic scale based on the data
  const calculateDynamicScale = () => {
    const values = [
      userCount.activeUsers,
      userCount.inActiveUsers,
      userCount.newUsers,
    ];
    const maxValue = Math.max(...values);
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;

    // Set scale to be 120% of the maximum value to give some breathing room
    // But ensure it's at least 20% higher than average for better visualization
    const scaleBasedOnMax = maxValue * 1.2;
    const scaleBasedOnAverage = average * 2.5;

    const dynamicScale = Math.max(scaleBasedOnMax, scaleBasedOnAverage);

    // Round to nearest nice number
    if (dynamicScale <= 1000) return Math.ceil(dynamicScale / 100) * 100;
    if (dynamicScale <= 10000) return Math.ceil(dynamicScale / 1000) * 1000;
    if (dynamicScale <= 100000) return Math.ceil(dynamicScale / 10000) * 10000;
    return Math.ceil(dynamicScale / 100000) * 100000;
  };

  const maxScale = calculateDynamicScale();

  // Generate dynamic x-axis labels based on scale
  const generateXAxisLabels = () => {
    const labels = [];
    const stepSize = maxScale / 4; // 5 labels (0, 25%, 50%, 75%, 100%)

    for (let i = 0; i <= 4; i++) {
      const value = stepSize * i;
      labels.push(formatNumberShort(value));
    }
    return labels;
  };

  // Function to format numbers with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Function to format numbers for axis labels (K, M notation)
  const formatNumberShort = (num: number) => {
    if (num === 0) return "0";
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  // Calculate percentage width for each bar
  const getBarWidth = (value: number) => {
    return Math.min((value / maxScale) * 100, 100); // Cap at 100%
  };

  // Generate grid line positions that align with labels (0%, 25%, 50%, 75%, 100%)
  const gridLinePositions = [0, 25, 50, 75, 100];

  const xAxisLabels = generateXAxisLabels();

  return (
    <div className="bg-white rounded-lg shadow-sm p-2 md:p-4 p-2 max-[450px]:min-h-[300px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Total Users</h2>
      </div>

      <div className="mb-4">
        <p className="text-primary text-4xl font-semibold font-[satoshi]">
          {formatNumber(
            userCount.activeUsers + userCount.inActiveUsers + userCount.newUsers
          )}
        </p>
      </div>

      <div className="relative pr-10">
        {/* Grid lines - positioned relative to the bar area (after the labels) */}
        <div
          className="absolute top-0 bottom-6 left-24 right-10 pointer-events-none h-[140px]"
          style={{ zIndex: 1 }}
        >
          <div className="relative h-full">
            {gridLinePositions.map((position) => (
              <div
                key={position}
                className="absolute h-full border-l border-gray-200"
                style={{ left: `${position}%`, width: 0 }}
              />
            ))}
          </div>
        </div>

        {/* Bars */}
        <div className="relative space-y-6 mb-6" style={{ zIndex: 2 }}>
          {/* New Users Bar */}
          <div className="flex items-center">
            <div className="w-24 text-right pr-4 text-sm text-gray-600">
              New Users
            </div>
            <div className="flex-1 relative">
              <div
                className="h-3 bg-blue-800 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${getBarWidth(userCount.newUsers)}%` }}
              ></div>
              <span
                className="absolute top-1/2 transform -translate-y-1/2 text-sm text-gray-600"
                style={{
                  left: `${getBarWidth(userCount.newUsers)}%`,
                  marginLeft: "8px",
                }}
              >
                {formatNumber(userCount.newUsers)}
              </span>
            </div>
          </div>

          {/* Active Users Bar */}
          <div className="flex items-center">
            <div className="w-24 text-right pr-4 text-sm text-gray-600">
              Active Users
            </div>
            <div className="flex-1 relative">
              <div
                className="h-3 bg-blue-400 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${getBarWidth(userCount.activeUsers)}%` }}
              ></div>
              <span
                className="absolute top-1/2 transform -translate-y-1/2 text-sm text-gray-600"
                style={{
                  left: `${getBarWidth(userCount.activeUsers)}%`,
                  marginLeft: "8px",
                }}
              >
                {formatNumber(userCount.activeUsers)}
              </span>
            </div>
          </div>

          {/* Inactive Users Bar */}
          <div className="flex items-center">
            <div className="w-24 text-right pr-4 text-sm text-gray-600">
              Inactive Users
            </div>
            <div className="flex-1 relative">
              <div
                className="h-3 bg-yellow-400 rounded-full transition-all duration-500 ease-in-out"
                style={{
                  width: `${getBarWidth(userCount.inActiveUsers)}%`,
                }}
              ></div>
              <span
                className="absolute top-1/2 transform -translate-y-1/2 text-sm text-gray-600"
                style={{
                  left: `${getBarWidth(userCount.inActiveUsers)}%`,
                  marginLeft: "8px",
                }}
              >
                {formatNumber(userCount.inActiveUsers)}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic X-axis labels - positioned relative to the bar area */}
        <div className="relative text-sm text-gray-500">
          <div className="ml-24 relative">
            {xAxisLabels.map((label, index) => (
              <div
                key={index}
                className="absolute transform -translate-x-1/2"
                style={{ left: `${index * 25}%` }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
