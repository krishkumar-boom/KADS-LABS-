"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useAuth } from "../components/AuthProvider"
import { useContent } from "../components/ContentProvider"
import AuthModal from "../components/AuthModal"
import { hasSupabaseCredentials } from "@/lib/supabase"
import { safeStorage } from "@/lib/storage"
import ErrorBoundary from "../components/ErrorBoundary"
import ContentEditor from "../components/admin/ContentEditor"
import JsonEditorSection from "../components/admin/JsonEditorSection"
import MediaLibrary from "../components/admin/MediaLibrary"
import SubmissionsPanel from "../components/admin/SubmissionsPanel"
import AnalyticsPanel from "../components/admin/AnalyticsPanel"
import ThemeToggle from "../components/ThemeToggle"
import LanguageToggle from "../components/LanguageToggle"
import BackupRestore from "../components/admin/BackupRestore"
import JobApplicationsPanel from "../components/admin/JobApplicationsPanel"
import QuoteRequestsPanel from "../components/admin/QuoteRequestsPanel"
import TicketsPanel from "../components/admin/TicketsPanel"
import AuditLogPanel from "../components/admin/AuditLogPanel"
import PermissionsPanel from "../components/admin/PermissionsPanel"
import EmailTemplatesPanel from "../components/admin/EmailTemplatesPanel"
import PushSettings from "../components/admin/PushSettings"
import {
  Database, Shield, Lock, LogOut, AlertCircle, FileText, Users, ImageIcon,
  Layers, Briefcase, Bookmark, MessageSquare, HelpCircle, Mail, Share2,
  Navigation, PanelBottom, Search, BarChart3, Settings, LayoutGrid,
  Download, Ticket, FileQuestion, ClipboardList, GanttChart, Bell, History
} from "lucide-react"

const ADMIN_PASSWORD_KEY = "kads_admin_password"

type AdminTab =
  | "content" | "leadership" | "team" | "services" | "divisions" | "portfolio"
  | "blogs" | "careers" | "testimonials" | "faq" | "contact" | "social" | "navigation"
  | "footer" | "seo" | "media" | "analytics" | "submissions" | "settings"
  | "backup" | "applications" | "quotes" | "tickets" | "audit" | "permissions" | "emails" | "push"

const tabs: { id: AdminTab; label: string; icon: any; section?: keyof import("@/lib/content").SiteData }[] = [
  { id: "content", label: "Content", icon: FileText },
  { id: "leadership", label: "Leadership", icon: Users, section: "leadership" },
  { id: "team", label: "Team", icon: Users, section: "team" },
  { id: "services", label: "Services", icon: Layers, section: "services" },
  { id: "divisions", label: "Divisions", icon: LayoutGrid, section: "divisions" },
  { id: "portfolio", label: "Portfolio", icon: ImageIcon, section: "portfolio" },
  { id: "blogs", label: "Blogs", icon: Bookmark, section: "blogs" },
  { id: "careers", label: "Careers", icon: Briefcase, section: "careers" },
  { id: "testimonials", label: "Testimonials", icon: MessageSquare, section: "testimonials" },
  { id: "faq", label: "FAQ", icon: HelpCircle, section: "faqs" },
  { id: "contact", label: "Contact", icon: Mail, section: "contact" },
  { id: "social", label: "Social", icon: Share2, section: "social" },
  { id: "navigation", label: "Navigation", icon: Navigation, section: "navigation" },
  { id: "footer", label: "Footer", icon: PanelBottom, section: "footer" },
  { id: "seo", label: "SEO", icon: Search, section: "seo" },
  { id: "media", label: "Media", icon: ImageIcon },
  { id: "analytics", label: "Analytics", icon: BarChart3, section: "analytics" },
  { id: "submissions", label: "Submissions", icon: Database },
  { id: "settings", label: "Settings", icon: Settings, section: "settings" },
  { id: "backup", label: "Backup", icon: Download },
  { id: "applications", label: "Applications", icon: ClipboardList },
  { id: "quotes", label: "Quotes", icon: FileQuestion },
  { id: "tickets", label: "Tickets", icon: Ticket },
  { id: "audit", label: "Audit", icon: History },
  { id: "permissions", label: "Permissions", icon: Shield },
  { id: "emails", label: "Emails", icon: Mail },
  { id: "push", label: "Push", icon: Bell }
]

