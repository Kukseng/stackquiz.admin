"use client";
import { Inter } from "next/font/google";
import { useState, useEffect, ReactNode } from "react";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { Providers } from "@/components/providers/Providers";
import OfflineIndicator from "@/components/OfflineIndicator";
import { LanguageProvider } from "@/context/LanguageContext";

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
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
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          {!isOnline && <OfflineIndicator />}
          <Providers>{children}</Providers>
          <Toaster position="top-right" reverseOrder={false} />
        </LanguageProvider>
      </body>
    </html>
  );
}
