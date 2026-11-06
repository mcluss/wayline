// Stand-in for an optional Solana package that Privy's SDK references but this app doesn't use.
export function getTransferSolInstruction() {
  throw new Error("@solana-program/system is not installed. Solana wallets are not used in this app.");
}
