import { fileURLToPath } from "node:url";

/** Serves the marketing page at "/" and aliases an optional Solana package this app doesn't use. */
const nextConfig = {
  async rewrites() {
    return { beforeFiles: [{ source: "/", destination: "/landing.html" }] };
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@solana-program/system": fileURLToPath(
        new URL("./shims/solana-program-system.js", import.meta.url)
      ),
    };
    return config;
  },
};
export default nextConfig;
