import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Industries — Enterprise Expertise Across Sectors",
  description: "KADS LABS serves Healthcare, Education, Fintech, E-commerce, Manufacturing, Logistics, Real Estate, Aviation, Media, Telecom and SaaS.",
  alternates: { canonical: "/industries" },
  openGraph: { title: "Industries — Enterprise Expertise Across Sectors", description: "KADS LABS serves Healthcare, Education, Fintech, E-commerce, Manufacturing, Logistics, Real Estate, Aviation, Media, Telecom and SaaS.", url: "/industries" }
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
