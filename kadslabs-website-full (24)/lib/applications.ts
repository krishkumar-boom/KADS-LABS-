import { supabase, hasSupabaseCredentials } from "./supabase"
import { safeStorage } from "./storage"
import { generateId } from "./site-data"

export interface JobApplication {
  id: string
  jobId: string
  jobTitle: string
  name: string
  email: string
  phone?: string
  resumeUrl?: string
  coverLetter?: string
  status: "new" | "contacted" | "interview" | "hired" | "rejected"
  notes: { id: string; text: string; author: string; createdAt: string }[]
  createdAt: string
  updatedAt: string
}

const DEMO_KEY = "kads_demo_job_applications"

export const createApplication = async (application: Omit<JobApplication, "id" | "status" | "notes" | "createdAt" | "updatedAt">): Promise<{ error?: string }> => {
  if (!hasSupabaseCredentials()) {
    const existing = JSON.parse(safeStorage.getItem(DEMO_KEY) || "[]") as JobApplication[]
    const now = new Date().toISOString()
    existing.unshift({ ...application, id: generateId("app"), status: "new", notes: [], createdAt: now, updatedAt: now })
    safeStorage.setItem(DEMO_KEY, JSON.stringify(existing))
    return {}
  }
  try {
    const { error } = await supabase.from("job_applications").insert({
      job_id: application.jobId,
      job_title: application.jobTitle,
      name: application.name,
      email: application.email,
      phone: application.phone,
      resume_url: application.resumeUrl,
      cover_letter: application.coverLetter
    })
    if (error) throw error
    return {}
  } catch (err) {
    return { error: String(err) }
  }
}

export const listApplications = async (): Promise<JobApplication[]> => {
  if (!hasSupabaseCredentials()) {
    return JSON.parse(safeStorage.getItem(DEMO_KEY) || "[]")
  }
  try {
    const { data, error } = await supabase.from("job_applications").select("*").order("created_at", { ascending: false })
    if (error) throw error
    return (data || []).map((row: any) => ({
      id: row.id,
      jobId: row.job_id,
      jobTitle: row.job_title,
      name: row.name,
      email: row.email,
      phone: row.phone,
      resumeUrl: row.resume_url,
      coverLetter: row.cover_letter,
      status: row.status,
      notes: row.notes || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }))
  } catch (err) {
    return []
  }
}

export const updateApplicationStatus = async (id: string, status: JobApplication["status"]) => {
  if (!hasSupabaseCredentials()) {
    const all = JSON.parse(safeStorage.getItem(DEMO_KEY) || "[]") as JobApplication[]
    const item = all.find(a => a.id === id)
    if (item) {
      item.status = status
      item.updatedAt = new Date().toISOString()
      safeStorage.setItem(DEMO_KEY, JSON.stringify(all))
    }
    return {}
  }
  try {
    const { error } = await supabase.from("job_applications").update({ status, updated_at: new Date().toISOString() }).eq("id", id)
    if (error) throw error
    return {}
  } catch (err) {
    return { error: String(err) }
  }
}
