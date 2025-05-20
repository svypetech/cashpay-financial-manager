import axios from "axios";
import { useEffect, useState } from "react";
import Transaction from "../lib/types/Transactions";

export default function useTransaction({
  currentPage,
  limit,
  searchQuery,
  status
}:{
  currentPage: number,
  limit?: number,
  searchQuery?: string,
  status?: string
}
  
) {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setLoading] = useState(true);
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
    const fetchData = async () => {
      try {
        setLoading(true);
        // Construct the URL based on whether debounced search query exists
        let url = debouncedSearchQuery !== ""
          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}transaction/transaction/?limit=${limit}&page=${currentPage}&search=${debouncedSearchQuery}`
          : `${process.env.NEXT_PUBLIC_BACKEND_URL}transaction/transaction/?limit=${limit}&page=${currentPage}`;
        // Append status if provided
        if (status) {
          url += `&status=${status}`;
        }
          
        // Make the API call
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        
        // Handle the response
        if (response.status !== 200) {
          alert("Failed to fetch transactions");
          return;
        }
        
        // Update state with the response data
        response.data.transactions.forEach((transaction: Transaction) => {
          if(transaction.web3Data === null){
            setIsError(true)
            return
          } 
        })
        setTransactions(response.data.transactions);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        setIsError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, limit, debouncedSearchQuery, status]);

  return { transactions, isLoading, isError, totalPages };
}