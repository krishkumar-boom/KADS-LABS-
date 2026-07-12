import { supabase, hasSupabaseCredentials } from "./supabase"
import { safeStorage } from "./storage"
import { generateId } from "./site-data"

export interface TicketReply {
  id: string
  text: string
  author: string
  createdAt: string
}

export interface Ticket {
  id: string
  userId?: string
  email: string
  subject: string
  message: string
  status: "open" | "in_progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high"
  replies: TicketReply[]
  createdAt: string
  updatedAt: string
}

const DEMO_KEY = "kads_demo_tickets"

export const createTicket = async (ticket: Omit<Ticket, "id" | "status" | "priority" | "replies" | "createdAt" | "updatedAt"> & { priority?: Ticket["priority"] }): Promise<{ error?: string }> => {
  if (!hasSupabaseCredentials()) {
    const existing = JSON.parse(safeStorage.getItem(DEMO_KEY) || "[]") as Ticket[]
    const now = new Date().toISOString()
    existing.unshift({ ...ticket, id: generateId("ticket"), status: "open", priority: ticket.priority || "medium", replies: [], createdAt: now, updatedAt: now })
    safeStorage.setItem(DEMO_KEY, JSON.stringify(existing))
    return {}
  }
  try {
    const { error } = await supabase.from("tickets").insert({
      user_id: ticket.userId,
      email: ticket.email,
      subject: ticket.subject,
      message: ticket.message,
      priority: ticket.priority || "medium"
    })
    if (error) throw error
    return {}
  } catch (err) {
    return { error: String(err) }
  }
}

export const listTickets = async (userId?: string): Promise<Ticket[]> => {
  if (!hasSupabaseCredentials()) {
    const all = JSON.parse(safeStorage.getItem(DEMO_KEY) || "[]") as Ticket[]
    return userId ? all.filter(t => t.userId === userId) : all
  }
  try {
    let query = supabase.from("tickets").select("*").order("created_at", { ascending: false })
    if (userId) query = query.eq("user_id", userId)
    const { data, error } = await query
    if (error) throw error
    return (data || []).map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      email: row.email,
      subject: row.subject,
      message: row.message,
      status: row.status,
      priority: row.priority,
      replies: row.replies || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }))
  } catch (err) {
    return []
  }
}

export const replyToTicket = async (id: string, text: string, author: string) => {
  const reply: TicketReply = { id: generateId("reply"), text, author, createdAt: new Date().toISOString() }
  if (!hasSupabaseCredentials()) {
    const all = JSON.parse(safeStorage.getItem(DEMO_KEY) || "[]") as Ticket[]
    const item = all.find(t => t.id === id)
    if (item) {
      item.replies = item.replies || []
      item.replies.unshift(reply)
      item.updatedAt = new Date().toISOString()
      safeStorage.setItem(DEMO_KEY, JSON.stringify(all))
    }
    return {}
  }
  try {
    const { data: ticket, error: fetchError } = await supabase.from("tickets").select("replies").eq("id", id).single()
    if (fetchError) throw fetchError
    const replies = (ticket?.replies as TicketReply[]) || []
    replies.unshift(reply)
    const { error } = await supabase.from("tickets").update({ replies, updated_at: new Date().toISOString() }).eq("id", id)
    if (error) throw error
    return {}
  } catch (err) {
    return { error: String(err) }
  }
}

export const updateTicketStatus = async (id: string, status: Ticket["status"]) => {
  if (!hasSupabaseCredentials()) {
    const all = JSON.parse(safeStorage.getItem(DEMO_KEY) || "[]") as Ticket[]
    const item = all.find(t => t.id === id)
    if (item) {
      item.status = status
      item.updatedAt = new Date().toISOString()
      safeStorage.setItem(DEMO_KEY, JSON.stringify(all))
    }
    return {}
  }
  try {
    const { error } = await supabase.from("tickets").update({ status, updated_at: new Date().toISOString() }).eq("id", id)
    if (error) throw error
    return {}
  } catch (err) {
    return { error: String(err) }
  }
}
