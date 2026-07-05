import type { NextConfig } from "next";

const securityHeaders = [
  // 2 years; add "; preload" once the production domain is stable on HTTPS
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // No page on this site (including /admin) has a legitimate framing use
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  outputFileTracingRoot: process.cwd(),
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
