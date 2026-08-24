/** @type {import('next').NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS || false;
let repo = '';
if (isGithubActions && process.env.GITHUB_REPOSITORY) {
  repo = '/' + process.env.GITHUB_REPOSITORY.split('/')[1];
}

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || repo || undefined,
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || (repo ? `${repo}/` : undefined),
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'api.dicebear.com' },
    ],
  },
  webpack: (config) => {
    config.ignoreWarnings = [
      { module: /node_modules/ },
      /Failed to parse source map/,
    ];
    return config;
  },
};

module.exports = nextConfig;
