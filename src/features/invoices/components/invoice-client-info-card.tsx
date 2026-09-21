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
  if (!client) { return null }

  const licenseStatus =
    license?.status ? (LICENSE_STATUS_CONFIG[license.status] ?? null) : null
  const LicenseStatusIcon = licenseStatus?.icon

  return (
    <Card className="rounded-xl border-border bg-card shadow-xs overflow-hidden">
      {/* Client row */}
      <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-border/60">
        {/* Avatar */}
        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary font-bold text-[11px]">
          {client.nama_pemilik.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-foreground truncate leading-tight">
            {client.nama_pemilik}
          </p>
          <p className="text-[10px] text-muted-foreground truncate leading-tight">
            {client.nama_perusahaan}
          </p>
        </div>
      </div>

      {/* Contact info row */}
      <div className="flex items-center gap-3 px-3 py-2 text-[10px] text-muted-foreground flex-wrap border-b border-border/40">
        {client.email && (
          <span className="flex items-center gap-1 min-w-0 max-w-full">
            <Mail className="size-2.5 shrink-0" />
            <span className="truncate">{client.email}</span>
          </span>
        )}
        {client.telepon && (
          <span className="flex items-center gap-1 shrink-0">
            <Phone className="size-2.5 shrink-0" />
            <span>{client.telepon}</span>
          </span>
        )}
        {client.nama_perusahaan && (
          <span className="flex items-center gap-1 min-w-0">
            <Building2 className="size-2.5 shrink-0" />
            <span className="truncate">{client.nama_perusahaan}</span>
          </span>
        )}
      </div>

      {/* License row (if selected) */}
      {license ? (
        <div className="flex items-center gap-2 px-3 py-2 text-[10px]">
          <Server className="size-2.5 shrink-0 text-primary/70" />
          <span className="font-medium text-foreground truncate flex-1">
            {license.nama_instance}
          </span>
          {license.expires_at && (
            <span className="flex items-center gap-1 text-muted-foreground shrink-0">
              <CalendarClock className="size-2.5" />
              {formatDate(license.expires_at)}
            </span>
          )}
          {licenseStatus && LicenseStatusIcon && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[9px] font-semibold shrink-0",
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
