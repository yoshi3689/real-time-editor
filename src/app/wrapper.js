'use client';

import { SessionProvider } from "next-auth/react";

export default function SessionProviderWrapper({ children }) {
  return <SessionProvider refetchInterval={20 * 60} >{children}</SessionProvider>;
}
