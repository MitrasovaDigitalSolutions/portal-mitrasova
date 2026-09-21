"use client"

import {
  useFormContext,
  Controller,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"
import { useState, useEffect, useMemo, useRef } from "react"
import { toast } from "sonner"
import { Upload, Trash2, AlertCircle } from "lucide-react"
import { cn, getImageUrl } from "@/lib/utils"

interface FormImageUploadProps<T extends FieldValues> {
  name: FieldPath<T>
  label?: string
  disabled?: boolean
  className?: string
  dropzoneClassName?: string
  initialUrl?: string | null
}

export function FormImageUpload<T extends FieldValues>({
  name,
  label,
  disabled = false,
  className,
  dropzoneClassName,
  initialUrl,
}: FormImageUploadProps<T>) {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<T>()

  const error = errors[name]
  const fieldValue = watch(name)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  // Derive previewUrl directly during render using useMemo
  const previewUrl = useMemo(() => {
    if (
      typeof window !== "undefined" &&
      (fieldValue as unknown) instanceof File
    ) {
      return URL.createObjectURL(fieldValue as unknown as File)
    }
    if (typeof fieldValue === "string") {
      return fieldValue.trim() !== "" ? getImageUrl(fieldValue) : null
    }
    if (fieldValue === null || fieldValue === undefined) {
      return initialUrl ? getImageUrl(initialUrl) : null
    }
    return null
  }, [fieldValue, initialUrl])

  // Clean up blob URL when previewUrl changes or component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handleFileChange = (
    file: File | null,
    onChange: (val: File | null | string) => void
  ) => {
    if (!file) {
      onChange("")
      return
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Harap pilih file gambar saja (JPG, PNG, WEBP).")
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran gambar tidak boleh melebihi 2MB.")
      return
    }

    onChange(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragOver(true)
    }
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (
    e: React.DragEvent,
    onChange: (val: File | null | string) => void
  ) => {
    e.preventDefault()
    setIsDragOver(false)

    if (disabled) {
      return
    }

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFileChange(files[0], onChange)
    }
  }

  const handleRemove = (
    e: React.MouseEvent,
    onChange: (val: File | null | string) => void
  ) => {
    e.stopPropagation()
    e.preventDefault()

    onChange("")

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
          {label}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div
            onClick={() => !disabled && fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, field.onChange)}
            className={cn(
              "relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed p-4 transition-all duration-200",
              isDragOver
                ? "border-primary bg-primary/10"
                : error
                  ? "border-destructive/60 bg-destructive/5 hover:border-destructive"
                  : "border-border bg-muted/20 hover:border-primary hover:bg-muted/40",
              disabled && "cursor-not-allowed opacity-50",
              dropzoneClassName || "h-full min-h-[220px] md:min-h-[300px]"
            )}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              disabled={disabled}
              onChange={(e) => {
                const files = e.target.files
                if (files && files.length > 0) {
                  handleFileChange(files[0], field.onChange)
                }
              }}
            />

            {previewUrl ? (
              <div className="group relative h-full w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Preview Gambar"
                  className="h-full w-full rounded-xl object-contain"
                />
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={(e) => handleRemove(e, field.onChange)}
                    className="text-destructive-foreground flex scale-90 cursor-pointer items-center gap-1.5 rounded-xl border-none bg-destructive p-2 text-[10px] font-bold uppercase shadow-lg transition-transform group-hover:scale-100 hover:bg-destructive/90"
                  >
                    <Trash2 size={14} />
                    Hapus Gambar
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-colors">
                  <Upload size={20} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] font-bold text-foreground">
                    Klik untuk unggah atau seret berkas
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    PNG, JPG, JPEG atau WEBP (Maks. 2MB)
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      />

      {error && (
        <p className="flex items-center gap-1 text-[10px] font-medium text-destructive">
          <AlertCircle size={12} />
          {error.message as string}
        </p>
      )}
    </div>
  )
}
