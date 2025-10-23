"use client"

import { Suspense } from "react"
import { LanguageProvider } from "../context/LanguageContext"
import { Provider } from "react-redux"
import { store } from "@/store/store"
import { SessionProvider } from "next-auth/react"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SessionProvider>
        <LanguageProvider>
          <Suspense fallback={null}>
            {children}
          </Suspense>
        </LanguageProvider>
      </SessionProvider>
    </Provider>
  )
}
