"use client";
import { useEffect } from "react";
import "./globals.css";
import { useRouter } from "next/navigation";



export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
      let user = localStorage.getItem("user");
      let token = localStorage.getItem("token");
      if (!user || !token) {
        router.push("/signin");
      }
    }, []);
  return (
    <html lang="en">
      <body >
        {children}
      </body>
    </html>
  );
}
