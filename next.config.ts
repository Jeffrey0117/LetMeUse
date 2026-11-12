import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    return [
      {
        // Pages may only be framed by this site (the style gallery frames its own
        // preview). Blocks clickjacking of /admin, /login and /checkout.
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        // Uploaded files are data, never documents: no scripts, no framing, no sniffing.
        source: '/uploads/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; sandbox; frame-ancestors 'none'" },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
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
