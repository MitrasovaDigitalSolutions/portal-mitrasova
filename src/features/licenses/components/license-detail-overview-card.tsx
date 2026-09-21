import type { JSX } from "react"
import { Calendar, Globe, Layers, Radio, Server } from "lucide-react"
import { formatDate } from "@/utils"
import type { License } from "../@types/license"
import { SERVER_TYPES, SUBSCRIPTION_TYPES, formatCodeToTitle } from "../constants"

interface LicenseDetailOverviewCardProps {
  license: License
}

export function LicenseDetailOverviewCard({
  license,
}: LicenseDetailOverviewCardProps): JSX.Element {
  const subConfig = SUBSCRIPTION_TYPES[license.subscription_type]
  const serverConfig = SERVER_TYPES[license.server_type]

  // Calculate days remaining
  let daysRemaining: number | null = null
  if (license.expires_at) {
    const diff = new Date(license.expires_at).getTime() - Date.now()
    daysRemaining = Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-xs space-y-3">
      <div className="flex items-center justify-between pb-2.5 border-b border-border">
        <div className="flex items-center gap-2">
          <Layers size={15} className="text-muted-foreground" />
          <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Informasi & Konfigurasi Lisensi
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
        {/* 1. Produk Software */}
        <div className="p-3 rounded-lg border border-border/70 bg-muted/20 space-y-1">
          <span className="text-[11px] text-muted-foreground block">
            Produk Software
          </span>
          <p className="font-semibold text-foreground">
            {license.product?.nama || "Software"}
          </p>
          <p className="text-[11px] text-muted-foreground">
            Kode Produk: {license.product?.code || "-"}
          </p>
        </div>

        {/* 2. Paket & Grace Period */}
        <div className="p-3 rounded-lg border border-border/70 bg-muted/20 space-y-1">
          <span className="text-[11px] text-muted-foreground block">
            Paket Langganan
          </span>
          <p className="font-semibold text-foreground">
            {subConfig?.label ?? formatCodeToTitle(license.subscription_type)}
          </p>
          <p className="text-[11px] text-muted-foreground">
            Masa Tenggang: {license.grace_period_days} hari
          </p>
        </div>

        {/* 3. Masa Berlaku */}
        <div className="p-3 rounded-lg border border-border/70 bg-muted/20 space-y-1">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Calendar size={11} /> Masa Berlaku
          </span>
          <p className="font-semibold text-foreground">
            {license.expires_at ? formatDate(license.expires_at) : "Permanen (Lifetime)"}
          </p>
          <p className="text-[11px]">
            {daysRemaining !== null ? (
              daysRemaining > 0 ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  Sisa {daysRemaining} hari aktif
                </span>
              ) : (
                <span className="text-destructive font-medium">
                  Kedaluwarsa ({Math.abs(daysRemaining)} hari lalu)
                </span>
              )
            ) : (
              <span className="text-muted-foreground">Aktif selamanya</span>
            )}
          </p>
        </div>

        {/* 4. Domain & IP Terikat */}
        <div className="p-3 rounded-lg border border-border/70 bg-muted/20 space-y-1">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Globe size={11} /> Domain Binding
          </span>
          <p className="font-semibold text-foreground truncate">
            {license.domain_instance || "Semua domain diizinkan"}
          </p>
          <p className="text-[11px] text-muted-foreground truncate">
            IP Terakhir: {license.last_ip_address || "Belum terekam"}
          </p>
        </div>

        {/* 5. Tipe Server */}
        <div className="p-3 rounded-lg border border-border/70 bg-muted/20 space-y-1">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Server size={11} /> Deployment Server
          </span>
          <p className="font-semibold text-foreground">
            {serverConfig?.label ?? formatCodeToTitle(license.server_type)}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {serverConfig?.description ?? "Verifikasi instance otomatis"}
          </p>
        </div>

        {/* 6. Heartbeat Terakhir */}
        <div className="p-3 rounded-lg border border-border/70 bg-muted/20 space-y-1">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Radio size={11} /> Verifikasi Terakhir
          </span>
          <p className="font-semibold text-foreground">
            {license.last_heartbeat_at
              ? formatDate(license.last_heartbeat_at)
              : "Belum pernah verifikasi"}
          </p>
          <p className="text-[11px] text-muted-foreground">
            Dibuat: {formatDate(license.created_at)}
          </p>
        </div>
      </div>
    </div>
  )
}
