import type { Metadata, Viewport } from "next"
import "./globals.css"
import { AuthProvider } from "./components/AuthProvider"
import { ContentProvider } from "./components/ContentProvider"
import { ThemeProvider } from "./components/ThemeProvider"
import { LanguageProvider } from "./components/LanguageProvider"
import { ToastProvider } from "./components/Toast"
import SkipLink from "./components/SkipLink"
import VersionCheck from "./components/VersionCheck"
import CookieConsent from "./components/CookieConsent"
import ErrorLogger from "./components/ErrorLogger"
import ConfigError from "./components/ConfigError"
import PageTransition from "./components/PageTransition"
import SmoothScroll from "./components/SmoothScroll"

const SITE_URL = "https://kadslabs.com"
const SLOGAN = "Building Smarter Solutions."
const TAGLINE = "KADS LABS — Building Smarter Solutions. AI, SaaS, Apps & Cloud Infrastructure"
const TITLE = "KADS LABS | Building Smarter Solutions — AI, SaaS, Apps & Digital Marketing"
const DESCRIPTION =
  "KADS LABS — Building Smarter Solutions. AI-native platforms, enterprise SaaS, mobile apps, cloud infrastructure and digital marketing engineered for the companies defining tomorrow."
const KEYWORDS =
  "KADS LABS, Building Smarter Solutions, KADS Technologies, KADS Media, AI development company India, SaaS development, custom software, mobile app development, web development, digital marketing agency, performance advertising, enterprise software, AI solutions, Deoria, Uttar Pradesh"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · KADS LABS"
  },
  description: DESCRIPTION,
  keywords: KEYWORDS,
  authors: [{ name: "KADS LABS", url: SITE_URL }],
  creator: "KADS LABS",
  publisher: "KADS LABS",
  applicationName: "KADS LABS",
  category: "technology",
  classification: "Business & Technology",
  referrer: "strict-origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      "hi-IN": "/",
      "x-default": "/"
    }
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "KADS LABS",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_IN",
    images: [
      {
        url: "/logo-512.png",
        width: 512,
        height: 512,
        alt: "KADS LABS — Building Smarter Solutions"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    site: "@kadslabs",
    creator: "@kadslabs",
    images: ["/logo-512.png"]
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" }
    ],
    shortcut: "/favicon-32.png",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    other: [
      { rel: "mask-icon", url: "/logo-192.png", color: "#1E6BFF" }
    ]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "KADS LABS",
    startupImage: [{ url: "/apple-touch-icon.png" }]
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  verification: {
    // google: "your-google-verification-code",
    // yandex: "...",
  },
  other: {
    "msapplication-TileColor": "#05070B",
    "msapplication-TileImage": "/icon-192.png",
    "mobile-web-app-capable": "yes"
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFBFE" },
    { media: "(prefers-color-scheme: dark)", color: "#05070B" }
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  colorScheme: "dark light"
}

const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "KADS LABS",
  alternateName: "KADS LABS Private Limited",
  legalName: "KADS LABS",
  url: SITE_URL,
  logo: `${SITE_URL}/logo-512.png`,
  image: `${SITE_URL}/logo-512.png`,
  description: DESCRIPTION,
  slogan: "Building Smarter Solutions",
  foundingDate: "2024",
  email: "founderskadslabs@gmail.com",
  telephone: "+91-75249-79551",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Tarkulwa",
    addressLocality: "Deoria",
    addressRegion: "Uttar Pradesh",
    postalCode: "274408",
    addressCountry: "IN"
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+91-75249-79551",
      contactType: "customer support",
      email: "founderskadslabs@gmail.com",
      availableLanguage: ["English", "Hindi"]
    },
    {
      "@type": "ContactPoint",
      contactType: "sales",
      email: "founderskadslabs@gmail.com",
      availableLanguage: ["English", "Hindi"]
    }
  ],
  sameAs: [
    "https://kadslabs.com",
    "https://www.linkedin.com/in/kadslabs",
    "https://instagram.com/kadslabs",
    "https://facebook.com/kadslabs.ceo",
    "https://x.com/kadslabs",
    "https://www.threads.com/@kadslabs",
    "https://youtube.com/@kadslabs"
  ],
  makesOffer: [
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI Development" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "SaaS Development" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Custom Software" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Mobile App Development" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Digital Marketing" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Performance Advertising" } }
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "KADS LABS Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI Development" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "SaaS Platforms" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Enterprise Software" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Mobile Applications" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Web Applications" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Digital Marketing Campaigns" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Paid Advertising" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Branding & Design" } }
    ]
  },
  areaServed: [
    { "@type": "Country", name: "India" },
    { "@type": "Country", name: "United States" },
    { "@type": "Country", name: "United Kingdom" },
    { "@type": "Country", name: "Canada" },
    { "@type": "Country", name: "Australia" },
    "Worldwide"
  ]
}

