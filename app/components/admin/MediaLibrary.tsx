"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { MediaFile } from "@/lib/content"
import { listMedia, uploadMedia, deleteMedia, moveMedia, bulkDeleteMedia, formatBytes, getMediaType } from "@/lib/media"
import { hasSupabaseCredentials } from "@/lib/supabase"
import {
  Upload, Search, Trash2, Move, Edit3, Folder, Image, File, FileVideo,
  FileCode, Archive, Download, X, CheckSquare, Square, Filter, Maximize2
} from "lucide-react"
import { getIcon } from "@/lib/icons"
import SafeImage from "../SafeImage"

const typeOptions: { value: MediaFile["type"] | "all"; label: string }[] = [
  { value: "all", label: "All Types" },
  { value: "image", label: "Images" },
  { value: "video", label: "Videos" },
  { value: "pdf", label: "PDFs" },
  { value: "zip", label: "ZIPs" },
  { value: "document", label: "Documents" }
]

const typeIcon: Record<MediaFile["type"], any> = {
  image: Image,
  video: FileVideo,
  pdf: FileCode,
  zip: Archive,
  document: File,
  other: File
}

export default function MediaLibrary() {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<MediaFile["type"] | "all">("all")
  const [folder, setFolder] = useState("/")
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [preview, setPreview] = useState<MediaFile | null>(null)
  const [renameTarget, setRenameTarget] = useState<MediaFile | null>(null)
  const [renameValue, setRenameValue] = useState("")
  const [moveTarget, setMoveTarget] = useState<MediaFile | null>(null)
  const [moveValue, setMoveValue] = useState("")
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const bulkInputRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await listMedia({ folder, search, type: typeFilter === "all" ? undefined : typeFilter, limit: 100 })
    setFiles(data)
    setLoading(false)
  }, [folder, search, typeFilter])

  useEffect(() => {
    load()
  }, [load])

  const showMessage = (text: string, type: "success" | "error" = "success") => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleUpload = async (filesToUpload: FileList | null) => {
    if (!filesToUpload || filesToUpload.length === 0) return
    setUploading(true)
    for (const file of Array.from(filesToUpload)) {
      const result = await uploadMedia(file, folder)
      if (result.error) {
        showMessage(result.error, "error")
      } else {
        showMessage(`Uploaded ${file.name}`)
      }
    }
    setUploading(false)
    await load()
  }

  const handleDelete = async (file: MediaFile) => {
    const result = await deleteMedia(file)
    if (result.error) showMessage(result.error, "error")
    else {
      showMessage("Deleted " + file.name)
      await load()
    }
  }

  const handleBulkDelete = async () => {
    const items = files.filter(f => selected.has(f.id))
    const result = await bulkDeleteMedia(items)
    if (result.error) showMessage(result.error, "error")
    else {
      showMessage(`Deleted ${items.length} items`)
      setSelected(new Set())
      await load()
    }
  }

  const handleRename = async () => {
    if (!renameTarget || !renameValue) return
    const result = await moveMedia(renameTarget, renameTarget.folder, renameValue)
    if (result.error) showMessage(result.error, "error")
    else {
      showMessage("Renamed successfully")
      setRenameTarget(null)
      await load()
    }
  }

  const handleMove = async () => {
    if (!moveTarget || !moveValue) return
    const result = await moveMedia(moveTarget, moveValue)
    if (result.error) showMessage(result.error, "error")
    else {
      showMessage("Moved successfully")
      setMoveTarget(null)
      await load()
    }
  }

  const toggleSelect = (id: string) => {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelected(next)
  }

  const selectAll = () => {
    if (selected.size === files.length) setSelected(new Set())
    else setSelected(new Set(files.map(f => f.id)))
  }

  const FolderIcon = getIcon("Folder")

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="premium-card p-6 sm:p-8 glow-border"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold">Media Library</h2>
          <p className="text-sm text-white/60 mt-1">
            Manage images, videos, documents, PDFs, and ZIPs. {hasSupabaseCredentials() ? "Connected to Supabase Storage." : "Demo mode: small files stored locally."}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            type="file"
            multiple
            className="hidden"
            ref={bulkInputRef}
            onChange={(e) => handleUpload(e.target.files)}
          />
          <button
            onClick={() => bulkInputRef.current?.click()}
            disabled={uploading}
            className="btn-outline px-4 py-2 text-sm"
          >
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </button>
          <input
            type="file"
            className="hidden"
            ref={inputRef}
            onChange={(e) => handleUpload(e.target.files)}
          />
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="btn-primary px-4 py-2 text-sm"
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${message.type === "error" ? "bg-red-500/10 text-red-300 border border-red-500/20" : "bg-green-500/10 text-green-300 border border-green-500/20"}`}>
          {message.text}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-electric text-sm"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as MediaFile["type"] | "all")}
            className="pl-9 pr-8 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-electric"
          >
            {typeOptions.map(o => <option key={o.value} value={o.value} className="bg-navy-900">{o.label}</option>)}
          </select>
        </div>
        <div className="relative">
          <FolderIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            placeholder="Folder"
            className="pl-9 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-electric text-sm"
          />
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button onClick={selectAll} className="text-sm text-white/60 hover:text-white flex items-center gap-1">
            {selected.size === files.length && files.length > 0 ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
            {selected.size === files.length && files.length > 0 ? "Deselect All" : "Select All"}
          </button>
          {selected.size > 0 && (
            <button onClick={handleBulkDelete} className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1 ml-3">
              <Trash2 className="w-4 h-4" /> Delete {selected.size}
            </button>
          )}
        </div>
        <span className="text-xs text-white/40">{files.length} files</span>
      </div>

      {loading ? (
        <div className="py-12 text-center text-white/60">Loading media...</div>
      ) : files.length === 0 ? (
        <div className="py-12 text-center text-white/60">
          <Image className="w-12 h-12 mx-auto mb-4 text-white/20" />
          <p>No media files found in this folder.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {files.map((file) => {
            const TypeIcon = typeIcon[file.type] || File
            const isSelected = selected.has(file.id)
            return (
              <div
                key={file.id}
                className={`group relative rounded-xl overflow-hidden border border-white/10 bg-white/5 hover:border-electric/40 transition-colors ${isSelected ? "ring-2 ring-electric" : ""}`}
              >
                <button onClick={() => toggleSelect(file.id)} className="absolute top-2 left-2 z-10 text-white/70 hover:text-white">
                  {isSelected ? <CheckSquare className="w-5 h-5 text-electric" /> : <Square className="w-5 h-5" />}
                </button>
                <div className="aspect-square flex items-center justify-center bg-navy-900/50 relative">
                  {file.type === "image" ? (
                    <SafeImage
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <TypeIcon className="w-12 h-12 text-white/30" />
                  )}
                  <button onClick={() => setPreview(file)} className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-white/10 hover:bg-electric/80 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium truncate" title={file.name}>{file.name}</p>
                  <p className="text-xs text-white/50">{formatBytes(file.size)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => { setRenameTarget(file); setRenameValue(file.name) }} className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => { setMoveTarget(file); setMoveValue(file.folder) }} className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white">
                      <Move className="w-3.5 h-3.5" />
                    </button>
                    <a href={file.url} download className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white">
                      <Download className="w-3.5 h-3.5" />
                    </a>
                    <button onClick={() => handleDelete(file)} className="p-1.5 rounded bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-auto rounded-2xl bg-navy-900 border border-white/10 p-4">
            <button onClick={() => setPreview(null)} className="absolute top-3 right-3 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold mb-4 pr-10">{preview.name}</h3>
            {preview.type === "image" ? (
              <img src={preview.url} alt={preview.name} className="max-w-full max-h-[70vh] mx-auto rounded-lg" />
            ) : preview.type === "video" ? (
              <video src={preview.url} controls className="max-w-full max-h-[70vh] mx-auto rounded-lg" />
            ) : (
              <div className="p-8 text-center text-white/60">
                <p>Preview not available for this file type.</p>
                <a href={preview.url} download className="btn-primary mt-4 inline-flex">Download</a>
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-white/60">
              <span>Type: {preview.type}</span>
              <span>Size: {formatBytes(preview.size)}</span>
              <span>Folder: {preview.folder}</span>
            </div>
          </div>
        </div>
      )}

      {renameTarget && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Rename File</h3>
            <input
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-electric mb-4"
            />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setRenameTarget(null)} className="btn-outline px-4 py-2 text-sm">Cancel</button>
              <button onClick={handleRename} className="btn-primary px-4 py-2 text-sm">Save</button>
            </div>
          </div>
        </div>
      )}

      {moveTarget && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Move to Folder</h3>
            <input
              type="text"
              value={moveValue}
              onChange={(e) => setMoveValue(e.target.value)}
              placeholder="e.g. uploads/team"
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-electric mb-4"
            />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setMoveTarget(null)} className="btn-outline px-4 py-2 text-sm">Cancel</button>
              <button onClick={handleMove} className="btn-primary px-4 py-2 text-sm">Move</button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
