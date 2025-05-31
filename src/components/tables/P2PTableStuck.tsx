"use client";

import Image from "next/image";
import type React from "react";
import { useEffect, useState, useRef, SetStateAction } from "react";
import StuckTradePopup from "../p2pTrading/StuckTradePopup";
import { Trade } from "@/src/lib/types/Trades";
import ExpandableId from "../ui/ExpandableId";
import ColourfulBlock from "../ui/ColourfulBlock";
import axios from "axios";
import ConfirmModal from "../ui/ConfirmModal";

interface Props {
  headings: string[];
  data: Trade[];
  setData: React.Dispatch<React.SetStateAction<Trade[]>>;
}

const P2PTableStuck: React.FC<Props> = ({ data, headings, setData }) => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [filteredTrades, setFilteredTrades] = useState<Trade[]>(data);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResolvePopup, setShowResolvePopup] = useState(false);
  const [favor, setFavor] = useState<string>("");

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate a network request
    alert("Selected ID: " + selectedTrade?.tradeId);
    try {
      let response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}transaction/order/resolveDispute`,
        {
          orderId: selectedTrade ? selectedTrade.tradeId : "",
          favourOf: favor,
          comment: `Resolved in favor of ${favor} from stuck trades`,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // Update the local state with the resolved trade
      setData((prevTrades) =>
        prevTrades.map((trade) =>
          trade.tradeId === selectedTrade?.tradeId
            ? { ...trade, status: favor === "Buyer" ? "Resolved" : "Canceled" }
            : trade
        )
      );
      alert("Dispute resolved successfully: " + JSON.stringify(response.data));
    } catch (error: any) {
      alert(error.response.data.message);
    } finally {
      setShowResolvePopup(false);
      setIsSubmitting(false);
    }
  };

  const toggleDropdown = (index: number) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  useEffect(() => {
    setFilteredTrades(data);
  }, [data]);

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

  return (
    <div className="flex-1 rounded-lg w-full py-5">
      {/* Table */}
      <div
        className="rounded-lg overflow-x-auto w-full min-h-[150px]"
        ref={tableRef}
      >
        <table className="w-full text-left table-auto min-w-[600px] bg-[60px]">
          <thead className="bg-secondary/10">
            <tr className="font-satoshi text-[12px] md:text-[16px] py-3 md:py-4 px-2 md:px-4">
              {headings.map((heading, index) => (
                <th key={index} className="px-2 md:px-4 py-3 md:py-4 text-left">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredTrades) &&
              filteredTrades.map((trade, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 text-[12px] md:text-[16px]"
                >
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px] break-words">
                    <ExpandableId id={trade.tradeId} />
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px] break-words">
                    <ExpandableId id={trade.sellerId} />
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px] break-words">
                    <ExpandableId id={trade.buyerId} />
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[120px] break-words">
                    {trade.amountt}
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[100px]">
                    {trade.currency}
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[200px]">
                    <ColourfulBlock
                      text={trade.reason ? trade.reason : "N/A"}
                      className={`text-center rounded-xl md:text-md font-semibold bg-[#EFE40833] text-[#B0A700] `}
                    />
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[100px]">
                    <ColourfulBlock
                      text={trade.status ? trade.status : "Locked"}
                      className={`text-center rounded-xl md:text-md font-semibold ${
                        trade.status.toLowerCase() === "resolved"
                          ? "text-success bg-successBg"
                          : trade.status.toLowerCase() === "canceled"
                          ? "bg-fail/20 text-tail"
                          : "bg-[#72727233] text-[#727272]"
                      }`}
                    />
                  </td>
                  <td className="relative px-2 md:px-4 py-3 md:py-4 font-satoshi min-w-[60px] text-center">
                    <div className="dropdown-container relative">
                      <button
                        className="absolute right-0 md:relative md:right-auto cursor-pointer"
                        onClick={() => toggleDropdown(index)}
                      >
                        <Image
                          src="/icons/options.svg"
                          alt="Options"
                          width={24}
                          height={24}
                          className="w-4 h-4"
                        />
                      </button>

                      {activeDropdown === index && (
                        <div
                          className="absolute z-10 right-0 w-56 bg-white rounded-md shadow-lg py-1 border border-gray-100"
                          ref={(el) => {
                            dropdownRefs.current[index] = el;
                          }}
                        >
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-primary font-bold cursor-pointer hover:bg-gray-50"
                            onClick={() => {
                              setSelectedTrade(trade);
                              setShowPopup(true);
                            }}
                          >
                            {"View Details"}
                          </button>
                          <div className="border-t border-gray-100"></div>
                          <button
                            className={`block w-full text-left px-4 py-2 text-sm text-primary font-bold hover:bg-gray-50 ${
                              trade.status.toLowerCase() === "resolved" ||
                              trade.status.toLowerCase() === "canceled"
                                ? "cursor-not-allowed opacity-50"
                                : "cursor-pointer"
                            }`}
                            disabled={
                              trade.status.toLowerCase() === "resolved" ||
                              trade.status.toLowerCase() === "canceled"
                            }
                            onClick={() => {
                              setFavor("Buyer");
                              setSelectedTrade(trade);
                              setShowResolvePopup(true);
                            }}
                          >
                            Release Escrow
                          </button>
                          <button
                            className={`block w-full text-left px-4 py-2 text-sm text-[#DF1D1D] font-bold hover:bg-gray-50 ${
                              trade.status.toLowerCase() === "resolved" ||
                              trade.status.toLowerCase() === "canceled"
                                ? "cursor-not-allowed opacity-50"
                                : "cursor-pointer"
                            }`}
                            disabled={
                              trade.status.toLowerCase() === "resolved" ||
                              trade.status.toLowerCase() === "canceled"
                            }
                            onClick={() => {
                              setFavor("Seller");
                              setSelectedTrade(trade);
                              setShowResolvePopup(true);
                            }}
                          >
                            Cancel Transaction
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

      {/* Trade Details Popup */}
      {selectedTrade && (
        <StuckTradePopup
          showPopup={showPopup}
          onClose={() => setShowPopup(false)}
          trade={selectedTrade}
          setFavor={setFavor}
          setShowResolvePopup={setShowResolvePopup}
          status={selectedTrade.status}
        />
      )}
      {/* Confirm Modal based on favor, blue for release escrow and red for cacnel, similarly text and should be different for each as well */}

      {favor === "Buyer" ? (
        <ConfirmModal
          isOpen={showResolvePopup}
          onClose={() => setShowResolvePopup(false)}
          onConfirm={handleSubmit}
          title={`Release Escrow`}
          message={`Are you sure you want to release escrow this trade?`}
          cancelText="Cancel"
          confirmText="Confirm"
          isLoading={isSubmitting}
          style="blue"
        />
      ) : (
        <ConfirmModal
          isOpen={showResolvePopup}
          isLoading={isSubmitting}
          onClose={() => setShowResolvePopup(false)}
          onConfirm={handleSubmit}
          title="Cancel Trade"
          message="Are you sure you want to cancel this trade? This action cannot be undone."
          style={"red"}
        />
      )}
    </div>
  );
};

export default P2PTableStuck;
