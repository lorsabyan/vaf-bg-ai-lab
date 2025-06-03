/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
    unoptimized: true, // Required for static export
  },
  // Enable static exports for GitHub Pages deployment
  output: 'export',
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '/vaf-bg-ai-lab' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/vaf-bg-ai-lab/' : '',
  // Disable server-side features for static export
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig
