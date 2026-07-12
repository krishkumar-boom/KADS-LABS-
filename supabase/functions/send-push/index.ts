import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import webpush from "https://esm.sh/web-push@3.6.6"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.109.0"

interface PushPayload {
  title?: string
  body?: string
  url?: string
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  try {
    const { title, body, url } = (await req.json()) as PushPayload

    if (!title || !body) {
      return new Response(JSON.stringify({ error: "Missing required fields: title, body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      })
    }

    const vapidPublic = Deno.env.get("VAPID_PUBLIC_KEY")
    const vapidPrivate = Deno.env.get("VAPID_PRIVATE_KEY")
    const vapidSubject = Deno.env.get("VAPID_SUBJECT") || "mailto:founders@kadslabs.com"

    if (!vapidPublic || !vapidPrivate) {
      console.log("Push simulated (no VAPID keys configured):", { title, body })
      return new Response(JSON.stringify({
        success: true,
        simulated: true,
        message: "VAPID keys not configured. Set VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, and VAPID_SUBJECT in Supabase Edge Function secrets."
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      })
    }

    webpush.setVapidDetails(vapidSubject, vapidPublic, vapidPrivate)

    const supabaseUrl = Deno.env.get("SUPABASE_URL")
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    if (!supabaseUrl || !serviceKey) {
      throw new Error("Supabase service credentials not available")
    }

    const supabase = createClient(supabaseUrl, serviceKey)
    const { data: subscriptions, error } = await supabase.from("push_subscriptions").select("*")
    if (error) throw error

    const results: { endpoint?: string; status: string; error?: string }[] = []

    for (const sub of subscriptions || []) {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: { p256dh: sub.p256dh, auth: sub.auth }
      }
      try {
        await webpush.sendNotification(
          pushSubscription,
          JSON.stringify({ title, body, url: url || "./" })
        )
        results.push({ endpoint: sub.endpoint, status: "sent" })
      } catch (e) {
        results.push({ endpoint: sub.endpoint, status: "failed", error: String(e) })
      }
    }

    return new Response(JSON.stringify({ success: true, sent: results.length, results }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    })
  } catch (err) {
    console.error("send-push failed:", err)
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    })
  }
})
