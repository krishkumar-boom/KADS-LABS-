import { supabase, hasSupabaseCredentials } from "./supabase"
import { safeStorage } from "./storage"
import { ContactSubmission, Note, generateId } from "./site-data"
import { sendTemplatedEmail } from "./email"

const DEMO_SUBMISSIONS_KEY = "kads_contact_submissions"
const DEMO_NOTIFICATIONS_KEY = "kads_notifications"

export type LeadStatus = ContactSubmission["status"]

export const LEAD_STATUSES: { value: LeadStatus; label: string; color: string }[] = [
  { value: "new", label: "New", color: "bg-blue-500" },
  { value: "contacted", label: "Contacted", color: "bg-yellow-500" },
  { value: "qualified", label: "Qualified", color: "bg-purple-500" },
  { value: "proposal", label: "Proposal", color: "bg-orange-500" },
  { value: "won", label: "Won", color: "bg-green-500" },
  { value: "lost", label: "Lost", color: "bg-red-500" }
]

export const createLead = async (submission: Omit<ContactSubmission, "id" | "notes" | "status" | "source" | "createdAt" | "updatedAt">): Promise<{ data?: ContactSubmission; error?: string }> => {
  const lead: ContactSubmission = {
    ...submission,
    id: generateId("lead"),
    status: "new",
    source: "website",
    notes: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  if (!hasSupabaseCredentials()) {
    const existing = JSON.parse(safeStorage.getItem(DEMO_SUBMISSIONS_KEY) || "[]") as ContactSubmission[]
    existing.unshift(lead)
    safeStorage.setItem(DEMO_SUBMISSIONS_KEY, JSON.stringify(existing))
    await notifyFounderDashboard(lead)
    return { data: lead }
  }

  try {
    const { data, error } = await supabase
      .from("contact_submissions")
      .insert([lead])
      .select()
      .single()
    if (error) throw error
    await notifyFounderDashboard(lead)
    return { data: data as ContactSubmission }
  } catch (err) {
    console.error("createLead failed:", err)
    return { error: String(err) }
  }
}

export const listLeads = async (options?: { page?: number; limit?: number; status?: LeadStatus; search?: string }): Promise<{ data: ContactSubmission[]; count?: number }> => {
  const page = options?.page || 1
  const limit = options?.limit || 20

  if (!hasSupabaseCredentials()) {
    let all = JSON.parse(safeStorage.getItem(DEMO_SUBMISSIONS_KEY) || "[]") as ContactSubmission[]
    if (options?.status) all = all.filter(l => l.status === options.status)
    if (options?.search) {
      const q = options.search.toLowerCase()
      all = all.filter(l =>
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.message.toLowerCase().includes(q)
      )
    }
    const start = (page - 1) * limit
    return { data: all.slice(start, start + limit), count: all.length }
  }

  try {
    let query = supabase.from("contact_submissions").select("*, count", { count: "exact" })
    if (options?.status) query = query.eq("status", options.status)
    if (options?.search) {
      query = query.or(`name.ilike.%${options.search}%,email.ilike.%${options.search}%,message.ilike.%${options.search}%`)
    }
    const { data, error, count } = await query.order("created_at", { ascending: false }).range((page - 1) * limit, page * limit - 1)
    if (error) throw error
    return { data: (data as ContactSubmission[]) || [], count: count || 0 }
  } catch (err) {
    console.error("listLeads failed:", err)
    return { data: [] }
  }
}

export const updateLeadStatus = async (leadId: string, status: LeadStatus): Promise<{ error?: string }> => {
  if (!hasSupabaseCredentials()) {
    const all = JSON.parse(safeStorage.getItem(DEMO_SUBMISSIONS_KEY) || "[]") as ContactSubmission[]
    const lead = all.find(l => l.id === leadId)
    if (lead) {
      lead.status = status
      lead.updatedAt = new Date().toISOString()
      safeStorage.setItem(DEMO_SUBMISSIONS_KEY, JSON.stringify(all))
    }
    return {}
  }
  try {
    const { error } = await supabase.from("contact_submissions").update({ status, updated_at: new Date().toISOString() }).eq("id", leadId)
    if (error) throw error
    return {}
  } catch (err) {
    console.error("updateLeadStatus failed:", err)
    return { error: String(err) }
  }
}

export const addLeadNote = async (leadId: string, note: Omit<Note, "id" | "createdAt">): Promise<{ error?: string }> => {
  const fullNote: Note = { ...note, id: generateId("note"), createdAt: new Date().toISOString() }
  if (!hasSupabaseCredentials()) {
    const all = JSON.parse(safeStorage.getItem(DEMO_SUBMISSIONS_KEY) || "[]") as ContactSubmission[]
    const lead = all.find(l => l.id === leadId)
    if (lead) {
      lead.notes = lead.notes || []
      lead.notes.unshift(fullNote)
      lead.updatedAt = new Date().toISOString()
      safeStorage.setItem(DEMO_SUBMISSIONS_KEY, JSON.stringify(all))
    }
    return {}
  }
  try {
    const { data: lead, error: fetchError } = await supabase.from("contact_submissions").select("notes").eq("id", leadId).single()
    if (fetchError) throw fetchError
    const notes = (lead?.notes as Note[]) || []
    notes.unshift(fullNote)
    const { error } = await supabase.from("contact_submissions").update({ notes, updated_at: new Date().toISOString() }).eq("id", leadId)
    if (error) throw error
    return {}
  } catch (err) {
    console.error("addLeadNote failed:", err)
    return { error: String(err) }
  }
}

export const notifyFounderDashboard = async (lead: ContactSubmission): Promise<void> => {
  if (!hasSupabaseCredentials()) {
    const notifications = JSON.parse(safeStorage.getItem(DEMO_NOTIFICATIONS_KEY) || "[]") as any[]
    notifications.unshift({
      id: generateId("notif"),
      type: "new_lead",
      title: `New lead from ${lead.name}`,
      message: lead.message,
      read: false,
      createdAt: new Date().toISOString()
    })
    safeStorage.setItem(DEMO_NOTIFICATIONS_KEY, JSON.stringify(notifications.slice(0, 100)))
    return
  }
  try {
    await supabase.from("notifications").insert({
      type: "new_lead",
      title: `New lead from ${lead.name}`,
      message: lead.message,
      lead_id: lead.id,
      read: false
    })
  } catch (err) {
    console.error("notifyFounderDashboard failed:", err)
  }
}

export const listNotifications = async (): Promise<any[]> => {
  if (!hasSupabaseCredentials()) {
    return JSON.parse(safeStorage.getItem(DEMO_NOTIFICATIONS_KEY) || "[]")
  }
  try {
    const { data, error } = await supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(50)
    if (error) throw error
    return data || []
  } catch (err) {
    console.error("listNotifications failed:", err)
    return []
  }
}

export const markNotificationRead = async (id: string): Promise<void> => {
  if (!hasSupabaseCredentials()) {
    const notifications = JSON.parse(safeStorage.getItem(DEMO_NOTIFICATIONS_KEY) || "[]") as any[]
    const n = notifications.find(x => x.id === id)
    if (n) n.read = true
    safeStorage.setItem(DEMO_NOTIFICATIONS_KEY, JSON.stringify(notifications))
    return
  }
  try {
    await supabase.from("notifications").update({ read: true }).eq("id", id)
  } catch (err) {
    console.error("markNotificationRead failed:", err)
  }
}

export const sendConfirmationEmail = async (lead: ContactSubmission): Promise<{ error?: string }> => {
  return sendTemplatedEmail("contact_confirmation", lead.email, {
    name: lead.name,
    service: lead.service || "",
    message: lead.message
  })
}
