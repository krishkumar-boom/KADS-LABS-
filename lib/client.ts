import { supabase, hasSupabaseCredentials } from "./supabase"
import { safeStorage } from "./storage"
import { generateId } from "./site-data"

export interface ClientProject {
  id: string
  userId: string
  email: string
  title: string
  description?: string
  status: "planning" | "in_progress" | "review" | "completed" | "on_hold"
  progress: number
  budget?: string
  startDate?: string
  dueDate?: string
  documents: { name: string; url: string }[]
  createdAt: string
  updatedAt: string
}

const DEMO_KEY = "kads_demo_client_projects"

export const createProject = async (project: Omit<ClientProject, "id" | "createdAt" | "updatedAt">): Promise<{ error?: string }> => {
  if (!hasSupabaseCredentials()) {
    const existing = JSON.parse(safeStorage.getItem(DEMO_KEY) || "[]") as ClientProject[]
    const now = new Date().toISOString()
    existing.unshift({ ...project, id: generateId("project"), createdAt: now, updatedAt: now })
    safeStorage.setItem(DEMO_KEY, JSON.stringify(existing))
    return {}
  }
  try {
    const { error } = await supabase.from("client_projects").insert({
      user_id: project.userId,
      email: project.email,
      title: project.title,
      description: project.description,
      status: project.status,
      progress: project.progress,
      budget: project.budget,
      start_date: project.startDate,
      due_date: project.dueDate,
      documents: project.documents
    })
    if (error) throw error
    return {}
  } catch (err) {
    return { error: String(err) }
  }
}

export const listProjects = async (userId?: string): Promise<ClientProject[]> => {
  if (!hasSupabaseCredentials()) {
    const all = JSON.parse(safeStorage.getItem(DEMO_KEY) || "[]") as ClientProject[]
    return userId ? all.filter(p => p.userId === userId) : all
  }
  try {
    let query = supabase.from("client_projects").select("*").order("created_at", { ascending: false })
    if (userId) query = query.eq("user_id", userId)
    const { data, error } = await query
    if (error) throw error
    return (data || []).map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      email: row.email,
      title: row.title,
      description: row.description,
      status: row.status,
      progress: row.progress,
      budget: row.budget,
      startDate: row.start_date,
      dueDate: row.due_date,
      documents: row.documents || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }))
  } catch (err) {
    return []
  }
}

export const updateProject = async (id: string, updates: Partial<ClientProject>) => {
  if (!hasSupabaseCredentials()) {
    const all = JSON.parse(safeStorage.getItem(DEMO_KEY) || "[]") as ClientProject[]
    const item = all.find(p => p.id === id)
    if (item) {
      Object.assign(item, updates, { updatedAt: new Date().toISOString() })
      safeStorage.setItem(DEMO_KEY, JSON.stringify(all))
    }
    return {}
  }
  try {
    const payload: any = { updated_at: new Date().toISOString() }
    if (updates.title !== undefined) payload.title = updates.title
    if (updates.description !== undefined) payload.description = updates.description
    if (updates.status !== undefined) payload.status = updates.status
    if (updates.progress !== undefined) payload.progress = updates.progress
    if (updates.budget !== undefined) payload.budget = updates.budget
    if (updates.startDate !== undefined) payload.start_date = updates.startDate
    if (updates.dueDate !== undefined) payload.due_date = updates.dueDate
    if (updates.documents !== undefined) payload.documents = updates.documents
    const { error } = await supabase.from("client_projects").update(payload).eq("id", id)
    if (error) throw error
    return {}
  } catch (err) {
    return { error: String(err) }
  }
}
