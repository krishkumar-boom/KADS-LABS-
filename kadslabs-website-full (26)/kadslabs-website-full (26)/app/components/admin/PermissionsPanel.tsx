"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { KadsRole } from "@/lib/supabase"
import { PermissionKey, getRolePermissions } from "@/lib/permissions"
import { Shield, RefreshCw } from "lucide-react"

const roles: KadsRole[] = ["ceo", "developer", "admin", "content_manager", "guest"]

const allPermissions: PermissionKey[] = [
  "cms:read", "cms:write", "media:read", "media:write",
  "leads:read", "leads:write", "users:read", "users:write",
  "analytics:read", "tickets:read", "tickets:write", "projects:read", "projects:write"
]

export default function PermissionsPanel() {
  const [selectedRole, setSelectedRole] = useState<KadsRole>("admin")
  const [permissions, setPermissions] = useState<PermissionKey[]>([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const data = await getRolePermissions(selectedRole)
    setPermissions(data)
    setLoading(false)
  }, [selectedRole])

  useEffect(() => {
    load()
  }, [load])

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="premium-card p-6 sm:p-8 glow-border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold">Role Permissions</h2>
          <p className="text-sm text-white/60 mt-1">Fine-grained RBAC permissions per role.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as KadsRole)}
            className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
          >
            {roles.map(r => <option key={r} value={r} className="bg-navy-900">{r}</option>)}
          </select>
          <button onClick={load} className="btn-outline px-4 py-2 text-sm"><RefreshCw className="w-4 h-4" /></button>
        </div>
      </div>

      {loading ? (
        <p className="text-white/60">Loading...</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {allPermissions.map((p) => (
            <div key={p} className={`p-3 rounded-lg border flex items-center justify-between ${permissions.includes(p) ? "border-electric bg-electric/10" : "border-white/10 bg-white/5"}`}>
              <span className="text-sm">{p}</span>
              <Shield className={`w-4 h-4 ${permissions.includes(p) ? "text-electric" : "text-white/30"}`} />
            </div>
          ))}
        </div>
      )}

      <p className="mt-4 text-sm text-white/50">
        Permissions are managed in Supabase via the <code>permissions</code> and <code>role_permissions</code> tables. Super Developer can edit them.
      </p>
    </motion.div>
  )
}
