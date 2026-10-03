import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produce .next/standalone/server.js for the slim production Docker image.
  output: "standalone",
  // Compile-time checking of every <Link href> against the real route table.
  typedRoutes: true,
  turbopack: {
    // Stops the workspace-root walk from escaping into the parent directory.
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;