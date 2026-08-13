import type { Metadata } from "next"

const SITE_URL = "https://kadslabs.com"

export const metadata: Metadata = {
  title: "Feedback Center — KADS LABS",
  description: "Share feedback, suggestions, bug reports, or complaints with KADS LABS. Every submission goes straight to our founder dashboard.",
  alternates: { canonical: `${SITE_URL}/feedback` },
  openGraph: {
    title: "Feedback Center — KADS LABS",
    description: "Feedback, suggestions, bug reports. We read every message.",
    url: `${SITE_URL}/feedback`,
    type: "website",
    siteName: "KADS LABS",
    images: [{ url: "/logo-512.png", width: 512, height: 512, alt: "KADS LABS" }]
  },
  twitter: { card: "summary_large_image", title: "Feedback Center — KADS LABS", description: "We read every message.", images: ["/logo-512.png"] },
  robots: { index: true, follow: true }
}

export default function FeedbackLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
