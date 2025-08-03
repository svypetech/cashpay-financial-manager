import { useState, useEffect } from "react";
import axios from "axios";
import { handleTokenExpiration } from "@/src/utils/functions";

export default function useUser({
  currentPage,
  limit,
  sortBy = "",
  filterStatus = "",
  searchQuery = "",
  startDate = undefined,
  endDate = undefined,
}: {
  currentPage: number;
  limit: number;
  sortBy?: string;
  filterStatus?: string;
  searchQuery?: string;
  startDate?: Date;
  endDate?: Date;
}) {
  const [users, setUsers] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 800); // Adjust the debounce delay as needed
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}user/all?page=${currentPage}&limit=${limit}`;
        if (sortBy !== "") {
          url += `&sortBy=${sortBy}`;
        }
        if (filterStatus !== "") {
          url += `&filterStatus=${filterStatus}`;
        }
        if (debouncedSearchQuery !== "") {
          url += `&search=${debouncedSearchQuery}`;
        }
        if (startDate) {
          url += `&startDate=${startDate.toISOString()}`;
        }
        if (endDate) {
          url += `&endDate=${endDate.toISOString()}`;
        }

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setUsers(response.data.data.users);
        setTotalPages(response.data.data.totalPages);
      } catch (error: any) {
        if (error.response?.status === 401 || 
            error.response?.data?.statusCode === 401 ||
            error.response?.data?.message?.includes("Invalid or expired token")) {
          console.log("Token expired or invalid, redirecting to sign-in");
          handleTokenExpiration();
          return; // Don't set error state, just redirect
        }
        setIsError(true);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, sortBy, filterStatus, debouncedSearchQuery, startDate, endDate]);

  return { users, totalPages, isLoading, isError, setUsers };
}
