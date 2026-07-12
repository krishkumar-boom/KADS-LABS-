"use client"

import { ReactNode } from "react"
import { useAuth } from "./AuthProvider"
import { KadsRole, roleHasAccess } from "@/lib/supabase"

interface RoleGateProps {
  children: ReactNode
  fallback?: ReactNode
  required?: KadsRole
  requireAny?: KadsRole[]
  requireSuper?: boolean
}

export default function RoleGate({
  children,
  fallback,
  required,
  requireAny,
  requireSuper
}: RoleGateProps) {
  const { userRole, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return fallback || null
  }

  let allowed = false
  if (requireSuper) {
    allowed = userRole === "ceo"
  } else if (requireAny && requireAny.length > 0) {
    allowed = requireAny.some(role => roleHasAccess(userRole || "user", role))
  } else if (required) {
    allowed = roleHasAccess(userRole || "user", required)
  } else {
    allowed = true
  }

  return allowed ? <>{children}</> : (fallback || null)
}
