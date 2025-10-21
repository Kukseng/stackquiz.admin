
// 'use client'
// import { Provider } from 'react-redux'
// import { store } from '../lib/store'

// export default function StoreProvider({ children }: { children: React.ReactNode }) {
//   return <Provider store={store}>{children}</Provider>
// }

"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return <SessionProvider>{children}</SessionProvider>;
}