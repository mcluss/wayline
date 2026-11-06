"use client";
import { useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { BankDeposit } from "./BankDeposit";

export default function WalletPage() {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const { wallets } = useWallets();
  const [copied, setCopied] = useState(false);

  // Prefer the Privy-created embedded wallet; fall back to any connected wallet.
  const wallet = wallets.find((w) => w.walletClientType === "privy") ?? wallets[0];

  async function copy() {
    if (!wallet) return;
    try {
      await navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable: the address is still shown on screen */
    }
  }

  return (
    <main className="shell">
      <a href="/" className="back">Back to Wayline</a>
      <h1>Your business wallet</h1>
      {!ready && <p>Loading…</p>}
      {ready && !authenticated && (
        <>
          <p>Sign in with your work email. We create a wallet for you the first time you sign in.</p>
          <button className="btn" onClick={login}>Sign in</button>
        </>
      )}
      {ready && authenticated && (
        <section className="card">
          <p className="muted">Signed in as {user?.email?.address ?? "your account"}</p>
          {wallet ? (
            <>
              <p className="label">Wallet address</p>
              <p className="addr">{wallet.address}</p>
              <div className="row">
                <button className="btn" onClick={copy}>{copied ? "Copied" : "Copy address"}</button>
                <button className="btn ghost" onClick={logout}>Sign out</button>
              </div>
            </>
          ) : (
            <>
              <p>Creating your wallet…</p>
              <button className="btn ghost" onClick={logout}>Sign out</button>
            </>
          )}
        </section>
      )}
      {ready && authenticated && wallet && <BankDeposit ethereumAddress={wallet.address} />}
      <p className="muted small">Bank deposits are processed by Bridge. Payouts come next.</p>
    </main>
  );
}
