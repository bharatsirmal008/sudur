import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const API_URL = process.env.BACKEND_API_URL || 'http://localhost:5000';
    return [
      {
        source: '/api/:path((?!auth).*)',
        destination: `${API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
