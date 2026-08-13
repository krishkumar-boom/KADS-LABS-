"use client"

/**
 * Skip-to-content link — appears on first Tab press, allows keyboard users
 * to bypass navigation and jump straight to main content.
 */
export default function SkipLink() {
  return (
    <a
      href="#main-content"
      onClick={(e) => {
        // Fallback in case #main-content isn't found: focus the first heading / main landmark
        const target = document.getElementById("main-content")
        if (target) {
          e.preventDefault()
          target.setAttribute("tabindex", "-1")
          target.focus({ preventScroll: false })
          target.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }}
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[300] focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold focus:shadow-lg"
      style={{
        background: "var(--gradient-brand)",
        color: "white",
        outlineOffset: "2px"
      }}
    >
      Skip to main content
    </a>
  )
}
