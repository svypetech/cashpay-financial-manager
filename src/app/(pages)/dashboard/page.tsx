"use client"

import type React from "react"
import { useState } from "react"
import Overview from "@/src/components/dashboard/Overview"
import Insights from "@/src/components/dashboard/Insights"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <main className="w-full sm:px-10 px-6 py-6 font-[satoshi] ">
      {/* Tabs */}
      <div className="mb-2">
        <div className="w-full bg-white rounded-lg">
          <div className="flex justify-center items-center mb-2">
            <div className="flex w-fit">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 text-black ${activeTab === "overview"
                  ? "border-b-2 border-primary font-bold"
                  : "hover:text-gray-700 cursor-pointer"
                  }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("insights")}
                className={`px-4 py-2 ${activeTab === "insights"
                  ? "border-b-2 border-primary font-bold"
                  : "hover:text-gray-700 cursor-pointer"
                  }`}
              >
                User Insights
              </button>
            </div>
          </div>

          {activeTab === "overview" && (
            <Overview />
          )}

          {activeTab === "insights" && (
            <Insights />
          )}
        </div>
      </div>
    </main>
  )
}