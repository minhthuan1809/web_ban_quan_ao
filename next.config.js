/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

module.exports = nextConfig;
