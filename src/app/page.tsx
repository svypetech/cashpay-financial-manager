"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function Page() {
  const router = useRouter();
  useEffect(() => {
    router.push("/dashboard");
  }, []);

  return (
    <div className=" flex flex-col items-between justify-between h-screen"></div>
  );
}
