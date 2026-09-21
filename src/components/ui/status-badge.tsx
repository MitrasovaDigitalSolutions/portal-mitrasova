"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type React from "react"

export type StatusType =
  | "active"
  | "aktif"
  | "inactive"
  | "nonaktif"
  | "archived"
  | "diarsipkan"
  | "completed"
  | "selesai"
  | "finalized"
  | "final"
  | "received"
  | "diterima"
  | "partially_received"
  | "pending"
  | "menunggu"
  | "processing"
  | "proses"
  | "canceled"
  | "batal"
  | "failed"
  | "gagal"
  | "draft"
  | "approved"
  | "disetujui"
  | "rejected"
  | "ditolak"
  | "paid"
  | "lunas"
  | "unpaid"
  | "belum_bayar"
  | string

interface StatusBadgeProps {
  status?: StatusType | null
  label?: string
  className?: string
  showDot?: boolean
  pulse?: boolean
  variant?:
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "sky"
    | "secondary"
    | "purple"
    | "cyan"
    | "outline"
    | "default"
  icon?: React.ReactNode
}

export function StatusBadge({
  status,
  label,
  className,
  showDot = true,
  pulse,
  variant,
  icon,
}: StatusBadgeProps) {
  const normalized = (status || "").toLowerCase().trim()

  let resolvedVariant:
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "sky"
    | "secondary"
    | "purple"
    | "cyan"
    | "outline"
    | "default" = "secondary"
  let resolvedLabel = label || status || "—"
  let dotColor = "bg-muted-foreground"
  let shouldPulse = pulse ?? false

  switch (normalized) {
    case "active":
    case "aktif":
      resolvedVariant = "success"
      if (!label) {
        resolvedLabel = "Aktif"
      }
      dotColor = "bg-emerald-500"
      if (pulse === undefined) {
        shouldPulse = true
      }
      break

    case "completed":
    case "selesai":
    case "received":
    case "diterima":
    case "paid":
    case "lunas":
    case "approved":
    case "disetujui":
      resolvedVariant = "success"
      if (!label) {
        if (normalized.includes("paid") || normalized.includes("lunas")) {
          resolvedLabel = "Lunas"
        } else if (
          normalized.includes("approv") ||
          normalized.includes("setuju")
        ) {
          resolvedLabel = "Disetujui"
        } else {
          resolvedLabel = "Selesai"
        }
      }
      dotColor = "bg-emerald-500"
      break

    case "pending":
    case "menunggu":
    case "processing":
    case "proses":
    case "dalam_proses":
      resolvedVariant = "warning"
      if (!label) {
        resolvedLabel = "Dalam Proses"
      }
      dotColor = "bg-amber-500"
      if (pulse === undefined) {
        shouldPulse = true
      }
      break

    case "partially_received":
    case "partial":
    case "sebagian":
      resolvedVariant = "warning"
      if (!label) {
        resolvedLabel = "Sebagian"
      }
      dotColor = "bg-amber-500"
      break

    case "canceled":
    case "batal":
    case "failed":
    case "gagal":
    case "rejected":
    case "ditolak":
      resolvedVariant = "danger"
      if (!label) {
        resolvedLabel = "Dibatalkan"
      }
      dotColor = "bg-rose-500"
      break

    case "draft":
      resolvedVariant = "outline"
      if (!label) {
        resolvedLabel = "Draft"
      }
      dotColor = "bg-muted-foreground"
      break

    case "inactive":
    case "nonaktif":
    case "archived":
    case "diarsipkan":
      resolvedVariant = "secondary"
      if (!label) {
        resolvedLabel = "Non-Aktif"
      }
      dotColor = "bg-muted-foreground/60"
      break

    default:
      resolvedVariant = "secondary"
      break
  }

  if (variant) {
    resolvedVariant = variant
  }

  return (
    <Badge
      variant={resolvedVariant}
      className={cn("gap-1.5 font-bold select-none", className)}
    >
      {showDot && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          {shouldPulse && (
            <span
              className={cn(
                "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                dotColor
              )}
            />
          )}
          <span
            className={cn(
              "relative inline-flex h-1.5 w-1.5 rounded-full",
              dotColor
            )}
          />
        </span>
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="truncate">{resolvedLabel}</span>
    </Badge>
  )
}
