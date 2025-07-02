"use client";

import Image from "next/image";
import type React from "react";
import { useEffect, useState, useRef } from "react";
import WalletSidebar from "../transaction/WalletSidebar";
import { Wallet } from "@/src/lib/types/Wallet";
import axios from "axios";
import { formatNumberToTwoDecimals } from "@/src/utils/functions";
import ConfirmModal from "../ui/ConfirmModal";
import ExpandableId from "../ui/ExpandableId";
import SuspendUserModal from "../ui/SuspendModal";
import { useToast } from "@/src/providers/ToastProvider";

interface Props {
  headings: string[];
  data: Wallet[];
  setData: React.Dispatch<React.SetStateAction<Wallet[]>>;
}

const WalletTable: React.FC<Props> = ({ data, headings, setData }) => {
  const { showSuccess, showError } = useToast();
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalAction, setModalAction] = useState<
    "ban" | "suspend" | "activate" | null
  >(null);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  

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
      showSuccess("Success", "User banned successfully");
      setData((prevData) =>
        prevData.map((wallet) =>
          wallet.data.user_id === userId
            ? {
                ...wallet,
                data: {
                  ...wallet.data,
                  userStatus: "Banned",
                },
              }
            : wallet
        )
      );
    } catch (error) {
      showError("Ban Failed", "Error banning user");
    } finally {
      setIsLoading(false);
      setActiveDropdown(null);
      setShowConfirmModal(false);
    }
  };

  const suspendUser = async (userId: string, days: number) => {
    setIsLoading(true);
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}user/suspendUser/`,
        {
          id: userId,
          days: days,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      showSuccess("Success", "User suspended successfully");
      setData((prevData) =>
        prevData.map((wallet) =>
          wallet.data.user_id === userId
            ? {
                ...wallet,
                data: {
                  ...wallet.data,
                  userStatus: "Suspend",
                },
              }
            : wallet
        )
      );
    } catch (error) {
      showError("Suspend Failed", "Error suspending user");
    } finally {
      setIsLoading(false);
      setActiveDropdown(null);
      setShowSuspendModal(false);
    }
  };

  const activateUser = async (userId: string) => {
    setIsLoading(true);
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}user/activateUser/`,
        {
          id: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      showSuccess("Success", "User activated successfully");
      setData((prevData) =>
        prevData.map((wallet) =>
          wallet.data.user_id === userId
            ? {
                ...wallet,
                data: {
                  ...wallet.data,
                  userStatus: "Active",
                },
              }
            : wallet
        )
      );
    } catch (error) {
      showError("Activation Failed", "Error activating user");
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

    setTargetUserId(wallet.data.user_id);
    setTargetUserName(userName);
    setModalAction("ban");
    setShowConfirmModal(true);
    setActiveDropdown(null);
  };

  const handleSuspendClick = (wallet: Wallet) => {
    const userName = wallet.data.userName
      ? `${wallet.data.userName.firstName} ${wallet.data.userName.lastName}`
      : "N/A";

    setTargetUserId(wallet.data.user_id);
    setTargetUserName(userName);
    setModalAction("suspend");
    setShowSuspendModal(true);
    setActiveDropdown(null);
  };

  const handleActivateClick = (wallet: Wallet) => {
    const userName = wallet.data.userName
      ? `${wallet.data.userName.firstName} ${wallet.data.userName.lastName}`
      : "N/A";

    setTargetUserId(wallet.data.user_id);
    setTargetUserName(userName);
    setModalAction("activate");
    setShowConfirmModal(true);
    setActiveDropdown(null);
  };

  const handleConfirmAction = (days?: number) => {
    if (modalAction === "ban") {
      banUser(targetUserId);
    } else if (modalAction === "suspend" && days) {
      suspendUser(targetUserId, days);
    } else if (modalAction === "activate") {
      activateUser(targetUserId);
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

  // Check if user is banned or suspended
  const isUserInactive = (wallet: Wallet): boolean => {
    const userStatus = wallet.data.userStatus?.toLowerCase();
    return userStatus === "banned" || userStatus === "suspend";
  };

  const getModalConfig = () => {
    switch (modalAction) {
      case "ban":
        return {
          title: "Ban User",
          message: `Are you sure you want to ban user ${targetUserName}?`,
          warningText:
            "This action will permanently ban the user from the platform.",
          confirmText: "Ban User",
          style: "red" as const,
        };
      case "suspend":
        return {
          title: "Suspend User",
          message: `Are you sure you want to suspend user ${targetUserName}?`,
          warningText:
            "This action will temporarily suspend the user's access.",
          confirmText: "Suspend User",
          style: "red" as const,
        };
      case "activate":
        return {
          title: "Activate User",
          message: `Are you sure you want to activate user ${targetUserName}?`,
          warningText:
            "This action will restore the user's access to the platform.",
          confirmText: "Activate User",
          style: "blue" as const,
        };
      default:
        return {
          title: "",
          message: "",
          warningText: "",
          confirmText: "",
          style: "red" as const,
        };
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
    setSelectedIndex(index);
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const modalConfig = getModalConfig();

  return (
    <div className="flex-1 rounded-lg w-full py-5">
      {/* Table */}
      <div
        className={`rounded-lg overflow-x-auto w-full ${
          needsPadding ? "pb-28" : ""
        }`}
        ref={tableRef}
      >
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-secondary/10">
            <tr className="font-satoshi text-[12px] sm:text-[16px] whitespace-nowrap">
              <th className="px-2 sm:px-4 py-3 sm:py-4 text-left font-[700] w-[15%]">
                {headings[0]}
              </th>
              <th className="px-2 sm:px-4 py-3 sm:py-4 text-left font-[700] w-[20%]">
                {headings[1]}
              </th>
              <th className="px-2 sm:px-4 py-3 sm:py-4 text-left font-[700] w-[15%]">
                {headings[2]}
              </th>
              <th className="px-2 sm:px-4 py-3 sm:py-4 text-left font-[700] w-[20%]">
                {headings[3]}
              </th>
              <th className="px-2 sm:px-4 py-3 sm:py-4 text-left font-[700] w-[20%]">
                {headings[4]}
              </th>
              <th className="px-2 sm:px-4 py-3 sm:py-4 text-left font-[700] w-[10%]">
                {headings[5]}
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) &&
              data.map((wallet, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 text-[12px] sm:text-[16px]"
                >
                  <td className="px-2 sm:px-4 py-3 sm:py-4 font-satoshi whitespace-nowrap">
                    <ExpandableId id={wallet.data.user_id} />
                  </td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 font-satoshi font-bold text-primary whitespace-nowrap">
                    {wallet.data.userName
                      ? wallet.data.userName.firstName +
                        " " +
                        wallet.data.userName.lastName
                      : "N/A"}
                  </td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 font-satoshi whitespace-nowrap">
                    {wallet.data.cardUser ? "True" : "False"}
                  </td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 font-satoshi whitespace-nowrap">
                    <span className="relative">
                      {wallet.data.cryptoHoldings}
                    </span>
                  </td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 font-satoshi whitespace-nowrap">
                    {formatNumberToTwoDecimals(wallet.data.totalBalanceUSD)}
                  </td>
                  <td className="relative px-2 sm:px-4 py-3 sm:py-4 font-satoshi text-center">
                    <div className="dropdown-container relative">
                      <button
                        className="flex items-center justify-center w-[80%] xl:w-[70%] 2xl:w-[40%] lg:w-[100%] cursor-pointer"
                        onClick={() => toggleDropdown(index)}
                      >
                        <Image
                          src="/icons/options.svg"
                          alt="Options"
                          width={24}
                          height={24}
                          className="w-5 h-5"
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

                          {/* Conditional dropdown options */}
                          {isUserInactive(wallet) ? (
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-green-600 font-bold cursor-pointer hover:bg-gray-50"
                              onClick={() => handleActivateClick(wallet)}
                            >
                              Activate User
                            </button>
                          ) : (
                            <>
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
                            </>
                          )}
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
        title={modalConfig.title}
        message={<span>{modalConfig.message}</span>}
        warningText={modalConfig.warningText}
        cancelText="Cancel"
        confirmText={modalConfig.confirmText}
        isLoading={isLoading}
        style={modalConfig.style}
      />
      <SuspendUserModal
        isOpen={showSuspendModal}
        onClose={() => setShowSuspendModal(false)}
        userName={targetUserName ? targetUserName : "N/A"}
        onConfirm={(days) => {
          handleConfirmAction(days);
        }}
        isLoading={isLoading}
      />
    </div>
  );
};

export default WalletTable;
