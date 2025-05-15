"use client";

import { useState, useEffect } from "react";
import Pagination from "../pagination/pagination";
import ActiveUsersTable from "../tables/ActiveUsersTable";
import useFetchUsers from "@/src/hooks/useFetchUsers";
import SkeletonTableLoader from "../skeletons/SkeletonTableLoader";
import Search from "../ui/Search";
import Image from "next/image";
import { User } from "@/src/lib/types/User";

const headings = [
  "User ID",
  "Name",
  "Last Login",
  "Total Logins",
  "Session Duration",
];

export default function ActiveUsers() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [filterStatus, setFilterStatus] = useState("");
  const { users, totalPages, isError, isLoading } = useFetchUsers({
    currentPage,
    limit: 10,
    filterStatus,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  // Filter users based on search query
  useEffect(() => {
    if (!users) return;

    if (!searchQuery) {
      setFilteredUsers(users);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = users.filter((user) => {
      const fullName = `${user.name?.firstName || ""} ${
        user.name?.lastName || ""
      }`.toLowerCase();
      return fullName.includes(query);
    });

    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  return (
    <div>
      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="w-full md:w-1/2">
          <Search className="w-full" onSearch={handleSearch} />
        </div>

        <div className="flex items-center gap-4 w-full md:w-1/2 font-[satoshi]">
          <button className="w-full md:w-auto flex-1 cursor-pointer flex justify-between items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50">
            <span>Filter</span>
            <Image
              src="/icons/calendar.svg"
              alt="Calendar"
              width={24}
              height={24}
            />
          </button>
          <button className="w-[50%] flex justify-center items-center gap-2 px-4 py-2 font-bold border border-primary rounded-lg text-primary bg-white hover:bg-blue-50 ml-auto md:ml-0">
            <span>Download</span>
            <Image
              src="/icons/download.svg"
              alt="Download"
              width={24}
              height={24}
            />
          </button>
        </div>
      </div>

      {/* Table Section */}
      {isLoading ? (
        <SkeletonTableLoader headings={headings} rowCount={10} minWidth="800" />
      ) : isError ? (
        <div className="p-4 text-red-500 flex items-center justify-center h-[400px]">
          Error loading users
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="p-4 text-gray-500 flex items-center justify-center h-[200px]">
          No users found matching your search
        </div>
      ) : (
        <ActiveUsersTable headings={headings} data={filteredUsers} />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
