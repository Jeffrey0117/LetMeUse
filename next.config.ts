import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    return [
      {
        // Un-versioned SDK loader: keep browser cache short so updates
        // propagate quickly. Without an explicit Cache-Control, Cloudflare
        // applies its 4-hour default browser TTL and sites serve stale SDK.
        source: "/letmeuse.js",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=300, must-revalidate",
          },
        ],
      },
      {
        source: "/embed/letmeuse.js",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=300, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
