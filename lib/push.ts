import { supabase, hasSupabaseCredentials } from "./supabase"

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""

export const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const rawData = atob(base64)
  return Uint8Array.from(rawData.split("").map(c => c.charCodeAt(0)))
}

export const subscribeToPush = async (userId: string): Promise<{ error?: string }> => {
  if (!hasSupabaseCredentials() || !VAPID_PUBLIC_KEY) {
    return { error: "Push notifications are not configured. Set NEXT_PUBLIC_VAPID_PUBLIC_KEY in .env.local" }
  }
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    return { error: "Push notifications are not supported in this browser" }
  }
  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    })
    const json = subscription.toJSON()
    const { error } = await supabase.from("push_subscriptions").upsert({
      user_id: userId,
      endpoint: json.endpoint,
      p256dh: json.keys?.p256dh,
      auth: json.keys?.auth
    }, { onConflict: "endpoint" })
    if (error) throw error
    return {}
  } catch (err) {
    console.error("subscribeToPush failed:", err)
    return { error: String(err) }
  }
}

export const sendPushNotification = async (
  title: string,
  body: string,
  url?: string
): Promise<{ error?: string }> => {
  if (!hasSupabaseCredentials()) {
    console.log("Demo mode: push notification would be sent", title, body)
    return {}
  }
  try {
    const functionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-push`
    const { data: sessionData } = await supabase.auth.getSession()
    const token = sessionData.session?.access_token
    const response = await fetch(functionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ title, body, url })
    })
    if (!response.ok) {
      const text = await response.text()
      throw new Error(text)
    }
    return {}
  } catch (err) {
    console.error("sendPushNotification failed:", err)
    return { error: String(err) }
  }
}
