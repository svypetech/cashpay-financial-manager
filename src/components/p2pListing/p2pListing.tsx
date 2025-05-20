"use client";

import { useEffect, useState } from "react";
import Pagination from "../pagination/pagination";
import Image from "next/image";
import ListingTable from "@/src/components/tables/p2pListingTable";
import useFetchP2PListing from "@/src/hooks/useFetchP2PListing";
import SkeletonTableLoader from "../skeletons/SkeletonTableLoader";
import Sort from "../ui/Sort";
import Error from "../ui/Error";
import Search from "../ui/Search";

const headings = [
  "Listing ID",
  "Seller ID",
  "Type",
  "Currency",
  "Status",
  "Actions",
];

const navigationTabs = [
  { id: "all", title: "All" },
  { id: "active", title: "Active" },
  { id: "inactive", title: "Inactive" },
];
const sortOptions = [
  { label: "None", value: "" },
  { label: "Currency", value: "currency" },
  { label: "Status", value: "status" },
];

export default function P2PListings() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");

  const { listings, totalPages, isLoading, isError } = useFetchP2PListing({
    currentPage,
    limit: 10,
    searchQuery,
    addVisibility: activeTab === "all" ? "" : activeTab,
    sortBy: sortBy,
  });
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(()=>{
    setCurrentPage(1)
  },[searchQuery,activeTab,sortBy])

  return (
    <div>
      {/* Navigation Tabs */}
      <div className="w-full flex items-center mb-4">
        <div className="flex w-fit">
          {navigationTabs.map((tab, index) => (
            <button
              key={index}
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
        className={`flex sm:flex-row flex-col  justify-between items-center mb-2 gap-4`}
      >
        <div className={`relative w-full sm:w-[70%] `}>
          <Search onSearch={setSearchQuery} />
        </div>

        <div
          className={"flex items-center gap-4 w-full font-[satoshi] sm:w-[30%]"}
        >
          <Sort
            options={sortOptions}
            onSort={setSortBy}
            title="Sort by"
            className="w-full"
          />
        </div>
      </div>
      {isLoading ? (
        <SkeletonTableLoader rowCount={10} headings={headings} />
      ) : isError ? (
        <Error text="Something went wrong" />
      ) : listings.length === 0 ? (
        <Error text="No data found" />
      ) : (
        <ListingTable headings={headings} data={listings} />
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
