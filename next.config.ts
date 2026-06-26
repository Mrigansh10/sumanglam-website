import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  outputFileTracingRoot: process.cwd(),
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
