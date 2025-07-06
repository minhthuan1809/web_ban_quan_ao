/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'strivend.vn',
      },
      {
        protocol: 'https',
        hostname: 'aobongdathietke.vn',
      },
      {
        protocol: 'https',
        hostname: 'file.hstatic.net',
      },
    ],
  },
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizePackageImports: [
      '@nextui-org/react',
      '@tremor/react',
      'framer-motion',
      'react-icons',
      'lucide-react'
    ]
  },
};

module.exports = nextConfig;
