import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "KADS TECHNOLOGIES | Engineering Tomorrow. Today.",
  description: "KADS TECHNOLOGIES — SaaS, AI/ML, Web, Mobile, Cloud & DevOps, APIs, and Enterprise Software division of KADS LABS.",
}

export default function TechnologiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
