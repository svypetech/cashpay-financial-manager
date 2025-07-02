"use client";

import ActiveUsers from "@/src/components/users/ActiveUsers";
import UserEngagement from "@/src/components/users/UserEngagement";
import Tabs from "@/src/components/ui/Tabs";
import { useState } from "react";

export default function ActiveUsersPage() {
  const [activeTab, setActiveTab] = useState("Active Users");

  const tabs = ["Active Users", "User Engagement"];

  return (
    <main className="sm:px-10 px-6 py-6">
      {/* Navigation Tabs */}
      <div className="w-full flex justify-center items-center mb-4">
        <div className="w-fit">
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            size="normal"
          />
        </div>
      </div>

      {/* Users Table */}
      {activeTab === "Active Users" ? <ActiveUsers /> : <UserEngagement />}
    </main>
  );
}
