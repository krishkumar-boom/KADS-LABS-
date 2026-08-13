import { supabase, hasSupabaseCredentials } from "./supabase"
import { safeStorage } from "./storage"

export interface ClientProject {
  id: string
  client_id: string
  client_name: string
  client_email: string
  name: string
  description?: string
  status: "planning" | "in_progress" | "review" | "deployed" | "completed" | "paused"
  progress: number
  type?: string
  deadline?: string
  budget?: number
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface ClientInvoice {
  id: string
  invoice_number: string
  project_id?: string
  client_email: string
  amount: number
  currency: string
  status: "draft" | "sent" | "viewed" | "paid" | "overdue" | "cancelled"
  due_date?: string
  paid_at?: string
  created_at: string
}

export interface ClientTicket {
  id: string
  ticket_id: string
  type: string
  subject: string
  status: string
  priority: string
  created_at: string
}

const DEMO_PROJECTS_KEY = "kads_demo_client_projects"
const DEMO_INVOICES_KEY = "kads_demo_client_invoices"

export const listClientProjects = async (userId?: string, email?: string): Promise<ClientProject[]> => {
  if (!hasSupabaseCredentials() || !userId) {
    try {
      const all = JSON.parse(safeStorage.getItem(DEMO_PROJECTS_KEY) || "[]") as ClientProject[]
      if (email) return all.filter(p => p.client_email === email)
      return all
    } catch { return [] }
  }
  try {
    let q = supabase.from("projects").select("*").order("created_at", { ascending: false })
    if (userId) q = q.eq("client_id", userId)
    if (email) q = q.eq("client_email", email)
    const { data, error } = await q
    if (error) throw error
    return (data || []) as ClientProject[]
  } catch {
    // Demo fallback
    return [{
      id: "demo-p1", client_id: userId || "demo", client_name: "Demo Client", client_email: email || "demo@example.com",
      name: "Enterprise SaaS Platform", description: "Full-stack SaaS platform with AI features",
      status: "in_progress", progress: 65, type: "Web App", deadline: "2026-12-31", budget: 250000,
      created_at: new Date(Date.now()-86400000*30).toISOString(), updated_at: new Date().toISOString()
    }]
  }
}

export const listClientInvoices = async (userId?: string, email?: string): Promise<ClientInvoice[]> => {
  if (!hasSupabaseCredentials() || !userId) {
    return [{
      id: "demo-i1", invoice_number: "INV-01001", client_email: email || "demo@example.com",
      amount: 75000, currency: "INR", status: "sent", due_date: "2026-09-15",
      created_at: new Date(Date.now()-86400000*5).toISOString()
    }]
  }
  try {
    let q = supabase.from("invoices").select("*").order("created_at", { ascending: false })
    if (userId) q = q.eq("client_id", userId)
    if (email) q = q.eq("client_email", email)
    const { data, error } = await q
    if (error) throw error
    return (data || []) as ClientInvoice[]
  } catch { return [] }
}

export const listClientTickets = async (userId?: string, email?: string): Promise<ClientTicket[]> => {
  if (!hasSupabaseCredentials() || !userId) {
    return []
  }
  try {
    let q = supabase.from("tickets").select("id,ticket_id,type,subject,status,priority,created_at").order("created_at", { ascending: false })
    if (userId) q = q.eq("user_id", userId)
    if (email) q = q.eq("email", email)
    const { data, error } = await q
    if (error) throw error
    return (data || []) as ClientTicket[]
  } catch { return [] }
}
