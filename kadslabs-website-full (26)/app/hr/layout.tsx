import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "HR Dashboard | KADS LABS",
  description: "HR dashboard for KADS LABS — manage applications, candidates, and hiring.",
  robots: { index: false, follow: false },
}

export default function HRLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
