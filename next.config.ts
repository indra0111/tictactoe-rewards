import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export", // Ensures static export
  distDir: "out",   // Output directory
  basePath: process.env.NODE_ENV === "production" ? "/tictactoe-rewards" : "", // Only use basePath in production
  images: {
    unoptimized: true, // Required if using Next.js images
  },
};

export default nextConfig;
