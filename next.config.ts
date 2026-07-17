import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    return [
      {
        // Un-versioned SDK loader: no-cache = browsers revalidate via ETag
        // (cheap 304) so updates propagate instantly. A small max-age doesn't
        // work here: Cloudflare's zone Browser Cache TTL (4h) overrides any
        // origin max-age smaller than itself, but passes no-cache through.
        source: "/letmeuse.js",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache",
          },
        ],
      },
      {
        source: "/embed/letmeuse.js",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
