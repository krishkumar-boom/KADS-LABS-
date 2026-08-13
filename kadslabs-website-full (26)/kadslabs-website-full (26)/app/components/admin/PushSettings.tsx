"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { subscribeToPush, sendPushNotification } from "@/lib/push"
import { useAuth } from "../AuthProvider"
import { Bell, Send, CheckCircle } from "lucide-react"
import { hasSupabaseCredentials } from "@/lib/supabase"

export default function PushSettings() {
  const { user } = useAuth()
  const [message, setMessage] = useState("")
  const [subscribing, setSubscribing] = useState(false)

  const handleSubscribe = async () => {
    if (!user?.id) {
      setMessage("Please sign in to enable push notifications.")
      return
    }
    setSubscribing(true)
    const result = await subscribeToPush(user.id)
    setMessage(result.error || "Push notifications enabled for this device.")
    setSubscribing(false)
  }

  const handleTestSend = async () => {
    const result = await sendPushNotification("KADS LABS", "This is a test push notification.", "./")
    setMessage(result.error || "Test push notification sent.")
  }

  const configured = hasSupabaseCredentials() && process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="premium-card p-6 sm:p-8 glow-border">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Push Notifications</h2>
        <p className="text-sm text-white/60 mt-1">Enable web push notifications for this device. Requires VAPID keys and the send-push Edge Function.</p>
      </div>

      {message && (
        <div className="mb-4 p-3 rounded-lg bg-electric/10 text-electric-light text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> {message}
        </div>
      )}

      {!configured && (
        <div className="mb-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-sm text-yellow-200">
          ⚠️ Set NEXT_PUBLIC_VAPID_PUBLIC_KEY in .env.local and deploy the send-push Edge Function to enable push notifications.
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button onClick={handleSubscribe} disabled={subscribing} className="btn-primary flex items-center gap-2">
          <Bell className="w-4 h-4" /> {subscribing ? "Subscribing..." : "Enable Push"}
        </button>
        <button onClick={handleTestSend} className="btn-outline flex items-center gap-2">
          <Send className="w-4 h-4" /> Test Send
        </button>
      </div>
    </motion.div>
  )
}
