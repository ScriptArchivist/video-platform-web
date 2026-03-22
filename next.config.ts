import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/identity/:path*',
        destination: 'http://192.168.1.12:8001/:path*',
      },
      {
        source: '/api/video/:path*',
        destination: 'http://192.168.1.12:8003/api/v1/:path*',
      },
      {
        source: '/api/upload/:path*',
        destination: 'http://192.168.1.12:8002/api/v1/:path*',
      },
      {
        source: '/api/live/:path*',
        destination: 'http://192.168.1.12:8004/:path*',
      },
      {
        source: '/origin/:path*',
        destination: 'http://192.168.1.12:8080/:path*',
      },
    ];
  },
};

export default nextConfig;