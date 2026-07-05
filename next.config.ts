import type { NextConfig } from "next";

// 'unsafe-inline' scripts: Next.js hydration and the GA4 init snippet are inline;
// nonce-based CSP needs per-request middleware — revisit if we ever add one.
// Cloudinary is listed for img-src defensively (most images proxy via /_next/image).
// frame-src covers the Google Maps embeds on /contact and /showroom.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://*.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://res.cloudinary.com https://*.googletagmanager.com https://*.google-analytics.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
  "frame-src https://www.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  // 2 years; add "; preload" once the production domain is stable on HTTPS
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // No page on this site (including /admin) has a legitimate framing use
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "www.nolte-kuechen.com",
      },
      {
        protocol: "https",
        hostname: "www.mrida.in",
      },
      {
        protocol: "https",
        hostname: "*.bosch-home.com",
      },
      {
        protocol: "https",
        hostname: "*.siemens-home.bsh-group.com",
      },
      {
        protocol: "https",
        hostname: "www.hettich.com",
      },
    ],
    // Seed/demo imagery uses local SVG placeholders until official
    // Cloudinary assets are provided. SVGs are served sandboxed.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
