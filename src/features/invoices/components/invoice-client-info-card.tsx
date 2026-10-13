"use client"

import type React from "react"
import {
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  Server,
  XCircle,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { formatDate } from "@/utils"
import type { Client, License } from "@/features/clients"

interface InvoiceClientInfoCardProps {
  client?: Client
  license?: License | null
}

const LICENSE_STATUS_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; className: string }
> = {
  active: {
    label: "Aktif",
    icon: CheckCircle2,
    className: "text-emerald-600 bg-emerald-500/10 border-emerald-500/25",
  },
  expired: {
    label: "Expired",
    icon: XCircle,
    className: "text-destructive bg-destructive/10 border-destructive/25",
  },
  suspended: {
    label: "Suspended",
    icon: XCircle,
    className: "text-amber-600 bg-amber-500/10 border-amber-500/25",
  },
  trial: {
    label: "Trial",
    icon: Clock,
    className: "text-blue-600 bg-blue-500/10 border-blue-500/25",
  },
}

export function InvoiceClientInfoCard({
  client,
  license,
}: InvoiceClientInfoCardProps): React.JSX.Element | null {
  if (!client) {
    return null
  }

  const licenseStatus = license?.status
    ? (LICENSE_STATUS_CONFIG[license.status] ?? null)
    : null
  const LicenseStatusIcon = licenseStatus?.icon

  return (
    <Card className="overflow-hidden rounded-xl border-border bg-card shadow-xs">
      {/* Client row */}
      <div className="flex items-center gap-2.5 border-b border-border/60 px-3 py-2.5">
        {/* Avatar */}
        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-[11px] font-bold text-primary">
          {client.nama_pemilik.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs leading-tight font-semibold text-foreground">
            {client.nama_pemilik}
          </p>
          <p className="truncate text-[10px] leading-tight text-muted-foreground">
            {client.nama_perusahaan}
          </p>
        </div>
      </div>

      {/* Contact info row */}
      <div className="flex flex-wrap items-center gap-3 border-b border-border/40 px-3 py-2 text-[10px] text-muted-foreground">
        {client.email && (
          <span className="flex max-w-full min-w-0 items-center gap-1">
            <Mail className="size-2.5 shrink-0" />
            <span className="truncate">{client.email}</span>
          </span>
        )}
        {client.telepon && (
          <span className="flex shrink-0 items-center gap-1">
            <Phone className="size-2.5 shrink-0" />
            <span>{client.telepon}</span>
          </span>
        )}
        {client.nama_perusahaan && (
          <span className="flex min-w-0 items-center gap-1">
            <Building2 className="size-2.5 shrink-0" />
            <span className="truncate">{client.nama_perusahaan}</span>
          </span>
        )}
      </div>

      {/* License row (if selected) */}
      {license ? (
        <div className="flex items-center gap-2 px-3 py-2 text-[10px]">
          <Server className="size-2.5 shrink-0 text-primary/70" />
          <span className="flex-1 truncate font-medium text-foreground">
            {license.nama_instance}
          </span>
          {license.expires_at && (
            <span className="flex shrink-0 items-center gap-1 text-muted-foreground">
              <CalendarClock className="size-2.5" />
              {formatDate(license.expires_at)}
            </span>
          )}
          {licenseStatus && LicenseStatusIcon && (
            <span
              className={cn(
                "inline-flex shrink-0 items-center gap-1 rounded border px-1.5 py-0.5 text-[9px] font-semibold",
                licenseStatus.className
              )}
            >
              <LicenseStatusIcon className="size-2.5" />
              {licenseStatus.label}
            </span>
          )}
        </div>
      ) : (
        <div className="px-3 py-2 text-[10px] text-muted-foreground/70 italic">
          Tidak ada lisensi terkait (invoice umum)
        </div>
      )}
    </Card>
  )
}
