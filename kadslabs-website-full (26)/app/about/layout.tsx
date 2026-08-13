import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "About KADS LABS — Building Smarter Solutions",
  description: "KADS LABS is an India-based enterprise technology company building AI-native software, SaaS platforms, cloud infrastructure and digital experiences for global clients.",
  alternates: { canonical: "/about" },
  openGraph: { title: "About KADS LABS — Building Smarter Solutions", description: "KADS LABS is an India-based enterprise technology company building AI-native software, SaaS platforms, cloud infrastructure and digital experiences for global clients.", url: "/about" }
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
