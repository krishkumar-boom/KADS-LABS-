import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Contact KADS LABS — Let's Build the Future Together",
  description: "Get in touch with KADS LABS. Book a consultation, request a quote, or chat with our engineering team.",
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact KADS LABS — Let's Build the Future Together", description: "Get in touch with KADS LABS. Book a consultation, request a quote, or chat with our engineering team.", url: "/contact" }
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
