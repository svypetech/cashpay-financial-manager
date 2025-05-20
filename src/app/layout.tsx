"use client";
import { useEffect } from "react";
import "./globals.css";
import { useRouter } from "next/navigation";
import { AuthenticateUser } from "@/src/utils/functions";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  useEffect(() => {
    if (!AuthenticateUser()) {
      router.push("/signin");
    }
  }, []);
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
