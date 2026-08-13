import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Client Portal | KADS LABS",
  description: "Client portal for KADS LABS — track projects, invoices, and support tickets.",
  robots: { index: false, follow: false },
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
