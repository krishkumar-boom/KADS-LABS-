import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Developer Panel — KADS LABS",
  description: "Developer task management and deployments.",
  robots: { index: false, follow: false }
}

export default function DeveloperLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
