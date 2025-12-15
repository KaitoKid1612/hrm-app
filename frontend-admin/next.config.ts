import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Remove 'output: export' - use standalone for Web Service
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ['src'],
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
