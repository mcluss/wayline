"use client";
import type { ReactNode } from "react";
import { PrivyProvider } from "@privy-io/react-auth";

export function Providers({ children }: { children: ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  if (!appId) {
    return (
      <main className="shell">
        <h1>Privy isn’t configured yet</h1>
        <p>Set NEXT_PUBLIC_PRIVY_APP_ID (see .env.example), then restart the app.</p>
      </main>
    );
  }
  return (
    <PrivyProvider
      appId={appId}
      config={{
        loginMethods: ["email"],
        appearance: { theme: "light", accentColor: "#2f3cf0" },
        // Creates an embedded wallet for each user the first time they sign in.
        embeddedWallets: { ethereum: { createOnLogin: "users-without-wallets" } },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
