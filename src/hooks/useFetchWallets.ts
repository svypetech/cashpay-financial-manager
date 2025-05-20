import axios from "axios";
import { useEffect, useState } from "react";

export default function Wallet({
  currentPage,
  limit,
  sortBy,
  searchQuery,
}: {
  currentPage: number;
  limit: number;
  sortBy: string;
  searchQuery: string;
}) {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  // Debounce only the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Main data fetching effect
  useEffect(() => {
    const fetchWallets = async () => {
      try {
        setLoading(true);
        let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}transaction/wallets/all?limit=${limit}&page=${currentPage}`;

        if (sortBy !== "") {
          url += `&sortBy=${sortBy}`;
        }
        if (debouncedSearchQuery !== "") {
          url += `&search=${debouncedSearchQuery}`;
        }

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.status !== 200) {
          throw new Error("Failed to fetch wallets");
        }

        setWallets(response.data.walletsWithUser);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        setIsError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchWallets();
  }, [currentPage, limit, sortBy, debouncedSearchQuery, sortBy]);

  return { wallets, loading, isError, totalPages };
}
