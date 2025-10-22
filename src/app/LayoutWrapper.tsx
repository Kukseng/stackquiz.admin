"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";
import StoreProvider from "@/providers/StoreProvider";
import OfflineIndicator from "@/components/OfflineIndicator";

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();

  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);


  return (
    <>
      {!isOnline && <OfflineIndicator />} 
      <StoreProvider>{children}</StoreProvider>
    </>
  );
}
