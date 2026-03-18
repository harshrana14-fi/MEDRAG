import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // @ts-ignore
    turbo: {
      root: "./",
    },
  },
};

export default nextConfig;
