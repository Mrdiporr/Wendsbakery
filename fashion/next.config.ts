import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configured for Subdomain Hosting (e.g. fashion.yourdomain.com)
  // Reuses the same custom server.js pattern as the bakery for cPanel compatibility.
  
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "**",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
