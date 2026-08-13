import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Solutions — AI-Native Platforms for Enterprise",
  description: "Pre-built, production-ready solutions for Healthcare, Education, Fintech, E-commerce, Manufacturing, Logistics and the Public Sector.",
  alternates: { canonical: "/solutions" },
  openGraph: { title: "Solutions — AI-Native Platforms for Enterprise", description: "Pre-built, production-ready solutions for Healthcare, Education, Fintech, E-commerce, Manufacturing, Logistics and the Public Sector.", url: "/solutions" }
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
