import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["logos.covalenthq.com","storage.googleapis.com"]
  },
  productionBrowserSourceMaps: true, 
  eslint: {
    ignoreDuringBuilds: true, 
  },
};

export default nextConfig;
