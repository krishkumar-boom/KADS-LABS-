import { supabase, hasSupabaseCredentials } from "./supabase"
import { safeStorage } from "./storage"

export interface EmailTemplate {
  id: string
  key: string
  subject: string
  body: string
  fromAddress: string
  isActive: boolean
}

const DEMO_TEMPLATES_KEY = "kads_demo_email_templates"

export const getEmailTemplates = async (): Promise<EmailTemplate[]> => {
  if (!hasSupabaseCredentials()) {
    return JSON.parse(safeStorage.getItem(DEMO_TEMPLATES_KEY) || "[]")
  }
  try {
    const { data, error } = await supabase.from("email_templates").select("*").order("key", { ascending: true })
    if (error) throw error
    return (data || []).map((row: any) => ({
      id: row.id,
      key: row.key,
      subject: row.subject,
      body: row.body,
      fromAddress: row.from_address,
      isActive: row.is_active
    }))
  } catch (err) {
    console.error("getEmailTemplates failed:", err)
    return []
  }
}

export const renderTemplate = (template: string, vars: Record<string, string>) => {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] || "")
}

export const sendEmail = async (
  to: string,
  subject: string,
  body: string,
  from?: string
): Promise<{ error?: string }> => {
  if (!hasSupabaseCredentials()) {
    console.log("Demo mode: email would be sent to", to, subject)
    return {}
  }
  try {
    const functionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-email`
    const { data: sessionData } = await supabase.auth.getSession()
    const token = sessionData.session?.access_token
    const response = await fetch(functionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ to, subject, body, from })
    })
    if (!response.ok) {
      const text = await response.text()
      throw new Error(text)
    }
    return {}
  } catch (err) {
    console.error("sendEmail failed:", err)
    return { error: String(err) }
  }
}

export const sendTemplatedEmail = async (
  templateKey: string,
  to: string,
  vars: Record<string, string>
): Promise<{ error?: string }> => {
  const templates = await getEmailTemplates()
  const template = templates.find(t => t.key === templateKey && t.isActive)
  if (!template) {
    return { error: `Email template ${templateKey} not found` }
  }
  return sendEmail(to, renderTemplate(template.subject, vars), renderTemplate(template.body, vars), template.fromAddress)
}
