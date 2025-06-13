"use client";
import ClientLayout from "@/src/components/layout/explorerLayout";
import { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthenticateUser } from "@/src/utils/functions";
import { Loader2 } from "lucide-react";
const Layout = ({ children }: { children: ReactNode }) => {
  const [loading, isLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    if (!AuthenticateUser()) {
      setTimeout(() => {
        isLoading(false);
      }, 1000);
      router.push("/signin");
    } else {
      isLoading(false);
    }
  }, []);
  return (
    <>
      {loading ? ( // a div with centered loader on the screen
        //
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
      ) : (
        <ClientLayout>{children}</ClientLayout>
      )}
    </>
  );
};

export default Layout;
