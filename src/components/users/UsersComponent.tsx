"use client";

import { useState, useMemo, useEffect } from "react";
import UserTable from "../tables/UserTable";
import Pagination from "../pagination/pagination";
import Tabs from "../ui/Tabs";
import Search from "../ui/Search";
import Sort from "../ui/Sort";
import useFetchUsers from "@/src/hooks/useFetchUsers";
import SkeletonTableLoader from "../skeletons/SkeletonTableLoader";
import Error from "../ui/Error";
const headings = ["User ID", "Name", "E-mail", "Joined date", "Actions"];

// Sort options
const sortOptions = [
  { label: "None", value: "" },
  { label: "Date", value: "date" },
  { label: "Title", value: "title" },
];

export default function UsersComponent() {
  // All states in one place
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const { users, totalPages, isLoading, isError, setUsers } = useFetchUsers({
    currentPage,
    limit: 10,
    sortBy,
    filterStatus,
    searchQuery,
  });

  // Define tabs for the Tabs component
  const tabs = ["All", "Verified", "Pending Verifications"];

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Filter and sort users based on activeTab, searchQuery, and sortBy

  useEffect(() => {
    // First filter by tab
    if (activeTab === "All") {
      setFilterStatus("");
    } else if (activeTab === "Verified") {
      setFilterStatus("Approved");
    } else if (activeTab === "Pending Verifications") {
      setFilterStatus("Pending");
    }
  }, [activeTab]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, searchQuery, sortBy]);

  return (
    <>
      {/* Navigation Tabs - Using Tabs component */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        size="normal"
      />

      {/* Search and Actions */}
      <div className="flex flex-col gap-4 sm:gap-[28px] sm:flex-row mt-[30px]">
        <Search className="sm:w-[80%] w-full" onSearch={setSearchQuery} />
        <Sort
          className="sm:w-[20%] w-full"
          title="Sort"
          options={sortOptions}
          onSort={setSortBy}
        />
      </div>

      {/* Content area */}
      {isLoading ? (
        <SkeletonTableLoader headings={headings} rowCount={10} />
      ) : isError ? (
        <Error text="Something went wrong" />
      ) : users.length === 0 ? (
        <Error text="No data found" />
      ) : (
        <div className="mt-4">
          <UserTable headings={headings} data={users} setData={setUsers} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
}