const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "KADS LABS",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/?q={search_term_string}`,
    "query-input": "required name=search_term_string"
  }
}

const SOFTWARE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "KADS LABS — AI & Enterprise Software",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, iOS, Android, Cloud",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD"
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            try {
              var key = 'kads-theme';
              var stored = localStorage.getItem(key);
              var resolved = stored === 'light' ? 'light' : 'dark';
              document.documentElement.classList.add(resolved);
              var meta = document.querySelector('meta[name="theme-color"]');
              if (meta) meta.content = resolved === 'light' ? '#FAFBFE' : '#05070B';
            } catch (e) {}
          })();
        `}} />

        {/* Security + cache hardening */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="SAMEORIGIN" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=(), payment=(), usb=()" />
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />

        {/* Preconnect to critical origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://zruovpjzpqcqtawtnrmj.supabase.co" />
        <link rel="preconnect" href="https://identitytoolkit.googleapis.com" crossOrigin="" />
        <link rel="preconnect" href="https://securetoken.googleapis.com" crossOrigin="" />
        <link rel="preconnect" href="https://www.googleapis.com" crossOrigin="" />
        <link rel="preconnect" href="https://accounts.google.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://zruovpjzpqcqtawtnrmj.supabase.co" />
        <link rel="dns-prefetch" href="https://identitytoolkit.googleapis.com" />
        <link rel="dns-prefetch" href="https://securetoken.googleapis.com" />
        <link rel="dns-prefetch" href="https://accounts.google.com" />

        {/* Preload critical font display to reduce FOUT */}
        <link rel="preload" as="image" href="/logo-192.png" fetchPriority="high" />

        <noscript>
          <style dangerouslySetInnerHTML={{ __html: `
            .js-loading { display: none !important; }
            body { background: #05070B; color: #fff; font-family: system-ui, sans-serif; }
            .noscript-content { padding: 2rem; text-align: center; }
          `}} />
        </noscript>

        <meta name="apple-mobile-web-app-title" content="KADS LABS" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-startup-image" href="/apple-touch-icon.png" />

        {process.env.NEXT_PUBLIC_GA4_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID}`} />
            <script dangerouslySetInnerHTML={{ __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA4_ID}', { anonymize_ip: true });
            `}} />
          </>
        )}
        {process.env.NEXT_PUBLIC_CLARITY_ID && (
          <script dangerouslySetInnerHTML={{ __html: `
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
          `}} />
        )}

        {/* Structured data: Organization + WebSite + SoftwareApplication + FAQ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_SCHEMA) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_SCHEMA) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SOFTWARE_SCHEMA) }}
        />

        {/* Remove loading splash if JS fails */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            var start = Date.now();
            var check = function(){
              if (Date.now() - start > 5000) {
                var ls = document.querySelector('[class*="fixed inset-0 z-[100]"]');
                if (ls && ls.parentElement) ls.parentElement.removeChild(ls);
                return;
              }
              setTimeout(check, 300);
            };
            setTimeout(check, 300);
          })();
        `}} />
      </head>
      <body
        className="antialiased min-h-screen"
        style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
        suppressHydrationWarning
      >
        <SkipLink />
        <noscript>
          <div className="noscript-content">
            <h1>KADS LABS</h1>
            <p>Please enable JavaScript to view this website. If you are opening this file locally, extract the ZIP and open <strong>dist/index.html</strong> in a modern browser. You can also contact us directly at founderskadslabs@gmail.com or +91 75249 79551.</p>
          </div>
        </noscript>
        <LanguageProvider>
          <ThemeProvider>
            <AuthProvider>
              <ContentProvider>
                <ToastProvider>
                  <SmoothScroll>
                    <ConfigError />
                    <ErrorLogger />
                    <VersionCheck />
                    <PageTransition>{children}</PageTransition>
                    <CookieConsent />
                  </SmoothScroll>
                </ToastProvider>
              </ContentProvider>
            </AuthProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
