import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.extensions = [
      '.web.ts',
      '.web.tsx',
      '.web.js',
      ...config.resolve.extensions,
    ];
    return config;
  },
};

export default nextConfig;
