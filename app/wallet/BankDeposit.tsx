"use client";
import { useState } from "react";
import { usePrivy, useFundWalletWithBankDeposit, type WalletWithMetadata } from "@privy-io/react-auth";
import { useCreateWallet as useCreateSolanaWallet } from "@privy-io/react-auth/solana";

// Chains Bridge can deliver USDC to, as CAIP-2 ids. The EVM chains share the user's Ethereum
// embedded wallet address; Solana needs a separate Solana embedded wallet.
const CHAINS = [
  { id: "base", label: "Base", caip2: "eip155:8453", type: "ethereum" },
  { id: "ethereum", label: "Ethereum", caip2: "eip155:1", type: "ethereum" },
  { id: "tempo", label: "Tempo", caip2: "eip155:4217", type: "ethereum" },
  { id: "solana", label: "Solana", caip2: "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp", type: "solana" },
] as const;
type ChainId = (typeof CHAINS)[number]["id"];

// Which Bridge key in the Privy dashboard to use. Live by default; set
// NEXT_PUBLIC_BRIDGE_ENV=sandbox to use the sandbox key (test money, test KYC).
const IS_SANDBOX = process.env.NEXT_PUBLIC_BRIDGE_ENV === "sandbox";
const BRIDGE_PROVIDER = IS_SANDBOX ? "bridge-sandbox" : "bridge";

export function BankDeposit({ ethereumAddress }: { ethereumAddress: string }) {
  const { user } = usePrivy();
  const { fund } = useFundWalletWithBankDeposit();
  const { createWallet: createSolanaWallet } = useCreateSolanaWallet();
  const [chainId, setChainId] = useState<ChainId>("base");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chain = CHAINS.find((c) => c.id === chainId)!;
  const solanaAddress = user?.linkedAccounts.find(
    (a): a is WalletWithMetadata =>
      a.type === "wallet" && a.chainType === "solana" && a.walletClientType === "privy"
  )?.address;

  async function deposit() {
    setBusy(true);
    setError(null);
    try {
      let address = ethereumAddress;
      if (chain.type === "solana") {
        address = solanaAddress ?? (await createSolanaWallet()).wallet.address;
      }
      await fund({
        source: { assets: ["usd", "eur", "gbp", "mxn", "brl"] },
        destination: { asset: "usdc", chain: chain.caip2, address },
        provider: BRIDGE_PROVIDER,
      });
    } catch (e) {
      // Closing the Privy modal also rejects; only show real errors.
      const message = e instanceof Error ? e.message : "";
      if (message && !/clos|cancel|back navigation/i.test(message)) setError(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="card">
      <p className="label" style={{ marginTop: 0 }}>
        Add funds by bank transfer{IS_SANDBOX && " (sandbox: test mode, no real money)"}
      </p>
      <p className="muted" style={{ marginTop: 0 }}>
        Send USD, EUR, GBP, MXN or BRL from your business bank account and receive USDC in this wallet.
        The first time, you’ll verify your identity with Bridge.
      </p>
      <label className="label" htmlFor="deposit-chain" style={{ display: "block" }}>Receive USDC on</label>
      <select
        id="deposit-chain"
        className="select"
        value={chainId}
        onChange={(e) => setChainId(e.target.value as ChainId)}
        disabled={busy}
      >
        {CHAINS.map((c) => (
          <option key={c.id} value={c.id}>{c.label}</option>
        ))}
      </select>
      {chain.type === "solana" && !solanaAddress && (
        <p className="muted small" style={{ marginTop: 8 }}>A Solana wallet will be created for you first.</p>
      )}
      <div className="row" style={{ marginTop: 16 }}>
        <button className="btn" onClick={deposit} disabled={busy}>
          {busy ? "Opening…" : "Get bank details"}
        </button>
      </div>
      {error && <p role="alert" style={{ color: "#b42318" }}>{error}</p>}
    </section>
  );
}
