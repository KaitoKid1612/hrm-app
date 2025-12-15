import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export', // Export static HTML
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ['src'],
  },
  images: {
    unoptimized: true, // Required for static export
  },
};

export default nextConfig;
