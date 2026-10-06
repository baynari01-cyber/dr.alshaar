import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
    localPatterns: [{ pathname: "/images/**" }],
  },
  poweredByHeader: false,
};

export default nextConfig;
