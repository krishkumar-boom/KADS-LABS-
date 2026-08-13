import type { Metadata } from "next"

const SITE_URL = "https://kadslabs.com"

export const metadata: Metadata = {
  title: "Careers at KADS LABS — Join Our Team",
  description: "Explore open positions at KADS LABS — AI Engineers, Full Stack Developers, Mobile Developers, Designers, Video Editors, Marketing, Sales, Internships. Apply now.",
  alternates: { canonical: `${SITE_URL}/careers` },
  openGraph: {
    title: "Careers at KADS LABS",
    description: "Build the future of AI, SaaS and digital products with us.",
    url: `${SITE_URL}/careers`,
    type: "website",
    siteName: "KADS LABS",
    images: [{ url: "/logo-512.png", width: 512, height: 512, alt: "KADS LABS" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers at KADS LABS",
    description: "Open positions across engineering, design, media, marketing.",
    images: ["/logo-512.png"]
  },
  robots: { index: true, follow: true }
}

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
