/** Serves the existing marketing page (public/landing.html) at "/" and keeps the new React pages alongside it. */
const nextConfig = {
  async rewrites() {
    return { beforeFiles: [{ source: "/", destination: "/landing.html" }] };
  },
};
export default nextConfig;
