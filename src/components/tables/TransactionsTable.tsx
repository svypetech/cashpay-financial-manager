"use client"

import type React from "react"
import {  useState, useRef } from "react"

import TransactionManagementPopup from "../transaction/TransactionManagementPopup"
import { shortenAddress, timeAgo } from "@/src/utils/functions"
import TransactionType from "@/src/lib/types/Transactions"


interface Props {
    headings: string[]
    data: TransactionType[]
}

const TransactionTable: React.FC<Props> = ({ data, headings }) => {
    const [showPopup, setShowPopup] = useState(false)
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionType | null>(null)
    const tableRef = useRef<HTMLDivElement>(null)



    return (
        <div className="flex-1 rounded-lg w-full py-5">
            {/* Table */}
            <div className="rounded-lg overflow-x-auto w-full" ref={tableRef}>
                <table className="w-full text-left table-auto min-w-[600px]">
                    <thead className="bg-secondary/10">
                        <tr className="font-satoshi text-[12px] md:text-[16px] py-3 md:py-6 px-2 md:px-4">
                            {headings.map((heading, index) => (
                                <th key={index} className="px-2 md:px-4 py-3 md:py-5 text-left">
                                    {heading}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(data) &&
                            data.map((transaction, index) => (
                                <tr key={index} onClick={() => {
                                    setSelectedTransaction(transaction)
                                    setShowPopup(true)
                                    }} className="border-b border-gray-200 text-[12px] md:text-[16px] cursor-pointer">
                                    <td className="px-2 md:px-4 py-3 md:py-6 font-satoshi min-w-[100px] break-words flex gap-2">
                                    <div className="rounded-full p-1.5 bg-secondary2 mr-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left-right h-3.5 w-3.5 text-primary"><path d="M8 3 4 7l4 4"></path><path d="M4 7h16"></path><path d="m16 21 4-4-4-4"></path><path d="M20 17H4"></path></svg>
                                    </div>
                                        <span>{shortenAddress(transaction.id)}</span></td>
                                    <td className="px-2 md:px-4 py-3 md:py-6 font-satoshi font-bold text-primary min-w-[120px] break-words">
                                        {shortenAddress(transaction.web3Data.transaction.from)} 
                                    </td>
                                    <td className="px-2 md:px-4 py-3 md:py-6 font-satoshi min-w-[150px] break-words">{shortenAddress(transaction.web3Data.transaction.to)}</td>
                                    <td className="px-2 md:px-4 py-3 md:py-6 font-satoshi min-w-[120px]">
                                        {(transaction.status.toLowerCase() === "completed") && (
                                            <span className="text-left bg-[#71FB5533] text-[#20C000] px-4 py-3 rounded-xl text-xs md:text-base font-semibold whitespace-nowrap">
                                                Completed
                                            </span>
                                        )}
                                        {transaction.status.toLowerCase() === "pending" && (
                                            <span className="text-[#727272] bg-[#72727233] px-4 py-3 rounded-xl text-xs md:text-base font-semibold whitespace-nowrap">
                                                Pending
                                            </span>
                                        )}
                                        {transaction.status.toLowerCase() === "failed" && (
                                            <span className="text-[#FF0000] bg-[#FF000033] px-4 py-3 rounded-xl text-xs md:text-base font-semibold whitespace-nowrap">
                                                Failed
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-2 md:px-4 py-3 md:py-6 font-satoshi min-w-[100px]">{shortenAddress(transaction.web3Data.transaction.blockNumber)}</td>
                                    <td className="px-2 md:px-4 py-3 md:py-6 font-satoshi min-w-[60px] ">{timeAgo(transaction.date)}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {/* @ts-ignore Transaction Details Popup */}
            <TransactionManagementPopup showPopup={showPopup} onClose={() => setShowPopup(false)} transaction={selectedTransaction} />
        </div>
    )
}

export default TransactionTable;