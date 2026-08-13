import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Products — Platforms Built by KADS LABS",
  description: "Discover KADS LABS products: AI Studio, CloudCore, Pulse CRM, SendStack, DataHub, SecureVault and FlowKit.",
  alternates: { canonical: "/products" },
  openGraph: { title: "Products — Platforms Built by KADS LABS", description: "Discover KADS LABS products: AI Studio, CloudCore, Pulse CRM, SendStack, DataHub, SecureVault and FlowKit.", url: "/products" }
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
