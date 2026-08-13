import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "KADS MEDIA | Creative Minds. Powerful Impact.",
  description: "KADS MEDIA — Digital marketing, social media, branding, performance ads, reels and content production division of KADS LABS.",
}

export default function MediaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
