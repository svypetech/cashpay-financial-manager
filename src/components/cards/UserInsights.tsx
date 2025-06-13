import Link from "next/link";
import { formatNumberToTwoDecimals } from "@/src/utils/functions";

interface UserInsightsData {
  averageLoginPerUser: number;
  averageSession: number;
  activeUsers: number;
}

interface UserInsightsProps {
  userInsights: UserInsightsData;
}

export default function UserInsights({ userInsights }: UserInsightsProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl sm:text-xl lg:text-2xl font-bold font-[satoshi]">
          User Insights
        </h2>
        <Link href="/active-users">
          <img
            src="/icons/export-arrow.svg"
            alt="Arrow right"
            className="cursor-pointer w-[20px] h-[20px] sm:w-[24px] sm:h-[24px]"
          />
        </Link>
      </div>

      {/* Grid Layout - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 h-full">
        {/* Left Column - Avg Login and Avg Session */}
        <div className="flex flex-col gap-3 sm:gap-4 sm:col-span-2 lg:col-span-3 h-full">
          {/* Avg Login/user */}
          <div className="p-3 sm:p-4 border border-gray-200 rounded-lg flex-1 flex flex-col justify-center min-h-[100px] sm:min-h-[120px]">
            <div className="flex items-start gap-2 sm:gap-3">
              <img
                src="/icons/user-insights1.svg"
                alt="login icon"
                className="w-[35px] h-[35px] sm:w-[45px] sm:h-[45px] lg:w-[55px] lg:h-[55px] flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="text-[14px] sm:text-xs text-gray-500 mb-1">
                  Avg Login/user
                </div>
                <div className="text-xl sm:text-xl lg:text-2xl font-bold font-[satoshi] text-primary break-words">
                  {formatNumberToTwoDecimals(
                    userInsights?.averageLoginPerUser || 0
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Avg Session */}
          <div className="p-3 sm:p-4 border border-gray-200 rounded-lg flex-1 flex flex-col justify-center min-h-[100px] sm:min-h-[120px]">
            <div className="flex items-start gap-2 sm:gap-3">
              <img
                src="/icons/user-insights2.svg"
                alt="session icon"
                className="w-[35px] h-[35px] sm:w-[45px] sm:h-[45px] lg:w-[55px] lg:h-[55px] flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="text-[14px] sm:text-xs text-gray-500 mb-1">
                  Avg Session
                </div>
                <div className="text-xl sm:text-xl lg:text-2xl font-bold font-[satoshi] text-primary break-words">
                  {formatNumberToTwoDecimals(userInsights?.averageSession || 0)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Users - Right Column */}
        <div className="p-3 sm:p-4 border border-gray-200 rounded-lg col-span-1 sm:col-span-2 lg:col-span-2 overflow-hidden min-h-[180px] sm:min-h-[200px] lg:min-h-[250px]">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex gap-2 sm:gap-3 mb-3 sm:mb-4">
              <img
                src="/icons/user-insights3.svg"
                alt="login icon"
                className="w-[35px] h-[35px] sm:w-[45px] sm:h-[45px] lg:w-[55px] lg:h-[55px] flex-shrink-0"
              />
              <div className="flex flex-col justify-center text-[14px] sm:text-sm text-gray-500">
                Active Users
              </div>
            </div>

            {/* Active Users Count */}
            <div className="flex-1 flex items-center justify-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold font-[satoshi] text-primary text-center break-words">
                {userInsights?.activeUsers || 0}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
