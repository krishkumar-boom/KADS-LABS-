"use client"

import { ReactNode } from "react"
import { useAuth, KadsRole, roleMeetsMinimum } from "./AuthProvider"

interface RoleGateProps {
  children: ReactNode
  fallback?: ReactNode
  required?: KadsRole
  requireAny?: KadsRole[]
}

export default function RoleGate({
  children,
  fallback,
  required,
  requireAny,
}: RoleGateProps) {
  const { userRole, isAuthenticated } = useAuth()

  if (!isAuthenticated) return fallback || null

  let allowed = false
  if (requireAny && requireAny.length > 0) {
    allowed = requireAny.some(r => roleMeetsMinimum(userRole, r))
  } else if (required) {
    allowed = roleMeetsMinimum(userRole, required)
  } else {
    allowed = true
  }

  return allowed ? <>{children}</> : (fallback || null)
}
