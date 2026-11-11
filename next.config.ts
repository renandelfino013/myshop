import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/nr4ofgz2/**',
      },
      {
        protocol: 'https',
        hostname: 'testedafeat.com.br',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
