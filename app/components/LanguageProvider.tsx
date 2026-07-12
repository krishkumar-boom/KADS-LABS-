"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

export type Language = "en" | "hi"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  t: (key: string, fallback?: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const STORAGE_KEY = "kads-language"

function getInitialLanguage(): Language {
  if (typeof window === "undefined") return "en"
  const stored = localStorage.getItem(STORAGE_KEY) as Language | null
  if (stored === "en" || stored === "hi") return stored
  const browser = navigator.language?.toLowerCase()
  if (browser?.startsWith("hi")) return "hi"
  return "en"
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    document.documentElement.setAttribute("lang", language)
  }, [language])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.setAttribute("lang", lang)
  }

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en")
  }

  const t = (key: string, fallback?: string): string => {
    const value = translations[language]?.[key]
    return value || fallback || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    // SSR / static export fallback
    return {
      language: "en" as Language,
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: (key: string, fallback?: string) => fallback || key
    }
  }
  return context
}

export const translations: Record<Language, Record<string, string>> = {
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.divisions": "Divisions",
    "nav.portfolio": "Portfolio",
    "nav.services": "Services",
    "nav.insights": "Insights",
    "nav.careers": "Careers",
    "nav.contact": "Contact",
    "nav.profile": "Profile",
    "nav.client": "Client",
    "nav.admin": "Admin",
    "nav.crm": "CRM",
    "nav.super": "Super",
    "nav.signIn": "Sign In",
    "nav.signOut": "Sign Out",
    "hero.subtitle": "Enterprise Technology Partner",
    "hero.ctaPrimary": "Explore Divisions",
    "hero.ctaSecondary": "Contact Us",
    "hero.badge1": "AI-First Development",
    "hero.badge2": "Enterprise Architecture",
    "hero.badge3": "Global Delivery",
    "hero.scroll": "Scroll",
    "about.title": "We Engineer the Future",
    "about.mission": "Mission",
    "about.vision": "Vision",
    "about.stats.clients": "Clients Served",
    "about.stats.projects": "Projects Delivered",
    "about.stats.team": "Team Members",
    "about.stats.years": "Years Experience",
    "divisions.media.title": "KADS MEDIA",
    "divisions.media.subtitle": "Division 01",
    "divisions.tech.title": "KADS TECHNOLOGIES",
    "divisions.tech.subtitle": "Division 02",
    "divisions.media.cta": "Grow Your Brand With KADS MEDIA",
    "divisions.tech.cta": "Start Your Technology Project",
    "portfolio.title": "Our Work",
    "portfolio.subtitle": "Selected projects across technology and marketing",
    "services.title": "Services",
    "services.subtitle": "End-to-end solutions for every business need",
    "blogs.title": "Insights",
    "blogs.subtitle": "Latest thinking from the KADS team",
    "careers.title": "Join KADS LABS",
    "careers.subtitle": "Build your career with a team that moves fast",
    "careers.apply": "Apply Now",
    "faq.title": "Frequently Asked Questions",
    "contact.title": "Let's Build Something Great",
    "contact.subtitle": "Ready to transform your business? Get in touch with our team.",
    "contact.name": "Name",
    "contact.email": "Email",
    "contact.phone": "Phone",
    "contact.company": "Company",
    "contact.service": "Service",
    "contact.message": "Message",
    "contact.submit": "Send Message",
    "contact.success": "Thank you! We will contact you soon.",
    "footer.newsletter": "Stay updated with our latest insights and projects.",
    "footer.subscribe": "Subscribe",
    "footer.subscribed": "Thank you for subscribing!",
    "footer.quickLinks": "Quick Links",
    "footer.divisions": "Divisions",
    "footer.services": "Services",
    "footer.contact": "Contact",
    "language.en": "English",
    "language.hi": "हिंदी",
    "language.switch": "Switch to Hindi",
    "theme.dark": "Dark",
    "theme.light": "Light"
  },
  hi: {
    "nav.home": "होम",
    "nav.about": "परिचय",
    "nav.divisions": "विभाग",
    "nav.portfolio": "पोर्टफोलियो",
    "nav.services": "सेवाएं",
    "nav.insights": "लेख",
    "nav.careers": "करियर",
    "nav.contact": "संपर्क",
    "nav.profile": "प्रोफाइल",
    "nav.client": "क्लाइंट",
    "nav.admin": "एडमिन",
    "nav.crm": "सीआरएम",
    "nav.super": "सुपर",
    "nav.signIn": "साइन इन",
    "nav.signOut": "साइन आउट",
    "hero.subtitle": "एंटरप्राइज़ टेक्नोलॉजी पार्टनर",
    "hero.ctaPrimary": "विभाग देखें",
    "hero.ctaSecondary": "संपर्क करें",
    "hero.badge1": "AI-प्रथम विकास",
    "hero.badge2": "एंटरप्राइज़ आर्किटेक्चर",
    "hero.badge3": "वैश्विक डिलीवरी",
    "hero.scroll": "नीचे स्क्रॉल करें",
    "about.title": "हम भविष्य का निर्माण करते हैं",
    "about.mission": "लक्ष्य",
    "about.vision": "दृष्टि",
    "about.stats.clients": "संतुष्ट ग्राहक",
    "about.stats.projects": "पूर्ण प्रोजेक्ट्स",
    "about.stats.team": "टीम सदस्य",
    "about.stats.years": "वर्षों का अनुभव",
    "divisions.media.title": "KADS मीडिया",
    "divisions.media.subtitle": "विभाग ०१",
    "divisions.tech.title": "KADS टेक्नोलॉजीज",
    "divisions.tech.subtitle": "विभाग ०२",
    "divisions.media.cta": "KADS मीडिया से ब्रांड बढ़ाएं",
    "divisions.tech.cta": "टेक्नोलॉजी प्रोजेक्ट शुरू करें",
    "portfolio.title": "हमारा काम",
    "portfolio.subtitle": "टेक्नोलॉजी और मार्केटिंग में चुनिंदा प्रोजेक्ट्स",
    "services.title": "सेवाएं",
    "services.subtitle": "हर व्यवसायिक जरूरत के लिए एंड-टू-एंड समाधान",
    "blogs.title": "लेख",
    "blogs.subtitle": "KADS टीम की नवीनतम सोच",
    "careers.title": "KADS LABS से जुड़ें",
    "careers.subtitle": "उस टीम के साथ करियर बनाएं जो तेजी से आगे बढ़ती है",
    "careers.apply": "आवेदन करें",
    "faq.title": "अक्सर पूछे जाने वाले प्रश्न",
    "contact.title": "कुछ बेहतर बनाएं",
    "contact.subtitle": "अपने व्यवसाय को बदलने के लिए तैयार हैं? हमारी टीम से संपर्क करें।",
    "contact.name": "नाम",
    "contact.email": "ईमेल",
    "contact.phone": "फोन",
    "contact.company": "कंपनी",
    "contact.service": "सेवा",
    "contact.message": "संदेश",
    "contact.submit": "संदेश भेजें",
    "contact.success": "धन्यवाद! हम जल्द ही आपसे संपर्क करेंगे।",
    "footer.newsletter": "नवीनतम लेख और प्रोजेक्ट्स के लिए अपडेट रहें।",
    "footer.subscribe": "सब्सक्राइब",
    "footer.subscribed": "सब्सक्राइब करने के लिए धन्यवाद!",
    "footer.quickLinks": "त्वरित लिंक",
    "footer.divisions": "विभाग",
    "footer.services": "सेवाएं",
    "footer.contact": "संपर्क",
    "language.en": "English",
    "language.hi": "हिंदी",
    "language.switch": "English में बदलें",
    "theme.dark": "डार्क",
    "theme.light": "लाइट"
  }
}
