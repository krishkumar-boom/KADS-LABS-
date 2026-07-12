/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Disable x-powered-by header for security
  poweredByHeader: false,
  // Improve compression for static export
  compress: true,
  // Ensure React Strict Mode is on to catch issues
  reactStrictMode: true
}

module.exports = nextConfig