function AdminPanelContent() {
  const { user, isAuthenticated, isContentManager, signOut, demoMode } = useAuth()
  const { demoMode: contentDemo } = useContent()
  const [authOpen, setAuthOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<AdminTab>("content")
  const [adminPassword, setAdminPassword] = useState("")
  const [passwordVerified, setPasswordVerified] = useState(false)
  const [passwordError, setPasswordError] = useState("")

  useEffect(() => {
    if (!isAuthenticated || !isContentManager) return
    if (demoMode && !passwordVerified) return
  }, [isAuthenticated, isContentManager, passwordVerified, demoMode])

  const verifyAdminPassword = () => {
    const expectedPassword = safeStorage.getItem(ADMIN_PASSWORD_KEY) || "kads-admin-2026"
    if (adminPassword === expectedPassword) {
      setPasswordVerified(true)
      setPasswordError("")
    } else {
      setPasswordError("Incorrect admin password")
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center section-padding">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-electric/20 flex items-center justify-center mx-auto mb-6">
            <Database className="w-8 h-8 text-electric" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Developer Control Centre</h1>
          <p className="text-white/60 mb-8">This area is restricted to authorized administrators. Please sign in to continue.</p>
          <button onClick={() => setAuthOpen(true)} className="btn-primary">Sign In to Admin Panel</button>
          <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
        </div>
      </div>
    )
  }

  if (!isContentManager) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center section-padding">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-white/60 mb-8">The email <span className="text-white">{user?.email}</span> is not authorized to access the developer control centre.</p>
          <button onClick={signOut} className="btn-outline">Sign Out</button>
        </div>
      </div>
    )
  }

  if (demoMode && !passwordVerified) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center section-padding">
        <div className="text-center max-w-md glass-card rounded-2xl p-8 glow-border">
          <div className="w-16 h-16 rounded-2xl bg-electric/20 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-electric" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Admin Verification</h1>
          <p className="text-white/60 mb-6">Demo mode requires an additional admin password. Default: <code className="text-electric-light">kads-admin-2026</code></p>
          <div className="space-y-4">
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-electric transition-colors"
              onKeyDown={(e) => e.key === "Enter" && verifyAdminPassword()}
            />
            {passwordError && <p className="text-sm text-red-400">{passwordError}</p>}
            <button onClick={verifyAdminPassword} className="w-full btn-primary">Verify & Continue</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy-950 pt-24 pb-12">
      <div className="max-w-[1600px] mx-auto section-padding">
        <div className="premium-card p-6 sm:p-8 mb-8 glow-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-electric/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-electric" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-1">KADS LABS Control Centre</h1>
                <p className="text-white/60 text-sm">Manage every website element in real-time without touching frontend code.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{user?.email}</p>
                <p className="text-xs text-electric-light">{demoMode || contentDemo ? "Demo Mode" : "Live CMS"}</p>
              </div>
              <LanguageToggle />
              <ThemeToggle />
              <button onClick={signOut} className="btn-outline px-4 py-2 text-sm"><LogOut className="w-4 h-4 mr-2" /> Sign Out</button>
            </div>
          </div>
          {(demoMode || contentDemo) && (
            <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-sm text-yellow-200">
              ⚠️ Demo Mode: Supabase is not configured. Changes are saved locally. Connect Supabase in .env.local for real-time updates across all users.
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-electric text-white shadow-lg shadow-electric/30"
                  : "glass-card text-white/70 hover:text-white hover:bg-white/10"
              }`}
              aria-pressed={activeTab === tab.id}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "content" && <ContentEditor />}
        {activeTab === "leadership" && <JsonEditorSection section="leadership" title="Leadership" description="Add or edit leadership profiles. Each profile supports name, designation, biography, photo, skills, social links, and experience." />}
        {activeTab === "team" && <JsonEditorSection section="team" title="Team Members" description="Manage the full team directory." />}
        {activeTab === "services" && <JsonEditorSection section="services" title="Services" description="Manage services across all divisions. Use icon names from the Lucide icon set." />}
        {activeTab === "divisions" && <JsonEditorSection section="divisions" title="Divisions" description="Manage KADS divisions, their colors, CTAs, and descriptions." />}
        {activeTab === "portfolio" && <JsonEditorSection section="portfolio" title="Portfolio" description="Manage the global portfolio grid shown on the homepage." />}
        {activeTab === "blogs" && <JsonEditorSection section="blogs" title="Blogs" description="Manage blog posts and insights." />}
        {activeTab === "careers" && <JsonEditorSection section="careers" title="Careers" description="Manage open positions and career listings." />}
        {activeTab === "testimonials" && <JsonEditorSection section="testimonials" title="Testimonials" description="Manage client testimonials and reviews." />}
        {activeTab === "faq" && <JsonEditorSection section="faqs" title="FAQ" description="Manage frequently asked questions." />}
        {activeTab === "contact" && <JsonEditorSection section="contact" title="Contact Details" description="Update phone, email, address, map embed, and working hours." />}
        {activeTab === "social" && <JsonEditorSection section="social" title="Social Media Links" description="Manage social media profiles and their order." />}
        {activeTab === "navigation" && <JsonEditorSection section="navigation" title="Navigation" description="Manage header navigation links and visibility." />}
        {activeTab === "footer" && <JsonEditorSection section="footer" title="Footer" description="Manage footer columns, brand description, newsletter, and legal links." />}
        {activeTab === "seo" && <JsonEditorSection section="seo" title="SEO" description="Manage SEO metadata, keywords, canonical URL, and OpenGraph settings." />}
        {activeTab === "media" && <MediaLibrary />}
        {activeTab === "analytics" && <AnalyticsPanel />}
        {activeTab === "submissions" && <SubmissionsPanel />}
        {activeTab === "settings" && <JsonEditorSection section="settings" title="Website Settings" description="Manage site name, theme, logo, favicon, maintenance mode, and notification email." />}
        {activeTab === "backup" && <BackupRestore />}
        {activeTab === "applications" && <JobApplicationsPanel />}
        {activeTab === "quotes" && <QuoteRequestsPanel />}
        {activeTab === "tickets" && <TicketsPanel />}
        {activeTab === "audit" && <AuditLogPanel />}
        {activeTab === "permissions" && <PermissionsPanel />}
        {activeTab === "emails" && <EmailTemplatesPanel />}
        {activeTab === "push" && <PushSettings />}
      </div>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  )
}

export default function AdminPanel() {
  return (
    <ErrorBoundary>
      <AdminPanelContent />
    </ErrorBoundary>
  )
}
