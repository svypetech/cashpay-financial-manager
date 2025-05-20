"use client"
import ClientLayout from "@/src/components/layout/explorerLayout";
import { ReactNode } from "react";
const Layout =  ({ children }: { children: ReactNode }) => {
    
    return (
      <ClientLayout>{children}</ClientLayout>
    );
  };
  
  export default Layout;
  