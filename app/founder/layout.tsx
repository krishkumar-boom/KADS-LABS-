import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Founder Dashboard — KADS LABS",
  description: "Founder control center — tickets, projects, clients, invoices.",
  robots: { index: false, follow: false }
}

export default function FounderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
