import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for the custom server.js entry point (cPanel / Phusion Passenger)
  // The custom server handles all requests — Next.js should not try to listen itself.
  // Note: 'standalone' is NOT used here because we're using a custom server,
  // not the standalone output. cPanel installs node_modules on the server.

  images: {
    remotePatterns: [
      // Allow WooCommerce product images from any domain.
      // Narrow this to your specific WordPress hostname once known:
      // e.g. { protocol: "https", hostname: "wendysbakehouse.ca" }
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "/**",
      },
      // Allow http for local WP development
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
