import { supabase, hasSupabaseCredentials } from "./supabase"
import { safeStorage } from "./storage"
import { generateId } from "./site-data"

export interface QuoteRequest {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  service: string
  budget?: string
  details: string
  status: "new" | "contacted" | "qualified" | "proposal" | "won" | "lost"
  notes: { id: string; text: string; author: string; createdAt: string }[]
  createdAt: string
  updatedAt: string
}

const DEMO_KEY = "kads_demo_quote_requests"

export const createQuoteRequest = async (quote: Omit<QuoteRequest, "id" | "status" | "notes" | "createdAt" | "updatedAt">): Promise<{ error?: string }> => {
  if (!hasSupabaseCredentials()) {
    const existing = JSON.parse(safeStorage.getItem(DEMO_KEY) || "[]") as QuoteRequest[]
    const now = new Date().toISOString()
    existing.unshift({ ...quote, id: generateId("quote"), status: "new", notes: [], createdAt: now, updatedAt: now })
    safeStorage.setItem(DEMO_KEY, JSON.stringify(existing))
    return {}
  }
  try {
    const { error } = await supabase.from("quote_requests").insert({
      name: quote.name,
      email: quote.email,
      phone: quote.phone,
      company: quote.company,
      service: quote.service,
      budget: quote.budget,
      details: quote.details
    })
    if (error) throw error
    return {}
  } catch (err) {
    return { error: String(err) }
  }
}

export const listQuoteRequests = async (): Promise<QuoteRequest[]> => {
  if (!hasSupabaseCredentials()) {
    return JSON.parse(safeStorage.getItem(DEMO_KEY) || "[]")
  }
  try {
    const { data, error } = await supabase.from("quote_requests").select("*").order("created_at", { ascending: false })
    if (error) throw error
    return (data || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      company: row.company,
      service: row.service,
      budget: row.budget,
      details: row.details,
      status: row.status,
      notes: row.notes || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }))
  } catch (err) {
    return []
  }
}

export const updateQuoteStatus = async (id: string, status: QuoteRequest["status"]) => {
  if (!hasSupabaseCredentials()) {
    const all = JSON.parse(safeStorage.getItem(DEMO_KEY) || "[]") as QuoteRequest[]
    const item = all.find(q => q.id === id)
    if (item) {
      item.status = status
      item.updatedAt = new Date().toISOString()
      safeStorage.setItem(DEMO_KEY, JSON.stringify(all))
    }
    return {}
  }
  try {
    const { error } = await supabase.from("quote_requests").update({ status, updated_at: new Date().toISOString() }).eq("id", id)
    if (error) throw error
    return {}
  } catch (err) {
    return { error: String(err) }
  }
}
