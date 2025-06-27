import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: false, // Keep ESLint enabled
  },
  // Disable the img element warning as we're using img tags appropriately
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
