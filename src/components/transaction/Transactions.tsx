"use client";

import { useEffect, useState } from "react";
import Pagination from "../pagination/pagination";
import Image from "next/image";
import TransactionTable from "../tables/TransactionsTable";
import useTransaction from "@/src/hooks/useFetchTransactions";
import Error from "../ui/Error";
import SkeletonTableLoader from "../skeletons/SkeletonTableLoader";
import Sort from "../ui/Sort";
import Search from "../ui/Search";
const headings = ["ID", "From", "To", "Status", "Block#", "Date"];
const navigationTabs = [
  { id: "all", title: "All" },
  { id: "completed", title: "Completed" },
  { id: "pending", title: "Pending" },
  { id: "failed", title: "Failed" },
];

export default function Transactions() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const { transactions, isLoading, isError, totalPages } = useTransaction({
    currentPage,
    limit: 10,
    searchQuery,
    status: activeTab === "all" ? "" : activeTab,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab]);

  return (
    <div>
      {/* Navigation Tabs */}
      <div className="w-full flex items-center mb-4">
        <div className="flex w-fit">
          {navigationTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-black ${
                activeTab === tab.id
                  ? "border-b-2 border-primary font-semibold"
                  : "hover:text-gray-700 cursor-pointer"
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Actions */}
      <div
        className={`flex flex-col sm:flex-row justify-between items-center mb-2 gap-4`}
      >
        <div className={`relative w-full sm:w-[70%]`}>
          <Search onSearch={setSearchQuery} />
        </div>

        <Sort onSort={() => {}} title="Sort By" options={[]} className="w-[30%]"/>
      </div>
      {isLoading ? (
        <SkeletonTableLoader rowCount={10} headings={headings} />
      ) : isError ? (
        <>
          <Error text="Something went wrong" />
        </>
      ) : (
        <>
          {transactions.length === 0 ? (
            <Error text="No data found" />
          ) : (
            <div className="mt-4">
              <TransactionTable headings={headings} data={transactions} />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
