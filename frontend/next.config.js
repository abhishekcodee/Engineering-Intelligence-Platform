/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'api.dicebear.com' },
    ],
  },
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/overview',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
