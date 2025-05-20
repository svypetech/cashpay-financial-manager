"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { User } from "@/src/lib/types/User";

interface UserProfileSidebarProps {
  showSidebar: boolean;
  onClose: () => void;
  user: User;
}

export default function UserProfileSidebar({
  showSidebar,
  onClose,
  user,
}: UserProfileSidebarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [slideIn, setSlideIn] = useState(false);

  // Handle animation and visibility states
  useEffect(() => {
    if (showSidebar) {
      setIsVisible(true);
      setTimeout(() => {
        setSlideIn(true);
      }, 10);
      document.body.style.overflow = "hidden";
    } else {
      setSlideIn(false);
      const timer = setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = "auto";
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [showSidebar]);

  // Clean up overflow style when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!showSidebar && !isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ease-in-out ${
          slideIn ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-[520px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${
          slideIn ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-screen flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 mt-5">
            <h2 className="text-2xl font-semibold">User Profile</h2>
            <button
              onClick={onClose}
              className="rounded-full cursor-pointer p-1 hover:bg-gray-100"
              aria-label="Close sidebar"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-col items-center px-6 py-8 font-[satoshi] mx-auto max-w-[420px] w-full">
            {/* Profile Image */}
            <div className="mb-4 h-32 w-32 overflow-hidden rounded-full flex items-center justify-center">
              <img
                src={user.selfieUrl || "/placeholder.svg?height=200&width=200"}
                alt={
                  user.name && user.name.firstName + " " + user.name.lastName
                }
                className="h-full w-full object-cover"
              />
            </div>

            {/* User Info */}
            <div className="text-center w-full mb-6">
              <h3 className="mb-1 text-xl font-semibold">
                {user.name && user.name.firstName + " " + user.name.lastName}
              </h3>
              <p className="text-sm text-gray-500">User ID: {user._id}</p>
            </div>

            {/* User Details - Exactly matching reference */}
            <div className="flex flex-col justify-center mb-6 w-full min-w-[400px] px-10">
              <div className="mb-2 flex w-full items-center">
                <div className="flex w-full gap-1 w-full">
                  <div className="flex gap-2 w-24">
                    <Image
                      src="/icons/sms.svg"
                      alt="User Icon"
                      width={25}
                      height={25}
                      className="h-5 w-5 text-gray-400"
                    />
                    <span className="font-bold">Email</span>
                  </div>
                  <span className="">{user.email}</span>
                </div>
              </div>
              <div className="mb-2 flex w-full items-center">
                <div className="flex w-full gap-1">
                  <div className="flex gap-2 w-24">
                    <Image
                      src="/icons/calendar.svg"
                      alt="User Icon"
                      width={25}
                      height={25}
                      className="h-5 w-5 text-gray-400"
                    />
                    <span className="font-bold">Joining</span>
                  </div>
                  <span className="text-sm">{user.date}</span>
                </div>
              </div>
            </div>

            {/* KYC Verification Section */}
            <div className="flex flex-col justify-center w-full max-w-[380px]">
              {/* KYC Header */}
              <div className="mb-4 flex w-full items-center justify-between gap-5">
                <h4 className="text-2xl font-semibold text-center">
                  KYC Verification
                </h4>
                {user.verificationStatus &&
                  user.verificationStatus.toLowerCase() === "approved" && (
                    <span className="rounded-xl font-bold px-4 py-2 text bg-[#71FB5533] text-[#20C000]">
                      Verified
                    </span>
                  )}
                {user.verificationStatus === "Pending" && (
                  <span className="rounded-xl font-bold px-4 py-2 text-[#727272] bg-[#72727233]">
                    Pending
                  </span>
                )}
              </div>

              {/* Verification Badge */}
              {user.verificationStatus === "Approved" && (
                <div className="mb-12 flex justify-center">
                  <div className="relative">
                    <Image
                      src="/icons/blue-clock.svg"
                      alt="Verification Badge"
                      width={220}
                      height={220}
                      className="w-full h-full"
                    />
                    <Image
                      src="/icons/ellipse-shadow.svg"
                      alt="Verification Badge"
                      width={162}
                      height={12}
                      className="absolute top-27 w-full h-full"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
