import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const API_URL = process.env.BACKEND_API_URL || 'http://127.0.0.1:5000';
    return {
      fallback: [
        {
          source: '/api/:path*',
          destination: `${API_URL}/api/:path*`,
        },
      ]
    };
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;
