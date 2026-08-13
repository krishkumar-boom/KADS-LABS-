/** @type {import('next').NextConfig} */
const isStaticExport = process.env.NEXT_STATIC_EXPORT === "true"

const nextConfig = {
  // Static export only when explicitly requested (for ZIP/file:// builds).
  // Default (Vercel/production): SSR + API routes + middleware enabled.
  ...(isStaticExport ? { output: "export" } : {}),
  ...(isStaticExport ? { distDir: "dist" } : {}),
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false
  },
  eslint: {
    ignoreDuringBuilds: false
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
          { key: "X-XSS-Protection", value: "1; mode=block" }
        ]
      }
    ]
  }
}

module.exports = nextConfig
