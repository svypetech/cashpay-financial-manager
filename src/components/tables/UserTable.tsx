"use client";

import type React from "react";
import { useEffect, useState, useRef } from "react";
import UserProfileSidebar from "../users/UserInfoSidebar";
import Image from "next/image";
import ColourfulBlock from "../ui/ColourfulBlock";
import { User } from "@/src/lib/types/User";
import ExpandableId from "../ui/ExpandableId";

interface Props {
  headings: string[];
  data: User[];
  setData: React.Dispatch<React.SetStateAction<User[]>>;
}

function formatDate(dateString: string): string {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";

    // Format with locale then replace slashes with hyphens
    return date
      .toLocaleDateString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\//g, "-");
  } catch (error) {
    return "Invalid date format";
  }
}

const UserTable: React.FC<Props> = ({ data, headings, setData }) => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [showUserSidebar, setShowUserSidebar] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const needsPadding =
    activeDropdown !== null &&
    (selectedIndex >= data.length - 2 || data.length <= 2);

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

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowUserSidebar(true);
    setActiveDropdown(null);
  };

  return (
    <div className="flex-1 rounded-lg w-full py-5">
      {/* Table */}
      <div
        className={`rounded-lg overflow-x-auto w-full pb-[30px] ${
          needsPadding ? "pb-28" : ""
        }`}
        ref={tableRef}
      >
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-secondary/10">
            <tr className="font-satoshi text-[12px] sm:text-[16px] whitespace-nowrap">
              <th className="p-4 sm:p-4 text-left font-[700] w-[10%]">
                {headings[0]}
              </th>
              <th className="p-4 sm:p-4 text-left font-[700] w-[15%]">
                {headings[1]}
              </th>
              <th className="p-4 sm:p-4 text-left font-[700] w-[18%]">
                {headings[2]}
              </th>
              <th className="p-4 sm:p-4 text-left font-[700] w-[22%]">
                {headings[3]}
              </th>
              <th className="p-4 sm:p-4 text-left font-[700] w-[25%]">
                {headings[4]}
              </th>
              <th className="p-4 sm:p-4 text-left font-[700] w-[10%]">
                {headings[5]}
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) &&
              data.map((user, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 text-[12px] sm:text-[16px]"
                >
                  <td className="px-2 sm:px-4 py-3  sm:py-4 font-satoshi whitespace-nowrap">
                    <ExpandableId id={user._id} />
                  </td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 font-satoshi font-bold text-primary whitespace-nowrap">
                    {user.name
                      ? user.name?.firstName + " " + user.name?.lastName
                      : "N/A"}
                  </td>

                  <td className="px-2 sm:px-4 py-3 sm:py-4 font-satoshi whitespace-nowrap overflow-hidden text-ellipsis">
                    {user.email ? user.email : "N/A"}
                  </td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 font-satoshi whitespace-nowrap">
                    {formatDate(user.date)}
                  </td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 font-satoshi">
                    <ColourfulBlock
                      text={
                        user.verificationStatus === "new"
                          ? "Pending"
                          : user.verificationStatus
                      }
                      className={`text-center rounded-xl md:text-md font-semibold ${
                        user.verificationStatus === "Approved"
                          ? "bg-[#71FB5533] text-[#20C000]"
                          : "text-[#727272] bg-[#72727233]"
                      }`}
                    />
                  </td>
                  <td className="relative px-2 sm:px-4 py-3 sm:py-4 font-satoshi text-center">
                    <div className="dropdown-container relative">
                      <button
                        className="flex items-center justify-center w-[80%] lg:w-[100%] xl:w-[70%] 2xl:w-[50%]  cursor-pointer"
                        onClick={() => toggleDropdown(index)}
                      >
                        <Image
                          src="/icons/options.svg"
                          alt="Options"
                          width={24}
                          height={24}
                          className="w-4 h-4 "
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
                            onClick={() => handleViewUser(user)}
                          >
                            View
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        <UserProfileSidebar
          showSidebar={showUserSidebar}
          onClose={() => {
            setShowUserSidebar(false);
            setSelectedUser(null);
          }}
          user={
            selectedUser
              ? {
                  ...selectedUser,
                  date: formatDate(selectedUser.date),
                }
              : null
          }
        />
      </div>
    </div>
  );
};

export default UserTable;
