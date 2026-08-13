import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Services — AI, SaaS, Cloud, Mobile, Enterprise Software",
  description: "KADS LABS delivers end-to-end technology services: AI/ML, SaaS, enterprise software, cloud, mobile apps, DevOps, cybersecurity and digital transformation.",
  alternates: { canonical: "/services" },
  openGraph: { title: "Services — AI, SaaS, Cloud, Mobile, Enterprise Software", description: "KADS LABS delivers end-to-end technology services: AI/ML, SaaS, enterprise software, cloud, mobile apps, DevOps, cybersecurity and digital transformation.", url: "/services" }
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
