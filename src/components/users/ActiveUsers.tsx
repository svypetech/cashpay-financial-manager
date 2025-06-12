"use client";

import { useState, useEffect } from "react";
import Pagination from "../pagination/pagination";
import ActiveUsersTable from "../tables/ActiveUsersTable";
import useFetchUsers from "@/src/hooks/useFetchUsers";
import SkeletonTableLoader from "../skeletons/SkeletonTableLoader";
import Search from "../ui/Search";
import Image from "next/image";
import { User } from "@/src/lib/types/User";
import Error from "../ui/Error";
import { useDownloadData } from "@/src/hooks/useDownloadData";
import { useDateRangeFilter } from "@/src/hooks/useSetDate";
import { DateRangePicker } from "../ui/DateSelector";

const headings = [
  "User ID",
  "Name",
  "Last Login",
  "Total Logins",
  "Session Duration",
];

const csvFields = [
  { key: "id", label: "User ID" },
  {
    key: "name",
    label: "Name",
    transform: (value: any) => {
      if (!value) return "N/A";
      return `${value.firstName || ""} ${value.lastName || ""}`.trim();
    },
  },
  {
    key: "lastLogin",
    label: "Last Login",
    transform: (value: string) => {
      try {
        return value ? new Date(value).toLocaleString() : "N/A";
      } catch {
        return "N/A";
      }
    },
  },
  { key: "totalLogin", label: "Total Logins" },
  {
    key: "sessionDuration",
    label: "Session Duration",
    transform: (value: number) => {
      if (!value) return "N/A";
      // Convert minutes to hours and minutes format
      const hours = Math.floor(value / 60);
      const minutes = value % 60;
      return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    },
  },
];



export default function ActiveUsers() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  

  const { startDate, endDate, handleDateChange } = useDateRangeFilter();
  const { users, totalPages, isError, isLoading } = useFetchUsers({
    currentPage,
    limit: 10,
    filterStatus: "",
    searchQuery,
    startDate,
    endDate,

  });

  // Use the CSV download hook
  const { downloadData, isDownloading } = useDownloadData({
    filename: "active_users",
    dateInFilename: true,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  // Handle download button click
  const handleDownload = async () => {
    const dataToDownload = users.length > 0 ? users : users;
    const result = await downloadData(dataToDownload, csvFields);

    if (!result.success) {
      alert(result.error || "Failed to download data. Please try again.");
    }
  };

  // Filter users based on search query only
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, startDate, endDate]);

  return (
    <div>
      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row items-center mb-4 gap-4 w-full mt-6 ">
        {/* Search Bar - 60% on desktop, full width on mobile */}
        <div className="md:w-[60%] w-full">
          <Search className="w-full" onSearch={handleSearch} />
        </div>

        {/* Filter and Download - 40% on desktop, full width on mobile */}
        <div className="flex flex-col sm:flex-row gap-4 md:w-[40%] w-full">
          <div className="sm:w-[50%] w-full">
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onDateChange={handleDateChange}
              placeholder="Filter"
            />
          </div>

          <div className="sm:w-[50%] w-full">
            <button
              onClick={handleDownload}
              disabled={
                isDownloading || isLoading || !users || users.length === 0
              }
              className="w-full flex justify-center items-center gap-2 px-4 py-2 font-bold border-[1px] border-primary rounded-[8px] text-primary bg-white hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isDownloading ? "Downloading..." : "Download"}</span>
              {isDownloading ? (
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Image
                  src="/icons/download.svg"
                  alt="Download"
                  width={24}
                  height={24}
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      {isLoading ? (
        <SkeletonTableLoader headings={headings} rowCount={10} />
      ) : isError ? (
        <Error text="Something went wrong" />
      ) : users.length === 0 ? (
        <Error text="No data found" />
      ) : (
        <ActiveUsersTable headings={headings} data={users} />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
