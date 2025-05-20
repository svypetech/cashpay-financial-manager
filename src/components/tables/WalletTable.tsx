"use client";

import Image from "next/image";
import type React from "react";
import { useEffect, useState, useRef } from "react";
import WalletSidebar from "../transaction/WalletSidebar";
import { Wallet } from "@/src/lib/types/Wallet";
import axios from "axios";
import { formatNumberToTwoDecimals } from "@/src/utils/functions";
interface Props {
  headings: string[];
  data: Wallet[];
}

const WalletTable: React.FC<Props> = ({ data, headings }) => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);

  const banUser = async (userId: string) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}user/banUser/`,
        {
          id: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      alert("Error banning user");
    } finally {
      setActiveDropdown(null);
    }
  };

  const suspendUser = (userId: string) => {
    try {
      axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}user/suspendUser/`,
        {
          id: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      alert("Error suspending user");
    } finally {
      setActiveDropdown(null);
    }
  };
  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown !== null) {
        const target = event.target as HTMLElement;
        if (!target.closest(".dropdown-container")) {
          setActiveDropdown(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeDropdown]);

  useEffect(() => {
    // Adjust dropdown position
    if (
      activeDropdown !== null &&
      tableRef.current &&
      dropdownRefs.current[activeDropdown]
    ) {
      const tableRect = tableRef.current.getBoundingClientRect();
      const dropdownRect =
        dropdownRefs.current[activeDropdown]!.getBoundingClientRect();
      const rowElement = dropdownRefs.current[activeDropdown]!.closest("tr");
      const rowRect = rowElement?.getBoundingClientRect();

      if (rowRect && dropdownRect) {
        const spaceBelow = tableRect.bottom - rowRect.bottom;
        const dropdownHeight = dropdownRect.height;

        // Always open dropdown downwards for the first row or single row
        if (activeDropdown === 0 || data.length === 1) {
          dropdownRefs.current[activeDropdown]!.style.top = "100%";
          dropdownRefs.current[activeDropdown]!.style.bottom = "auto";
          dropdownRefs.current[activeDropdown]!.style.marginTop = "8px";
          dropdownRefs.current[activeDropdown]!.style.marginBottom = "0";
        } else {
          // For other rows with multiple rows, open upwards if not enough space below
          if (spaceBelow < dropdownHeight) {
            dropdownRefs.current[activeDropdown]!.style.bottom = "100%";
            dropdownRefs.current[activeDropdown]!.style.top = "auto";
            dropdownRefs.current[activeDropdown]!.style.marginBottom = "8px";
            dropdownRefs.current[activeDropdown]!.style.marginTop = "0";
          } else {
            // Open downwards
            dropdownRefs.current[activeDropdown]!.style.top = "100%";
            dropdownRefs.current[activeDropdown]!.style.bottom = "auto";
            dropdownRefs.current[activeDropdown]!.style.marginTop = "8px";
            dropdownRefs.current[activeDropdown]!.style.marginBottom = "0";
          }
        }
      }
    }
  }, [activeDropdown, data.length]);

  const toggleDropdown = (index: number) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  return (
    <div className="flex-1 rounded-lg w-full py-5">
      {/* Table */}
      <div
        className="rounded-lg overflow-x-auto w-full min-h-[200px]"
        ref={tableRef}
      >
        <table className="w-full text-left table-auto min-w-[800px]">
          <thead className="bg-secondary/10">
            <tr className="font-satoshi text-[12px] md:text-[16px] p-2 md:p-4">
              {headings.map((heading, index) => (
                <th key={index} className="p-2 md:p-4 text-left">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) &&
              data.map((wallet, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 text-[12px] md:text-[16px]"
                >
                  <td className="p-2 md:p-4 font-satoshi min-w-[100px] break-words">
                    {wallet.data.userId}
                  </td>
                  <td className="p-2 md:p-4 font-satoshi font-bold text-primary min-w-[120px] break-words">
                    {wallet.data.userName
                      ? wallet.data.userName.firstName +
                        " " +
                        wallet.data.userName.lastName
                      : "N/A"}
                  </td>
                  <td className="p-2 md:p-4 font-satoshi min-w-[150px] break-words">
                    {wallet.data.cardUser ? "True" : "False"}
                  </td>
                  <td className="p-2 md:p-4 font-satoshi min-w-[120px]">
                    <span className="relative left-[30px]">
                      {wallet.data.cryptoHoldings}
                    </span>
                  </td>
                  <td className="p-2 md:p-4 font-satoshi min-w-[100px]">
                    {formatNumberToTwoDecimals(wallet.data.totalBalanceUSD)}
                  </td>
                  <td className="relative p-2 md:p-4 font-satoshi min-w-[60px] ">

                    <div className="dropdown-container  ">
                      <button
                        className="absolute right-0 md:relative md:right-auto cursor-pointer"
                        onClick={() => toggleDropdown(index)}
                      >
                        <Image
                          src="/icons/options.svg"
                          alt="Options"
                          width={24}
                          height={24}
                          className="w-4 h-4 relative left-[20px]"
                        />
                      </button>

                      {activeDropdown === index && (
                        <div
                          className="absolute z-10 right-0 w-40 bg-white rounded-md shadow-lg py-1 border border-gray-100"
                          ref={(el) => {
                            dropdownRefs.current[index] = el;
                          }}
                        >
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-primary font-bold cursor-pointer hover:bg-gray-50"
                            onClick={() => {
                              setSelectedWallet(wallet);
                              setShowSidebar(true);
                            }}
                          >
                            View Wallet
                          </button>
                          <div className="border-t border-gray-100"></div>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-red-500 font-bold cursor-pointer hover:bg-gray-50"
                            onClick={() => {
                              banUser(wallet.data.userId);
                            }}
                          >
                            Ban User
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-red-500 font-bold cursor-pointer hover:bg-gray-50"
                            onClick={() => {
                              suspendUser(wallet.data.userId);
                            }}
                          >
                            Suspend User
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Wallet.data Details Sidebar */}
      {selectedWallet && selectedWallet.data.balances.items && (
        <WalletSidebar
          showSidebar={showSidebar}
          onClose={() => setShowSidebar(false)}
          wallet={selectedWallet.data}
        />
      )}
    </div>
  );
};

export default WalletTable;
