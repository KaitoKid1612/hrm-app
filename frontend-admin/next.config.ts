import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ['src'],
  },
};

export default nextConfig;
