/** Serves the marketing page at "/". */
const nextConfig = {
  async rewrites() {
    return { beforeFiles: [{ source: "/", destination: "/landing.html" }] };
  },
};
export default nextConfig;
