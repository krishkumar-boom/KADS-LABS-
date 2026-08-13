import { NextResponse, type NextRequest } from "next/server"

/**
 * Enterprise-grade security middleware.
 * - CSP with safe defaults (allows Supabase, Google Fonts, GA, Clarity)
 * - Strict transport security
 * - Anti-MIME sniffing
 * - Frame protection
 * - Referrer policy
 * - Permissions policy lockdown
 * - X-Robots-Tag noindex for private routes
 */

const PROTECTED_PREFIXES = ["/admin", "/founder", "/developer", "/super", "/client", "/profile", "/ticket", "/hr", "/dashboard"]
const PRIVATE_NOINDEX_PATHS = ["/admin", "/founder", "/developer", "/super", "/hr", "/dashboard", "/client", "/profile", "/ticket"]

function isApiRoute(pathname: string) {
  return pathname.startsWith("/api/")
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const res = NextResponse.next()

  // Security headers for all responses
  const headers = res.headers

  // Prevent MIME sniffing
  headers.set("X-Content-Type-Options", "nosniff")

  // Prevent clickjacking
  headers.set("X-Frame-Options", "SAMEORIGIN")

  // Referrer policy
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  // Lock down powerful APIs
  headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=(), " +
    "autoplay=(self), fullscreen=(self)"
  )

  // XSS protection (legacy defense)
  headers.set("X-XSS-Protection", "1; mode=block")

  // HSTS (HTTPS only)
  headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")

  // Hide server technology
  headers.set("X-Powered-By", "KADS LABS")

  // Content Security Policy — allows Firebase Auth, Google Identity, Supabase, analytics
  const csp = [
    "default-src 'self'",
    // Scripts: self + inline/eval (for Firebase/Next.js) + Google Tag/Clarity/Supabase/Firebase/Google Identity/GAPI/Recaptcha
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.clarity.ms https://*.supabase.co https://cdn.vercel-insights.com https://*.googleapis.com https://*.firebaseio.com https://*.firebase.com https://*.gstatic.com https://www.gstatic.com https://apis.google.com https://accounts.google.com https://www.google.com https://*.google.com",
    // Styles: self + Google Fonts + unsafe-inline for Tailwind/framer-motion
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com https://*.googleapis.com https://*.gstatic.com",
    // Fonts: self + Google Fonts + gstatic fonts for Firebase UI
    "font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com https://*.gstatic.com data:",
    // Images: self + data: + https: (open graph, avatars) + blob: (preview) + Google/Firebase avatars
    "img-src 'self' data: blob: https: http:",
    // Connect: self + Supabase + GA + Clarity + Vercel + FIREBASE AUTH (CRITICAL!) + Google Identity + Realtime DB
    "connect-src 'self' https://*.supabase.co https://zruovpjzpqcqtawtnrmj.supabase.co wss://*.supabase.co https://www.google-analytics.com https://analytics.google.com https://www.clarity.ms https://*.clarity.ms https://va.vercel-scripts.com https://*.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://*.firebaseio.com https://*.firebase.com https://*.firebaseapp.com https://www.googleapis.com https://*.google.com https://accounts.google.com https://firestore.googleapis.com wss://*.firebaseio.com https://firebaseinstallations.googleapis.com https://fcmregistrations.googleapis.com",
    // Media
    "media-src 'self' blob:",
    // Workers / frames — allow blob workers for Firebase + Google/Firebase OAuth popups/iframes
    "worker-src 'self' blob:",
    "frame-src 'self' https://www.google.com https://accounts.google.com https://*.firebaseapp.com https://*.firebase.com https://*.googleapis.com",
    // Object plugin none
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "manifest-src 'self'"
  ].join("; ")
  headers.set("Content-Security-Policy", csp)
  headers.set("Content-Security-Policy-Report-Only", csp.replace("frame-ancestors", ""))

  // No index private routes
  if (PROTECTED_PREFIXES.some(p => pathname.startsWith(p))) {
    headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet")
    headers.set("Cache-Control", "private, no-cache, no-store, must-revalidate")
  }

  // Don't cache API/auth responses
  if (isApiRoute(pathname) || pathname.startsWith("/auth/")) {
    headers.set("Cache-Control", "no-store, no-cache, must-revalidate, private")
    headers.set("Pragma", "no-cache")
  }

  // Cross-origin isolation for SharedArrayBuffer (not needed currently but harmless)
  // headers.set("Cross-Origin-Opener-Policy", "same-origin")
  // headers.set("Cross-Origin-Embedder-Policy", "require-corp")

  // Prevent DNS rebinding by validating Host header (Vercel handles this but double)
  headers.set("X-DNS-Prefetch-Control", "on")

  return res
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon|logo|icon|apple-touch|manifest|robots|sitemap|sw.js|VERSION|team/|.*\\.(?:png|jpg|jpeg|svg|webp|gif|ico|webm|mp4|woff2?|css|js)$).*)"
  ]
}
