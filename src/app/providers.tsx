"use client"

import { Suspense } from "react"
import LayoutWrapper from "./LayoutWrapper"
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
            <LayoutWrapper>{children}</LayoutWrapper>
          </Suspense>
        </LanguageProvider>
      </SessionProvider>
    </Provider>
  )
}


// "use client";

// import { SessionProvider } from "next-auth/react";
// import { ReactNode } from "react";

// interface ProvidersProps {
//   children: ReactNode;
// }

// export default function Providers({ children }: ProvidersProps) {
//   return <SessionProvider>{children}</SessionProvider>;
// }