import type { JSX } from "react"
import { Calendar, Globe, Layers, Radio, Server, Store } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { formatDate } from "@/utils"
import type { License } from "../@types/license"
import {
  SERVER_TYPES,
  SUBSCRIPTION_TYPES,
  formatCodeToTitle,
  getBusinessTypeBadge,
} from "../constants"

interface LicenseDetailOverviewCardProps {
  license: License
}

export function LicenseDetailOverviewCard({
  license,
}: LicenseDetailOverviewCardProps): JSX.Element {
  const subConfig = SUBSCRIPTION_TYPES[license.subscription_type]
  const serverConfig = license.server_type
    ? SERVER_TYPES[license.server_type]
    : undefined

  // Calculate days remaining
  let daysRemaining: number | null = null
  if (license.expires_at) {
    const diff = new Date(license.expires_at).getTime() - Date.now()
    daysRemaining = Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-xs">
      <div className="flex items-center justify-between border-b border-border pb-2.5">
        <div className="flex items-center gap-2">
          <Layers size={15} className="text-muted-foreground" />
          <h2 className="text-xs font-semibold tracking-wider text-foreground uppercase">
            Informasi & Konfigurasi Lisensi
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2 lg:grid-cols-3">
        {/* 1. Produk Software */}
        <div className="space-y-1 rounded-lg border border-border/70 bg-muted/20 p-3">
          <span className="block text-[11px] text-muted-foreground">
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
        <div className="space-y-1 rounded-lg border border-border/70 bg-muted/20 p-3">
          <span className="block text-[11px] text-muted-foreground">
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
        <div className="space-y-1 rounded-lg border border-border/70 bg-muted/20 p-3">
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Calendar size={11} /> Masa Berlaku
          </span>
          <p className="font-semibold text-foreground">
            {license.expires_at
              ? formatDate(license.expires_at)
              : "Permanen (Lifetime)"}
          </p>
          <p className="text-[11px]">
            {daysRemaining !== null ? (
              daysRemaining > 0 ? (
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  Sisa {daysRemaining} hari aktif
                </span>
              ) : (
                <span className="font-medium text-destructive">
                  Kedaluwarsa ({Math.abs(daysRemaining)} hari lalu)
                </span>
              )
            ) : (
              <span className="text-muted-foreground">Aktif selamanya</span>
            )}
          </p>
        </div>

        {/* 4. Domain & IP Terikat */}
        <div className="space-y-1 rounded-lg border border-border/70 bg-muted/20 p-3">
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Globe size={11} /> Domain Binding
          </span>
          <p className="truncate font-semibold text-foreground">
            {license.domain_instance || "Semua domain diizinkan"}
          </p>
          <p className="truncate text-[11px] text-muted-foreground">
            IP Terakhir: {license.last_ip_address || "Belum terekam"}
          </p>
        </div>

        {/* 5. Tipe Server Hosting */}
        <div className="space-y-1 rounded-lg border border-border/70 bg-muted/20 p-3">
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Server size={11} /> Hosting Server
          </span>
          <p className="font-semibold text-foreground">
            {license.serverPackage?.nama ??
              license.server_package?.nama ??
              serverConfig?.label ??
              formatCodeToTitle(license.server_type)}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {license.serverPackage
              ? `${license.serverPackage.cpu || ""} ${license.serverPackage.ram || ""} ${license.serverPackage.storage || ""}`.trim() ||
                license.serverPackage.code
              : (serverConfig?.description ?? "Verifikasi instance otomatis")}
          </p>
        </div>


        {/* 7. Jenis Bisnis / Preset */}
        <div className="space-y-1 rounded-lg border border-border/70 bg-muted/20 p-3">
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Store size={11} /> Jenis Bisnis / Preset
          </span>
          <div className="pt-0.5">
            {(() => {
              const badgeInfo = getBusinessTypeBadge(license.business_type)
              return (
                <Badge
                  variant="outline"
                  className={cn(
                    "border px-2 py-0.5 text-xs font-semibold",
                    badgeInfo.className
                  )}
                >
                  {badgeInfo.label}
                </Badge>
              )
            })()}
          </div>
          <p className="text-[11px] text-muted-foreground">
            {license.business_type === "confectionery"
              ? "Modul Manufaktur & Konsinyasi"
              : license.business_type === "pharmacy"
                ? "Modul Resep, Batch & Expired"
                : "Standar POS Retail & Kasir"}
          </p>
        </div>

        {/* 6. Heartbeat Terakhir */}
        <div className="space-y-1 rounded-lg border border-border/70 bg-muted/20 p-3">
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
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
