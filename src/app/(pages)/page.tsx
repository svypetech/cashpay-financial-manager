"use client";

import { useEffect } from "react";

export default function Page() {
  useEffect(()=>{
    window.location.href="/dashboard"
  },[])

  
  return (
    <div className=" flex flex-col items-between justify-between h-screen">

    </div>
  );
}
