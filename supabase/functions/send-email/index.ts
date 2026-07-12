import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

interface EmailPayload {
  to?: string
  subject?: string
  body?: string
  from?: string
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
    const payload = (await req.json()) as EmailPayload
    const { to, subject, body, from } = payload

    if (!to || !subject || !body) {
      return new Response(JSON.stringify({ error: "Missing required fields: to, subject, body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      })
    }

    const resendKey = Deno.env.get("RESEND_API_KEY")
    const brevoKey = Deno.env.get("BREVO_API_KEY")
    const sender = from || Deno.env.get("EMAIL_FROM") || "KADS LABS <founders@kadslabs.com>"

    if (resendKey) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${resendKey}`
        },
        body: JSON.stringify({
          from: sender,
          to: [to],
          subject,
          html: body.replace(/\n/g, "<br>")
        })
      })
      if (!response.ok) {
        const text = await response.text()
        throw new Error(`Resend error: ${text}`)
      }
      return new Response(JSON.stringify({ success: true, provider: "resend" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      })
    }

    if (brevoKey) {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": brevoKey
        },
        body: JSON.stringify({
          sender: { name: "KADS LABS", email: sender.includes("<") ? sender.match(/<(.+)>/)?.[1] || sender : sender },
          to: [{ email: to }],
          subject,
          htmlContent: body.replace(/\n/g, "<br>")
        })
      })
      if (!response.ok) {
        const text = await response.text()
        throw new Error(`Brevo error: ${text}`)
      }
      return new Response(JSON.stringify({ success: true, provider: "brevo" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      })
    }

    // No email provider configured: simulate success so the UI still works during setup.
    console.log("Email simulated (no provider configured):", { to, subject })
    return new Response(JSON.stringify({ success: true, simulated: true, message: "Email provider not configured. Set RESEND_API_KEY or BREVO_API_KEY in Supabase Edge Function secrets." }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    })
  } catch (err) {
    console.error("send-email failed:", err)
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    })
  }
})
