import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  assetPrefix: '/RoXDrive',
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
