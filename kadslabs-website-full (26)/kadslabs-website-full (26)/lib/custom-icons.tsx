"use client"

import { SVGProps } from "react"

/**
 * Custom brand/social icons not in lucide-react.
 * All icons accept standard SVG props and use currentColor for easy theming.
 */

export function ThreadsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2.5c-3.5 0-5.8 2-6.6 4.5C4.5 9.3 4.5 12 4.5 14c0 4 2 7.5 7.5 7.5 4 0 7.2-2.2 7.5-6-1.5 1.2-3.5 1.8-5.5 1.5-3-.5-4.5-3-4.5-6 0-3.5 2-5.5 5-5.5 2.5 0 4 1.5 4 3.5 0 1.5-.8 2.5-1.8 2.5-.7 0-1.2-.5-1.2-1.2 0-.5.3-1 .7-1.3" />
      <path d="M14.5 10c1.5 1.5 2 3.5 1 5.5-.8 1.5-2.5 2-4 1.8-2-.3-3.2-2.3-3-4.5.3-2.5 2.5-4.3 5-4 1 .2 1.8.7 2.3 1.3" />
    </svg>
  )
}

export function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.4.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1 2.9 1.2 3.1c.2.2 2 3.1 4.8 4.3 2.2.9 2.6.7 3.1.7.5 0 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.4 1.3 4.9L2 22l5.2-1.4c1.4.7 3 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3c-.9-1.3-1.4-2.9-1.4-4.6 0-4.6 3.8-8.3 8.4-8.3 2.2 0 4.4.9 6 2.4 1.6 1.6 2.5 3.7 2.5 6 0 4.6-3.7 8.4-8.3 8.4z"/>
    </svg>
  )
}

/** Crystal K logo mark (for small use) */
export function KadsMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="kads-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1E6BFF" />
          <stop offset="1" stopColor="#33B5FF" />
        </linearGradient>
      </defs>
      <path d="M20 2l16 11-6 25H10L4 13 20 2z" stroke="url(#kads-grad)" strokeWidth="2" fill="rgba(30,107,255,0.1)" />
      <path d="M20 2l6 34M20 2l-6 34M4 13h32" stroke="url(#kads-grad)" strokeWidth="1" opacity="0.6" />
    </svg>
  )
}
