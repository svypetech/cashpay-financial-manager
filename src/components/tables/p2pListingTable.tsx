"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import ListingDetailsPopup from "../p2pListing/p2pDetailsPopUp";
import Image from "next/image";
import { Listing } from "@/src/lib/types/Listing";
import ColourfulBlock from "../ui/ColourfulBlock";
import ExpandableId from "../ui/ExpandableId";
import ConfirmationModal from "../ui/ConfirmModal"; // Import the confirmation modal
import axios from "axios";

interface Props {
  headings: string[];
  data: Listing[];
  setListings: React.Dispatch<React.SetStateAction<Listing[]>>;
}

const ListingsTable: React.FC<Props> = ({ data, headings }) => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing>(
    {} as Listing
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const tableRef = useRef<HTMLDivElement>(null);
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Add needsPadding logic
  const needsPadding =
    activeDropdown !== null &&
    (selectedIndex >= data.length - 2 || data.length <= 2);

  const getColumnWidthClass = (index: number): string => {
    switch (index) {
      case 0:
        return "w-[15%]"; // Listing ID
      case 1:
        return "w-[20%]"; // Created By
      case 2:
        return "w-[15%]"; // Type
      case 3:
        return "w-[20%]"; // Currency
      case 4:
        return "w-[20%]"; // Status
      case 5:
        return "w-[10%]"; // Actions
      default:
        return "w-[16.67%]"; // Equal distribution
    }
  };

  // Simple dropdown logic: close on outside click
  useEffect(() => {
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

  const handleDeleteListing = async (listingId: string) => {
    try {
      setIsSubmitting(true);
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/transaction/add/${listingId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Response:", response.data);
      if (response.data.success) {
        alert("listing deleted successfully");
      } else {
        alert("Failed to delete listing");
      }
    } catch (error) {
      console.error("Error deleting:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 rounded-lg w-full py-5">
      {/* Table - Add conditional padding bottom for dropdown space */}
      <div
        className={`rounded-lg overflow-x-auto w-full ${
          needsPadding ? "pb-28" : ""
        }`}
        ref={tableRef}
      >
        <table className="w-full text-left table-auto">
          <thead className="bg-secondary/10">
            <tr className="whitespace-nowrap text-[12px] md:text-[16px] py-3 md:py-4 px-2 md:px-4">
              {headings.map((heading, index) => (
                <th
                  key={index}
                  className={`px-2 md:px-4 py-3 md:py-4 text-left ${getColumnWidthClass(
                    index
                  )}`}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) &&
              data.map((listing, index) => (
                <tr
                  key={listing.id}
                  className="border-b border-gray-200 text-[12px] md:text-[16px] font-[satoshi]"
                >
                  <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap min-w-[100px]">
                    <ExpandableId id={listing.id} />
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap min-w-[120px] break-words">
                    <ExpandableId id={listing.createdBy} />
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap min-w-[150px] break-words">
                    {listing.type}
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap min-w-[150px] break-words">
                    {listing.currency}
                  </td>
                  <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap min-w-[120px]">
                    <ColourfulBlock
                      text={listing.addVisibility ? "Active" : "Inactive"}
                      className={
                        listing.addVisibility
                          ? "bg-[#71FB5533] text-[#20C000]"
                          : "bg-[#FF000033] text-[#FF0000]"
                      }
                    />
                  </td>
                  <td className="relative p-2 md:p-4 font-satoshi min-w-[60px] text-center">
                    <div className="dropdown-container relative inline-block">
                      <button
                        className="relative cursor-pointer"
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
                          className="absolute z-10 right-0 top-full mt-2 w-40 bg-white rounded-md shadow-lg py-1 border border-gray-100"
                          ref={(el) => {
                            dropdownRefs.current[index] = el;
                          }}
                        >
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-primary font-bold cursor-pointer hover:bg-gray-50"
                            onClick={() => {
                              setSelectedListing(listing);
                              setShowPopup(true);
                              setActiveDropdown(null);
                            }}
                          >
                            View Details
                          </button>
                          <div className="border-t border-gray-100"></div>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-red-500 font-bold cursor-pointer hover:bg-gray-50"
                            onClick={() => {
                              handleDeleteListing(listing.id);
                              setActiveDropdown(null);
                            }}
                          >
                            {isSubmitting ? "Deleting..." : "Delete Listing"}
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

      <ListingDetailsPopup
        showPopup={showPopup}
        onClose={() => setShowPopup(false)}
        listing={selectedListing}
      />
    </div>
  );
};

export default ListingsTable;
