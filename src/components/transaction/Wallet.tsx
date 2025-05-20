"use client";

import { useEffect, useState } from "react";
import Pagination from "@/src/components/pagination/pagination";
import Image from "next/image";
import WalletTable from "@/src/components/tables/WalletTable";
import useWallet from "@/src/hooks/useFetchWallets";
import SkeletonTableLoader from "../skeletons/SkeletonTableLoader";
import Error from "../ui/Error";
import Sort from "../ui/Sort";
import Search from "../ui/Search";
import { set } from "date-fns";

const headings = [
  "User ID",
  "Name",
  "Card User",
  "Crypto Holdings",
  "Total Balance (USDT)",
  "Actions",
];
const sortOptions = [
  { label: "None", value: "" },
  { label: "Name", value: "name" },
  { label: "ID", value: "id" },
];

export default function Wallet() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const [sortBy, setSortBy] = useState("");

  let { wallets, loading, isError, totalPages } = useWallet({
    currentPage,
    limit: 10,
    sortBy,
    searchQuery,
  });
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery,sortBy]);

  return (
    <div>
      {/* Search and Actions */}
      <div
        className={`flex flex-col sm:flex-row justify-between items-center mb-2 gap-4 mt-5`}
      >
        <div className={`relative w-[70%]`}>
          <Search onSearch={setSearchQuery} />
        </div>

        <Sort
          title="Sort by"
          options={sortOptions}
          onSort={setSortBy}
          className="w-[30%]"
        />
      </div>
      {loading ? (
        <SkeletonTableLoader rowCount={10} headings={headings} />
      ) : isError ? (
        <Error text="Something went wrong" />
      ) : wallets.length === 0 ? (
        <Error text="No data found" />
      ) : (
        <>
          <WalletTable headings={headings} data={wallets} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
