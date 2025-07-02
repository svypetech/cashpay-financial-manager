"use client";

import type React from "react";
import { useState } from "react";
import Overview from "@/src/components/dashboard/Overview";
import Insights from "@/src/components/dashboard/Insights";
import Tabs from "@/src/components/ui/Tabs";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("Overview");

  const tabs = ["Overview", "User Insights"];

  return (
    <main className="w-full sm:px-10 px-6 py-6 font-[satoshi] ">
      {/* Tabs */}
      <div className="w-full bg-white rounded-lg">
        <div className="flex justify-center items-center mb-2">
          <div className="w-fit mb-7 sm:mb-5">
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              size="normal"
            />
          </div>
        </div>

        {activeTab === "Overview" && <Overview />}

        {activeTab === "User Insights" && <Insights />}
      </div>
    </main>
  );
}
