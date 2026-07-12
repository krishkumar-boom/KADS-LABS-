import type { Metadata, Viewport } from "next"
import "./globals.css"
import { AuthProvider } from "./components/AuthProvider"
import { ContentProvider } from "./components/ContentProvider"
import { ThemeProvider } from "./components/ThemeProvider"
import { LanguageProvider } from "./components/LanguageProvider"
import PageTransition from "./components/PageTransition"

export const metadata: Metadata = {
  title: "KADS LABS | Building Smarter Solutions",
  description: "KADS LABS builds innovative software products, AI-powered solutions, websites, mobile applications, SaaS platforms, automation systems, and enterprise digital products.",
  keywords: "KADS LABS, KADS Media, KADS Technologies, AI solutions, software development, digital marketing, mobile apps, SaaS, enterprise software, Deoria, Uttar Pradesh, India",
  authors: [{ name: "KADS LABS" }],
  creator: "KADS LABS",
  publisher: "KADS LABS",
  openGraph: {
    title: "KADS LABS | Building Smarter Solutions",
    description: "Premium technology company delivering AI-first software, digital marketing, and enterprise solutions.",
    url: "https://www.kadslabs.com",
    siteName: "KADS LABS",
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "KADS LABS | Building Smarter Solutions",
    description: "Premium technology company delivering AI-first software, digital marketing, and enterprise solutions."
  },
  robots: "index, follow",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
    shortcut: "/logo.png"
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "KADS LABS",
    startupImage: "/logo.png"
  },
  alternates: {
    canonical: "https://www.kadslabs.com"
  }
}

export const viewport: Viewport = {
  themeColor: "#2563EB",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover"
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{__html: `
          (function(){
            try {
              var key = 'kads-theme';
              var stored = localStorage.getItem(key);
              var resolved = stored === 'light' ? 'light' : 'dark';
              document.documentElement.classList.add(resolved);
            } catch (e) {}
          })();
        `}} />
        <noscript>
          <style dangerouslySetInnerHTML={{__html: `
            .js-loading { display: none !important; }
            body { background: #050B18; color: #fff; font-family: system-ui, sans-serif; }
            .noscript-content { padding: 2rem; text-align: center; }
          `}} />
        </noscript>
        <meta name="apple-mobile-web-app-title" content="KADS LABS" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="apple-touch-startup-image" href="/logo.png" />
        <meta name="msapplication-TileColor" content="#2563EB" />
        <meta name="msapplication-TileImage" content="/logo.png" />
        {process.env.NEXT_PUBLIC_GA4_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID}`} />
            <script dangerouslySetInnerHTML={{__html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA4_ID}');
            `}} />
          </>
        )}
        {process.env.NEXT_PUBLIC_CLARITY_ID && (
          <script dangerouslySetInnerHTML={{__html: `
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
          `}} />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "KADS LABS",
            alternateName: "KADS LABS Private Limited",
            url: "https://www.kadslabs.com",
            logo: "https://www.kadslabs.com/logo.png",
            description: "KADS LABS builds innovative software products, AI-powered solutions, websites, mobile applications, SaaS platforms, automation systems, and enterprise digital products.",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Tarkulwa",
              addressLocality: "Deoria",
              addressRegion: "Uttar Pradesh",
              postalCode: "274408",
              addressCountry: "IN"
            },
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+91-75249-79551",
              contactType: "Founders",
              email: "founderskadslabs@gmail.com"
            },
            sameAs: [
              "https://www.facebook.com/kadslabs",
              "https://www.instagram.com/kadslabs",
              "https://www.linkedin.com/company/kadslabs",
              "https://www.youtube.com/@kadslabs",
              "https://twitter.com/kadslabs"
            ]
          })}}
        />
        <script dangerouslySetInnerHTML={{__html: `
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
      <body className="antialiased bg-navy-950 text-white min-h-screen" suppressHydrationWarning>
        <noscript>
          <div className="noscript-content">
            <h1>KADS LABS</h1>
            <p>Please enable JavaScript to view this website. If you are opening this file locally, extract the ZIP and open <strong>dist/index.html</strong> in a modern browser.</p>
          </div>
        </noscript>
        <LanguageProvider>
          <ThemeProvider>
            <AuthProvider>
              <ContentProvider>
                <PageTransition>{children}</PageTransition>
              </ContentProvider>
            </AuthProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
