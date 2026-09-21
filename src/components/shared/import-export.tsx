"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { BaseDialog } from "@/components/ui/base-dialog"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import {
  Upload,
  Download,
  Loader2,
  AlertTriangle,
  FileSpreadsheet,
  X,
  Check,
  FileUp,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export interface ImportExportProps {
  // Controlled modal state
  open?: boolean
  onOpen?: () => void
  onClose?: () => void

  // Action callbacks
  handleImport: (file: File) => Promise<void> | void
  handleExport: () => Promise<void> | void

  // External loading states
  isLoadingImport?: boolean
  isLoadingExport?: boolean

  // Text & UI configurations
  title?: string
  description?: string
  warningMessage?: string
  accept?: string
  exportLabel?: string
  importLabel?: string
  showExport?: boolean
  showImport?: boolean

  // Template download
  templateDownloadUrl?: string
  templateDownloadLabel?: string

  // Progress states
  importProgress?: number | null
  isProgressActive?: boolean
}

export function ImportExport({
  open: openProp,
  onOpen,
  onClose,
  handleImport,
  handleExport,
  isLoadingImport,
  isLoadingExport,
  title = "Import Data",
  description = "Unggah file spreadsheet Anda untuk mengimpor data ke dalam sistem.",
  warningMessage = "Peringatan: Data yang sudah ada akan ditimpa dengan data baru dari file yang diimpor. Tindakan ini tidak dapat dibatalkan atau dikembalikan.",
  accept = ".xlsx, .xls, .csv",
  exportLabel = "Export",
  importLabel = "Import",
  showExport = true,
  showImport = true,
  templateDownloadUrl,
  templateDownloadLabel = "Unduh Template",
  importProgress = null,
  isProgressActive = false,
}: ImportExportProps) {
  // Modal state (support both controlled and uncontrolled)
  const isControlled = openProp !== undefined
  const [isOpenInternal, setIsOpenInternal] = useState(false)
  const isOpen = isControlled ? openProp : isOpenInternal

  // Internal loading states
  const [isImportingInternal, setIsImportingInternal] = useState(false)
  const [isExportingInternal, setIsExportingInternal] = useState(false)

  const isImporting =
    isLoadingImport !== undefined ? isLoadingImport : isImportingInternal
  const isExporting =
    isLoadingExport !== undefined ? isLoadingExport : isExportingInternal

  // Drag and Drop state
  const [isDragActive, setIsDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Popover state
  const [showFinishedState, setShowFinishedState] = useState(false)
  const [importingFileName, setImportingFileName] = useState<string>("")
  const prevActiveRef = useRef(false)

  useEffect(() => {
    const isActive = isImporting || isProgressActive
    if (prevActiveRef.current && !isActive) {
      setShowFinishedState(true)
      const timer = setTimeout(() => {
        setShowFinishedState(false)
        setImportingFileName("")
      }, 2000)
      return () => clearTimeout(timer)
    }
    prevActiveRef.current = isActive
  }, [isImporting, isProgressActive])

  const handleOpenDialog = () => {
    if (!isControlled) {
      setIsOpenInternal(true)
    }
    onOpen?.()
  }

  const handleCloseDialog = () => {
    if (isImporting) {
      return
    }
    if (!isControlled) {
      setIsOpenInternal(false)
    }
    setSelectedFile(null)
    onClose?.()
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleCloseDialog()
    } else {
      handleOpenDialog()
    }
  }

  // Drag and Drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true)
    } else if (e.type === "dragleave") {
      setIsDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      validateAndSetFile(file)
    }
  }

  const triggerFileInput = () => {
    if (isImporting) {
      return
    }
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0])
    }
    e.target.value = ""
  }

  const validateAndSetFile = (file: File) => {
    const fileExtension = file.name
      .substring(file.name.lastIndexOf("."))
      .toLowerCase()
    const acceptedTypes = accept.split(",").map((t) => t.trim().toLowerCase())

    const isValid = acceptedTypes.some((type) => {
      if (type.startsWith(".")) {
        return fileExtension === type
      }
      return file.type.includes(type)
    })

    if (!isValid) {
      toast.error(`Format file tidak valid. Gunakan format file: ${accept}`)
      return
    }

    setSelectedFile(file)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) {
      return "0 Bytes"
    }
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Action confirmations
  const onExportClick = async () => {
    if (isExporting || isImporting) {
      return
    }
    setIsExportingInternal(true)
    try {
      await handleExport()
    } catch {
      toast.error("Gagal mengekspor data.")
    } finally {
      setIsExportingInternal(false)
    }
  }

  const onImportConfirm = async () => {
    if (!selectedFile || isImporting) {
      return
    }
    setImportingFileName(selectedFile.name)
    setIsImportingInternal(true)
    try {
      await handleImport(selectedFile)
      setSelectedFile(null)
      handleCloseDialog()
    } catch {
      toast.error("Gagal mengimpor data.")
    } finally {
      setIsImportingInternal(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-2">
        {showExport && (
          <Button
            type="button"
            variant="outline"
            onClick={onExportClick}
            disabled={isExporting || isImporting || isProgressActive}
            className="flex h-9 cursor-pointer gap-1.5 rounded-xl border-border bg-background px-3 text-xs font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-50"
          >
            {isExporting ? (
              <Loader2 size={16} className="animate-spin text-primary" />
            ) : (
              <Download size={16} className="text-muted-foreground" />
            )}
            {exportLabel}
          </Button>
        )}

        {showImport && (
          <Popover open={isImporting || isProgressActive || showFinishedState}>
            <PopoverTrigger
              render={
                <Button
                  type="button"
                  onClick={handleOpenDialog}
                  disabled={isImporting || isProgressActive}
                  className="relative flex h-9 cursor-pointer gap-1.5 rounded-xl bg-primary px-3 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-70"
                >
                  {isImporting || isProgressActive ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Upload size={16} />
                  )}
                  {importLabel}
                </Button>
              }
            />
            <PopoverContent
              side="top"
              align="end"
              sideOffset={8}
              className="z-50 w-72 animate-in rounded-2xl border border-border bg-popover p-4 text-left text-popover-foreground shadow-xl duration-200 fade-in slide-in-from-bottom-2"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">
                    {showFinishedState ? (
                      <span className="flex items-center gap-1.5 text-primary">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Check size={12} className="stroke-[3]" />
                        </span>
                        <span>Import Selesai!</span>
                      </span>
                    ) : isImporting && !isProgressActive ? (
                      <span className="flex items-center gap-1.5 text-foreground">
                        <Loader2
                          size={14}
                          className="animate-spin text-primary"
                        />
                        <span>Mengunggah file...</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-foreground">
                        <Loader2
                          size={14}
                          className="animate-spin text-primary"
                        />
                        <span>Memproses data...</span>
                      </span>
                    )}
                  </span>
                  {!showFinishedState && importProgress !== null && (
                    <span className="font-mono text-xs font-bold text-primary">
                      {importProgress}%
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                    {showFinishedState ? (
                      <div className="h-full w-full bg-primary transition-all duration-300" />
                    ) : isImporting && !isProgressActive ? (
                      <div className="relative h-full w-full overflow-hidden rounded-full bg-primary/30">
                        <div className="animate-shimmer-loading absolute inset-0 h-full w-1/2 bg-gradient-to-r from-transparent via-primary to-transparent" />
                      </div>
                    ) : (
                      <div
                        className="relative h-full overflow-hidden rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${importProgress ?? 0}%` }}
                      >
                        <div className="animate-shimmer-loading absolute inset-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                      </div>
                    )}
                  </div>
                  {importingFileName && (
                    <div className="truncate text-[10px] font-semibold text-muted-foreground">
                      File: {importingFileName}
                    </div>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Dialog Modal */}
      <BaseDialog
        open={isOpen}
        onOpenChange={handleOpenChange}
        showCloseButton={!isImporting}
        className="max-w-sm gap-0 overflow-hidden p-4"
        title={
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10">
              <FileSpreadsheet size={13} className="text-primary" />
            </div>
            <span className="text-[13px] font-bold text-foreground">
              {title}
            </span>
          </div>
        }
      >
        <div className="space-y-3 pt-4">
          <p className="-mt-2 text-[10px] leading-relaxed font-medium text-muted-foreground">
            {description}
          </p>

          <div className="flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2.5">
            <AlertTriangle
              size={13}
              className="mt-[1px] shrink-0 text-amber-500"
            />
            <p className="text-[10px] leading-relaxed font-medium text-amber-600 dark:text-amber-400">
              {warningMessage}
            </p>
          </div>

          {templateDownloadUrl && (
            <div className="flex items-center justify-between gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2">
              <div className="flex min-w-0 items-center gap-1.5">
                <FileUp size={13} className="shrink-0 text-primary" />
                <span className="truncate text-[10px] font-semibold text-foreground">
                  Belum punya template?
                </span>
              </div>
              <a
                href={templateDownloadUrl}
                download
                className="flex shrink-0 items-center gap-1 rounded-lg border border-border bg-background px-2 py-1 text-[10px] font-bold text-primary transition-all hover:underline hover:shadow-xs"
              >
                <Download size={11} className="shrink-0" />
                {templateDownloadLabel}
              </a>
            </div>
          )}

          {!selectedFile ? (
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={triggerFileInput}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-5 transition-all select-none",
                isDragActive
                  ? "scale-[1.01] border-primary bg-primary/10"
                  : "border-border hover:border-primary hover:bg-muted/40"
              )}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept={accept}
                className="hidden"
                disabled={isImporting}
              />
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
                  isDragActive
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Upload size={17} />
              </div>
              <div className="text-center">
                <p className="text-[11px] font-semibold text-foreground">
                  <span className="font-bold text-primary">
                    Klik pilih file
                  </span>{" "}
                  atau seret ke sini
                </p>
                <p className="mt-1 text-[9px] font-medium tracking-wide text-muted-foreground uppercase">
                  {accept}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-3 py-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileSpreadsheet size={17} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-bold text-foreground">
                  {selectedFile.name}
                </p>
                <p className="mt-0.5 text-[9px] font-medium text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              <button
                type="button"
                disabled={isImporting}
                onClick={() => setSelectedFile(null)}
                className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              className="h-9 px-4 text-xs font-semibold cursor-pointer rounded-xl"
              onClick={handleCloseDialog}
              disabled={isImporting}
            >
              Batal
            </Button>
            <Button
              type="button"
              className="h-9 px-4 gap-2 text-xs font-semibold cursor-pointer rounded-xl shadow-xs"
              onClick={onImportConfirm}
              disabled={!selectedFile || isImporting}
            >
              {isImporting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Mengimpor...</span>
                </>
              ) : (
                <>
                  <Check size={14} />
                  <span>Import Sekarang</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </BaseDialog>
    </div>
  )
}
