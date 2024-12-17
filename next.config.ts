import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'i.pravatar.cc',
      'plus.unsplash.com',
      // Add other image domains you're using
    ]
  }
};

export default nextConfig;
