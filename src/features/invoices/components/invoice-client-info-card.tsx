"use client"

import type React from "react"
import {
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock,
  Info,
  Mail,
  MapPin,
  Phone,
  Server,
  User,
  XCircle,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import type { Client } from "@/features/clients"
import type { License } from "@/features/clients"
import { cn } from "@/lib/utils"
import { formatDate } from "@/utils"

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
    className: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  },
  expired: {
    label: "Kedaluwarsa",
    icon: XCircle,
    className: "text-destructive bg-destructive/10 border-destructive/20",
  },
  suspended: {
    label: "Ditangguhkan",
    icon: XCircle,
    className: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  },
  trial: {
    label: "Trial",
    icon: Clock,
    className: "text-blue-500 bg-blue-500/10 border-blue-500/20",
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
    <Card className="rounded-2xl border-border bg-card shadow-xs overflow-hidden">
      {/* Client Info Header */}
      <div className="bg-gradient-to-br from-primary/8 via-primary/4 to-transparent p-4 border-b border-border/60">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary font-bold text-sm">
            {client.nama_pemilik.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-foreground leading-snug truncate">
              {client.nama_pemilik}
            </p>
            <p className="text-[11px] text-muted-foreground truncate mt-0.5">
              {client.nama_perusahaan}
            </p>
          </div>
        </div>
      </div>

      {/* Client Details */}
      <div className="p-4 space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Info Pelanggan
        </p>
        <div className="space-y-1.5">
          {client.email && (
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Mail className="size-3 shrink-0 text-primary/70" />
              <span className="truncate">{client.email}</span>
            </div>
          )}
          {client.telepon && (
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Phone className="size-3 shrink-0 text-primary/70" />
              <span>{client.telepon}</span>
            </div>
          )}
          {client.nama_perusahaan && (
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Building2 className="size-3 shrink-0 text-primary/70" />
              <span className="truncate">{client.nama_perusahaan}</span>
            </div>
          )}
          {client.alamat && (
            <div className="flex items-start gap-2 text-[11px] text-muted-foreground">
              <MapPin className="size-3 shrink-0 mt-0.5 text-primary/70" />
              <span className="line-clamp-2">{client.alamat}</span>
            </div>
          )}
        </div>

        {/* License Info */}
        {license && (
          <>
            <div className="border-t border-border/60 pt-3 mt-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Lisensi Terkait
              </p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[11px] text-foreground font-medium">
                  <Server className="size-3 shrink-0 text-primary/70" />
                  <span className="truncate">{license.nama_instance}</span>
                </div>
                {license.domain_instance && (
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <Info className="size-3 shrink-0" />
                    <span className="font-mono truncate text-[10px]">
                      {license.domain_instance}
                    </span>
                  </div>
                )}
                {license.expires_at && (
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <CalendarClock className="size-3 shrink-0" />
                    <span>Exp: {formatDate(license.expires_at)}</span>
                  </div>
                )}
                {licenseStatus && LicenseStatusIcon && (
                  <div
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[10px] font-semibold",
                      licenseStatus.className
                    )}
                  >
                    <LicenseStatusIcon className="size-3" />
                    <span>{licenseStatus.label}</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {!license && (
          <div className="border-t border-border/60 pt-3 mt-3">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <User className="size-3 shrink-0" />
              <span>Tidak ada lisensi terkait (invoice umum)</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
