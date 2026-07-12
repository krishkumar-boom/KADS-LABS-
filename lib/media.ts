import { supabase, hasSupabaseCredentials } from "./supabase"
import { safeStorage } from "./storage"
import { MediaFile, generateId } from "./site-data"

const DEMO_MEDIA_KEY = "kads_demo_media"
const BUCKET = "website-assets"

export const getMediaType = (mimeType: string): MediaFile["type"] => {
  if (mimeType.startsWith("image/")) return "image"
  if (mimeType.startsWith("video/")) return "video"
  if (mimeType === "application/pdf") return "pdf"
  if (mimeType === "application/zip" || mimeType === "application/x-zip-compressed") return "zip"
  return "document"
}

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 B"
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

export const uploadMedia = async (file: File, folder = "/", onProgress?: (progress: number) => void): Promise<{ data?: MediaFile; error?: string }> => {
  const type = getMediaType(file.type || "application/octet-stream")
  const id = generateId("media")
  const folderPath = folder.replace(/^\//, "").replace(/\/$/, "")
  const filePath = folderPath ? `${folderPath}/${id}-${file.name}` : `${id}-${file.name}`

  if (!hasSupabaseCredentials()) {
    // Demo fallback: store small files as base64 in localStorage (limited to ~5MB total)
    if (file.size > 1024 * 1024) {
      return { error: "Demo mode: files larger than 1MB cannot be stored locally. Configure Supabase Storage for full media library support." }
    }
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(String(reader.result))
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      const media: MediaFile = {
        id,
        name: file.name,
        type,
        url: dataUrl,
        size: file.size,
        mimeType: file.type,
        folder: folderPath || "/",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      const existing = JSON.parse(safeStorage.getItem(DEMO_MEDIA_KEY) || "[]") as MediaFile[]
      existing.unshift(media)
      safeStorage.setItem(DEMO_MEDIA_KEY, JSON.stringify(existing.slice(0, 50)))
      return { data: media }
    } catch (err) {
      return { error: String(err) }
    }
  }

  try {
    const { data: uploadData, error: uploadError } = await supabase.storage.from(BUCKET).upload(filePath, file, {
      cacheControl: "3600",
      upsert: false
    })
    if (uploadError) throw uploadError

    const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(uploadData.path)
    const media: MediaFile = {
      id: uploadData.path,
      name: file.name,
      type,
      url: publicData.publicUrl,
      size: file.size,
      mimeType: file.type,
      folder: folderPath || "/",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    return { data: media }
  } catch (err) {
    console.error("uploadMedia failed:", err)
    return { error: String(err) }
  }
}

export const listMedia = async (options?: { page?: number; limit?: number; folder?: string; search?: string; type?: MediaFile["type"] }): Promise<{ data: MediaFile[]; count?: number }> => {
  const page = options?.page || 1
  const limit = options?.limit || 50

  if (!hasSupabaseCredentials()) {
    let all = JSON.parse(safeStorage.getItem(DEMO_MEDIA_KEY) || "[]") as MediaFile[]
    if (options?.folder) all = all.filter(m => m.folder === options.folder || m.folder.startsWith(options.folder as string))
    if (options?.type) all = all.filter(m => m.type === options.type)
    if (options?.search) {
      const q = options.search.toLowerCase()
      all = all.filter(m => m.name.toLowerCase().includes(q))
    }
    const start = (page - 1) * limit
    return { data: all.slice(start, start + limit), count: all.length }
  }

  try {
    const { data, error } = await supabase.storage.from(BUCKET).list(options?.folder || "", {
      limit: 100,
      offset: 0,
      sortBy: { column: "created_at", order: "desc" }
    })
    if (error) throw error

    const items = (data || []).filter(item => item.id !== ".emptyFolderPlaceholder")
    const mapped: MediaFile[] = items.map(item => {
      const path = options?.folder ? `${options.folder}/${item.name}` : item.name
      const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(path)
      return {
        id: path,
        name: item.name,
        type: getMediaType(item.metadata?.mimetype || ""),
        url: publicData.publicUrl,
        size: item.metadata?.size || 0,
        mimeType: item.metadata?.mimetype || "",
        folder: options?.folder || "/",
        createdAt: item.created_at || new Date().toISOString(),
        updatedAt: item.updated_at || new Date().toISOString()
      }
    })

    let filtered = mapped
    if (options?.type) filtered = filtered.filter(m => m.type === options.type)
    if (options?.search) {
      const q = options.search.toLowerCase()
      filtered = filtered.filter(m => m.name.toLowerCase().includes(q))
    }
    const start = (page - 1) * limit
    return { data: filtered.slice(start, start + limit), count: filtered.length }
  } catch (err) {
    console.error("listMedia failed:", err)
    return { data: [] }
  }
}

export const deleteMedia = async (media: MediaFile): Promise<{ error?: string }> => {
  if (!hasSupabaseCredentials()) {
    const existing = JSON.parse(safeStorage.getItem(DEMO_MEDIA_KEY) || "[]") as MediaFile[]
    safeStorage.setItem(DEMO_MEDIA_KEY, JSON.stringify(existing.filter(m => m.id !== media.id)))
    return {}
  }
  try {
    const { error } = await supabase.storage.from(BUCKET).remove([media.id])
    if (error) throw error
    return {}
  } catch (err) {
    console.error("deleteMedia failed:", err)
    return { error: String(err) }
  }
}

export const moveMedia = async (media: MediaFile, newFolder: string, newName?: string): Promise<{ data?: MediaFile; error?: string }> => {
  const folderPath = newFolder.replace(/^\//, "").replace(/\/$/, "")
  const name = newName || media.name
  const newPath = folderPath ? `${folderPath}/${name}` : name

  if (!hasSupabaseCredentials()) {
    const existing = JSON.parse(safeStorage.getItem(DEMO_MEDIA_KEY) || "[]") as MediaFile[]
    const target = existing.find(m => m.id === media.id)
    if (target) {
      target.folder = folderPath || "/"
      target.name = name
      target.updatedAt = new Date().toISOString()
      safeStorage.setItem(DEMO_MEDIA_KEY, JSON.stringify(existing))
    }
    return { data: target }
  }

  try {
    const { data, error } = await supabase.storage.from(BUCKET).move(media.id, newPath)
    if (error) throw error
    const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(newPath)
    const updated: MediaFile = { ...media, id: newPath, name, folder: folderPath || "/", url: publicData.publicUrl, updatedAt: new Date().toISOString() }
    return { data: updated }
  } catch (err) {
    console.error("moveMedia failed:", err)
    return { error: String(err) }
  }
}

export const renameMedia = async (media: MediaFile, newName: string): Promise<{ data?: MediaFile; error?: string }> => {
  return moveMedia(media, media.folder, newName)
}

export const bulkDeleteMedia = async (mediaItems: MediaFile[]): Promise<{ error?: string }> => {
  for (const item of mediaItems) {
    const result = await deleteMedia(item)
    if (result.error) return { error: result.error }
  }
  return {}
}
