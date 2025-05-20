"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"

type NavItem = {
  name: string
  href: string
  icon: string
  activeIcon: string
}

export default function Footer() {
  const pathname = usePathname()

  const navigation: NavItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: "/icons/footer-dashboard.svg", activeIcon: "/icons/footer-dashboard-active.svg" },
    { name: "Users", href: "/users", icon: "/icons/footer-users.svg", activeIcon: "/icons/footer-users-active.svg" },
    { name: "Transactions", href: "/transactions", icon: "/icons/footer-transactions.svg", activeIcon: "/icons/footer-transactions-active.svg" },
  ]

  return (
    <>
      {/* Spacer to prevent content from hiding behind footer */}
      <div className="h-24 w-full"></div>
      
      <footer className="fixed bottom-0 flex justify-center items-center w-full p-2 pb-8 z-10 pointer-events-none">
        <div className="flex justify-center items-center bg-white rounded-2xl border-[1px] border-[#0000001A] max-w-[600px] py-5 px-16 shadow-lg pointer-events-auto">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center px-3 py-1`}
              >
                <Image 
                  src={isActive ? item.activeIcon : item.icon} 
                  alt={item.name} 
                  width={60} 
                  height={60} 
                  
                />
                {/* <span className="text-xs mt-1">{item.name}</span> */}
              </Link>
            )
          })}
        </div>
      </footer>
    </>
  )
}