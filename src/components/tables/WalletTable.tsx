"use client";

import Image from "next/image";
import type React from "react";
import { useEffect, useState, useRef } from "react";
import WalletSidebar from "../transaction/WalletSidebar";
import { Wallet } from "@/src/lib/types/Wallet";
import axios from "axios";
import { formatNumberToTwoDecimals } from "@/src/utils/functions";
import ConfirmModal from "../ui/ConfirmModal";

interface Props {
  headings: string[];
  data: Wallet[];
}

const WalletTable: React.FC<Props> = ({ data, headings }) => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalAction, setModalAction] = useState<"ban" | "suspend" | null>(
    null
  );

  const [targetUserId, setTargetUserId] = useState<string>("");
  const [targetUserName, setTargetUserName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const needsPadding =
    activeDropdown !== null &&
    (selectedIndex >= data.length - 2 || data.length <= 2);

  const banUser = async (userId: string) => {
    setIsLoading(true);
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
      alert("User banned successfully");
    } catch (error) {
      alert("Error banning user");
    } finally {
      setIsLoading(false);
      setActiveDropdown(null);
      setShowConfirmModal(false);
    }
  };

  const suspendUser = async (userId: string) => {
    setIsLoading(true);
    try {
      await axios.put(
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
      alert("User suspended successfully");
    } catch (error) {
      alert("Error suspending user");
    } finally {
      setIsLoading(false);
      setActiveDropdown(null);
      setShowConfirmModal(false);
    }
  };

  const handleBanClick = (wallet: Wallet) => {
    const userName = wallet.data.userName
      ? `${wallet.data.userName.firstName} ${wallet.data.userName.lastName}`
      : "N/A";

    setTargetUserId(wallet.data.userId);
    setTargetUserName(userName);
    setModalAction("ban");
    setShowConfirmModal(true);
    setActiveDropdown(null);
  };

  const handleSuspendClick = (wallet: Wallet) => {
    const userName = wallet.data.userName
      ? `${wallet.data.userName.firstName} ${wallet.data.userName.lastName}`
      : "N/A";

    setTargetUserId(wallet.data.userId);
    setTargetUserName(userName);
    setModalAction("suspend");
    setShowConfirmModal(true);
    setActiveDropdown(null);
  };

  const handleConfirmAction = () => {
    if (modalAction === "ban") {
      banUser(targetUserId);
    } else if (modalAction === "suspend") {
      suspendUser(targetUserId);
    }
  };

  const handleCloseModal = () => {
    if (!isLoading) {
      setShowConfirmModal(false);
      setModalAction(null);
      setTargetUserId("");
      setTargetUserName("");
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

  const toggleDropdown = (index: number) => {
    setSelectedIndex(index); // Set selected index first
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  return (
    <div className="flex-1 rounded-lg w-full py-5">
      {/* Table */}
      <div
        className={`rounded-lg overflow-x-auto w-full ${
          needsPadding ? "pb-28" : ""
        }`}
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
                    <span className="relative">
                      {wallet.data.cryptoHoldings}
                    </span>
                  </td>
                  <td className="p-2 md:p-4 font-satoshi min-w-[100px]">
                    {formatNumberToTwoDecimals(wallet.data.totalBalanceUSD)}
                  </td>
                  <td className="relative p-2 md:p-4 font-satoshi">
                    <div className="dropdown-container">
                      <button
                        className="absolute relative md:right-auto cursor-pointer"
                        onClick={() => toggleDropdown(index)}
                      >
                        <Image
                          src="/icons/options.svg"
                          alt="Options"
                          width={24}
                          height={24}
                          className="w-4 h-4 relative left-[10px] sm:left-[20px]"
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
                              setActiveDropdown(null);
                            }}
                          >
                            View Wallet
                          </button>
                          <div className="border-t border-gray-100"></div>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-red-500 font-bold cursor-pointer hover:bg-gray-50"
                            onClick={() => handleBanClick(wallet)}
                          >
                            Ban User
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-red-500 font-bold cursor-pointer hover:bg-gray-50"
                            onClick={() => handleSuspendClick(wallet)}
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

      {/* Wallet Details Sidebar */}  
      {selectedWallet && (
        <WalletSidebar
          showSidebar={showSidebar}
          onClose={() => setShowSidebar(false)}
          wallet={selectedWallet}
        />
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmAction}
        title={modalAction === "ban" ? "Ban User" : "Suspend User"}
        message={
          <span>
            Are you sure you want to {modalAction} user{" "}
            <strong>{targetUserName}</strong>?
          </span>
        }
        warningText={
          modalAction === "ban"
            ? "This action will permanently ban the user from the platform."
            : "This action will temporarily suspend the user's access."
        }
        cancelText="Cancel"
        confirmText={modalAction === "ban" ? "Ban User" : "Suspend User"}
        isLoading={isLoading}
        style="red"
      />
    </div>
  );
};

export default WalletTable;
