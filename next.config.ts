import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    middlewareClientMaxBodySize: '500mb',
  },

  async rewrites() {
    return [
      {
        source: '/api/identity/:path*',
        destination: 'http://192.168.49.2:30002/:path*',
      },
      {
        source: '/api/video/:path*',
        destination: 'http://192.168.49.2:30004/api/v1/:path*',
      },
      {
        source: '/api/upload/:path*',
        destination: 'http://192.168.49.2:30003/api/v1/:path*',
      },
      {
        source: '/api/live/:path*',
        destination: 'http://192.168.49.2:30000/api/v1/live/:path*',
      },
      {
        source: '/origin/:path*',
        destination: 'http://192.168.49.2:30006/:path*',
      },
    ];
  },
};

export default nextConfig;