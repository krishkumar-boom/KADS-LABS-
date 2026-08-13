"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { UserPlus, Copy, CheckCircle2, Mail, Send } from "lucide-react"
import { createInvitation } from "@/lib/invitations"
import { useAuth } from "@/app/components/AuthProvider"
import type { InviteRole } from "@/lib/invitations"

export default function InviteUserPanel() {
  const { user, profile } = useAuth()
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<InviteRole>("developer")
  const [generatedUrl, setGeneratedUrl] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(""); setCopied(false)
    if (!email) { setError("Email required"); return }
    setBusy(true)
    const res = await createInvitation(email, role, { id: profile?.id, name: user?.displayName || user?.full_name || "Founder", email: user?.email || undefined })
    setBusy(false)
    if (res.error) { setError(res.error); return }
    setGeneratedUrl(res.inviteUrl || "")
    setEmail("")
  }

  const copy = async () => {
    if (!generatedUrl) return
    try { await navigator.clipboard.writeText(generatedUrl); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch {}
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
    >
      <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
        <UserPlus className="w-4 h-4" style={{ color: "var(--brand-electric)" }} /> Invite Team Member
      </h3>
      <form onSubmit={submit} className="grid sm:grid-cols-[1fr_auto_auto] gap-2 mb-3">
        <input
          type="email"
          placeholder="teammate@company.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
        />
        <select value={role} onChange={e => setRole(e.target.value as InviteRole)}
          className="px-3 py-2 rounded-lg text-sm"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-primary)" }}>
          <option value="developer">Developer</option>
          <option value="hr">HR</option>
          <option value="admin">Admin</option>
          <option value="director">Director</option>
          <option value="client">Client</option>
        </select>
        <button type="submit" disabled={busy} className="btn-primary flex items-center gap-2 text-sm whitespace-nowrap">
          <Send className="w-4 h-4"/> {busy ? "..." : "Generate Link"}
        </button>
      </form>
      {error && <p className="text-xs text-red-400 mb-2">{error}</p>}
      {generatedUrl && (
        <div className="p-3 rounded-xl flex items-center gap-2"
             style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)" }}>
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0"/>
          <code className="text-xs flex-1 truncate" style={{ color: "#A7F3D0" }}>{generatedUrl}</code>
          <button onClick={copy} className="p-1.5 rounded-md hover:bg-white/10" title="Copy invite link">
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400"/> : <Copy className="w-4 h-4" style={{ color: "var(--text-muted)" }}/>}
          </button>
          <a href={`mailto:?subject=You're invited to KADS LABS&body=Accept your invite: ${encodeURIComponent(generatedUrl)}`}
             className="p-1.5 rounded-md hover:bg-white/10" title="Email invite">
            <Mail className="w-4 h-4" style={{ color: "var(--text-muted)" }}/>
          </a>
        </div>
      )}
      <p className="text-[11px] mt-3" style={{ color: "var(--text-subtle)" }}>
        Invitations expire in 7 days. Users sign up via the link and are auto-assigned the role you selected.
      </p>
    </motion.div>
  )
}
