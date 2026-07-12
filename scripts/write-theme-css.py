#!/usr/bin/env python3
import textwrap

css = r'''
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --navy-950: #050B18;
  --navy-900: #0F172A;
  --navy-800: #1E293B;
  --navy-700: #334155;
  --navy-50: #f8fafc;
  --navy-100: #f1f5f9;
  --navy-200: #e2e8f0;
  --electric: #2563EB;
  --electric-glow: #3B82F6;
  --electric-light: #60A5FA;
  --electric-dark: #1D4ED8;
  --foreground: #ffffff;
  --foreground-muted: rgba(255, 255, 255, 0.7);
  --foreground-subtle: rgba(255, 255, 255, 0.5);
  --foreground-weak: rgba(255, 255, 255, 0.6);
  --foreground-strong: rgba(255, 255, 255, 0.8);
  --background: var(--navy-950);
  --background-elevated: var(--navy-900);
  --background-card: rgba(15, 23, 42, 0.5);
  --glass-bg: rgba(15, 23, 42, 0.7);
  --glass-border: rgba(255, 255, 255, 0.08);
  --card-border: rgba(255, 255, 255, 0.06);
  --input-bg: rgba(255, 255, 255, 0.05);
  --input-border: rgba(255, 255, 255, 0.1);
  --input-placeholder: rgba(255, 255, 255, 0.4);
}

.light {
  --foreground: #0f172a;
  --foreground-muted: rgba(15, 23, 42, 0.7);
  --foreground-subtle: rgba(15, 23, 42, 0.5);
  --foreground-weak: rgba(15, 23, 42, 0.6);
  --foreground-strong: rgba(15, 23, 42, 0.8);
  --background: #f8fafc;
  --background-elevated: #ffffff;
  --background-card: rgba(255, 255, 255, 0.7);
  --glass-bg: rgba(255, 255, 255, 0.7);
  --glass-border: rgba(15, 23, 42, 0.08);
  --card-border: rgba(15, 23, 42, 0.06);
  --input-bg: rgba(15, 23, 42, 0.05);
  --input-border: rgba(15, 23, 42, 0.1);
  --input-placeholder: rgba(15, 23, 42, 0.4);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background-color: var(--background);
  color: var(--foreground);
  overflow-x: hidden;
  line-height: 1.6;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Focus visible styles for accessibility */
:focus-visible {
  outline: 2px solid var(--electric);
  outline-offset: 2px;
}

button:focus-visible,
a:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 2px solid var(--electric);
  outline-offset: 2px;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--background);
}

::-webkit-scrollbar-thumb {
  background: var(--electric);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--electric-glow);
}

::selection {
  background: rgba(37, 99, 235, 0.3);
  color: var(--foreground);
}

.light ::selection {
  background: rgba(37, 99, 235, 0.2);
}

@layer components {
  .glass {
    background: var(--glass-bg);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--glass-border);
  }

  .glass-card {
    background: var(--background-card);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid var(--card-border);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  }

  .glow-border {
    position: relative;
  }

  .glow-border::before {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, rgba(37, 99, 235, 0.5), rgba(59, 130, 246, 0.2), transparent);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  .text-gradient {
    background: linear-gradient(135deg, #ffffff 0%, #60A5FA 50%, #2563EB 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .light .text-gradient {
    background: linear-gradient(135deg, #0f172a 0%, #2563EB 50%, #1D4ED8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .text-gradient-blue {
    background: linear-gradient(135deg, #60A5FA 0%, #2563EB 50%, #1D4ED8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .bg-gradient-radial {
    background: radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.15) 0%, transparent 50%);
  }

  .light .bg-gradient-radial {
    background: radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.08) 0%, transparent 50%);
  }

  .bg-grid {
    background-image: 
      linear-gradient(rgba(37, 99, 235, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(37, 99, 235, 0.03) 1px, transparent 1px);
    background-size: 60px 60px;
  }

  .light .bg-grid {
    background-image: 
      linear-gradient(rgba(37, 99, 235, 0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(37, 99, 235, 0.06) 1px, transparent 1px);
  }

  .btn-primary {
    @apply relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-semibold text-white transition-all duration-300 rounded-lg;
    background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
    box-shadow: 0 0 20px rgba(37, 99, 235, 0.3);
  }

  .btn-primary:hover {
    box-shadow: 0 0 40px rgba(37, 99, 235, 0.5);
    transform: translateY(-2px);
  }

  .btn-primary:active {
    transform: translateY(0);
  }

  .btn-outline {
    @apply relative inline-flex items-center justify-center px-6 py-3 font-semibold transition-all duration-300 border rounded-lg;
    border-color: var(--input-border);
    background: var(--input-bg);
    color: var(--foreground);
  }

  .btn-outline:hover {
    border-color: rgba(37, 99, 235, 0.6);
    background: rgba(37, 99, 235, 0.1);
  }

  .light .btn-outline:hover {
    background: rgba(37, 99, 235, 0.08);
  }

  .section-padding {
    @apply px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-20;
  }

  .section-heading {
    @apply text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight;
    color: var(--foreground);
  }

  .nav-link {
    @apply relative text-sm font-medium transition-colors duration-300;
    color: var(--foreground-muted);
  }

  .nav-link:hover {
    color: var(--foreground);
  }

  .nav-link::after {
    content: '';
    @apply absolute -bottom-1 left-0 h-0.5 w-0 bg-electric transition-all duration-300 rounded-full;
  }

  .nav-link:hover::after,
  .nav-link.active::after {
    @apply w-full;
  }

  .nav-link.active {
    color: var(--foreground);
  }

  .premium-card {
    @apply glass-card rounded-2xl transition-all duration-300;
  }

  .premium-card:hover {
    @apply border-electric/30 shadow-glow;
    transform: translateY(-4px);
  }
}

@layer utilities {
  .animation-delay-2000 {
    animation-delay: 2s;
  }

  .animation-delay-4000 {
    animation-delay: 4s;
  }

  .perspective-1000 {
    perspective: 1000px;
  }

  .text-balance {
    text-wrap: balance;
  }
}

/* Light mode overrides for Tailwind utility classes used throughout the app */
.light .text-white,
.light [class*="text-white "] { color: var(--foreground) !important; }
.light .text-white\/80 { color: var(--foreground-strong) !important; }
.light .text-white\/70 { color: var(--foreground-muted) !important; }
.light .text-white\/60 { color: var(--foreground-weak) !important; }
.light .text-white\/50 { color: var(--foreground-subtle) !important; }
.light .text-white\/40 { color: rgba(15, 23, 42, 0.4) !important; }
.light .text-white\/30 { color: rgba(15, 23, 42, 0.3) !important; }
.light .text-white\/20 { color: rgba(15, 23, 42, 0.2) !important; }
.light .text-white\/10 { color: rgba(15, 23, 42, 0.1) !important; }

.light .bg-navy-950 { background-color: var(--background) !important; }
.light .bg-navy-900 { background-color: var(--background-elevated) !important; }
.light .bg-navy-800 { background-color: var(--navy-100) !important; }
.light .bg-navy-700 { background-color: var(--navy-200) !important; }
.light [class*="bg-navy-950/80"] { background-color: rgba(248, 250, 252, 0.8) !important; }
.light [class*="bg-navy-950/90"] { background-color: rgba(248, 250, 252, 0.9) !important; }

.light .bg-white { background-color: var(--foreground) !important; }
.light .bg-white\/5 { background-color: var(--input-bg) !important; }
.light .bg-white\/10 { background-color: rgba(15, 23, 42, 0.1) !important; }
.light .bg-white\/20 { background-color: rgba(15, 23, 42, 0.2) !important; }

.light .border-white { border-color: var(--foreground) !important; }
.light .border-white\/5 { border-color: rgba(15, 23, 42, 0.05) !important; }
.light .border-white\/10 { border-color: var(--input-border) !important; }
.light .border-white\/20 { border-color: rgba(15, 23, 42, 0.2) !important; }
.light .border-white\/30 { border-color: rgba(15, 23, 42, 0.3) !important; }
.light .border-white\/40 { border-color: rgba(15, 23, 42, 0.4) !important; }

.light .from-navy-950 { --tw-gradient-from: var(--background) var(--tw-gradient-from-position); --tw-gradient-to: rgba(248, 250, 252, 0) var(--tw-gradient-to-position); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
.light .via-navy-950 { --tw-gradient-via: var(--background) var(--tw-gradient-via-position); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-via), var(--tw-gradient-to); }
.light .to-navy-900 { --tw-gradient-to: var(--background-elevated) var(--tw-gradient-to-position); }
.light .to-navy-950 { --tw-gradient-to: var(--background) var(--tw-gradient-to-position); }

.light .hover\:bg-white\/5:hover { background-color: rgba(15, 23, 42, 0.05) !important; }
.light .hover\:bg-white\/10:hover { background-color: rgba(15, 23, 42, 0.1) !important; }
.light .hover\:text-white:hover { color: var(--foreground) !important; }
.light .hover\:text-white\/70:hover { color: var(--foreground-muted) !important; }

.light .placeholder\:text-white\/40::placeholder { color: var(--input-placeholder) !important; }

.light .shadow-electric\/5 { box-shadow: 0 0 30px rgba(37, 99, 235, 0.08) !important; }
.light .shadow-electric\/10 { box-shadow: 0 0 30px rgba(37, 99, 235, 0.15) !important; }
.light .shadow-electric\/20 { box-shadow: 0 0 30px rgba(37, 99, 235, 0.25) !important; }

/* Ensure inputs and textareas in light mode use dark text */
.light input,
.light textarea,
.light select {
  color: var(--foreground);
  background-color: var(--input-bg);
  border-color: var(--input-border);
}

.light input::placeholder,
.light textarea::placeholder {
  color: var(--input-placeholder);
}

.light input:focus,
.light textarea:focus,
.light select:focus {
  border-color: var(--electric);
}

.light code,
.light pre {
  background-color: var(--navy-100);
  color: var(--foreground);
}

/* Make sure svg and icon colors inherit properly in light mode */
.light svg {
  color: inherit;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
'''.strip() + '\n'

with open('/home/user/kadslabs-website/app/globals.css', 'w') as f:
    f.write(css)

print('globals.css written')
