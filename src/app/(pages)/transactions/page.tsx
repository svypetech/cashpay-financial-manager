"use client"

import type React from "react"
import { useState } from "react"
import Transactions from "@/src/components/transaction/Transactions"
import Wallet from "@/src/components/transaction/Wallet"
import P2PTrading from "@/src/components/p2pTrading/P2PTrading"
import P2PListing from "@/src/components/p2pListing/p2pListing"
import Tabs from "@/src/components/ui/Tabs"

// tabs are transactions, wallet, p2p trading store in object array
const tabs = [
  "Transactions",
   "Wallet",
   "P2P Trading",
  "P2P Listing",
]


export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState(tabs[0])

  return (
    <main className="w-full sm:px-10 px-6 py-6 font-[satoshi]">
      {/* Tabs */}
      <div className="flex justify-center mb-2">
        <div className="w-full bg-white rounded-lg">
          <div className="flex justify-center items-center mb-4">
            <Tabs 
            tabs={tabs}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
            size="normal"
            className="min-[500px]:text base"
            
            />
          </div>

          {activeTab === "Transactions" && (
            <Transactions />
          )}

          {activeTab === "Wallet" && (
            <Wallet />
          )}

          {activeTab === "P2P Trading" && (
            <P2PTrading />
          )}
          {activeTab === "P2P Listing" && (
            <P2PListing />
          )}
            
        </div>
      </div>
    </main>
  )
}