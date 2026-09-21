"use client"

import { Badge } from "@/components/ui/badge"
import { BaseDialog } from "@/components/ui/base-dialog"
import { StatusBadge } from "@/components/ui/status-badge"
import {
  Check,
  Copy,
  Eye,
  EyeOff,
  Globe,
  Puzzle,
  ShieldCheck
} from "lucide-react"
import { useState, type JSX } from "react"
import { toast } from "sonner"
import type { License } from "../@types/license"
import { SERVER_TYPES, SUBSCRIPTION_TYPES } from "../constants"

interface LicenseDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  license: License | null
}

export function LicenseDetailDialog({
  open,
  onOpenChange,
  license,
}: LicenseDetailDialogProps): JSX.Element {
  const [showSecret, setShowSecret] = useState(false)
  const [copiedKey, setCopiedKey] = useState(false)
  const [copiedSecret, setCopiedSecret] = useState(false)

  if (!license) {
    return <></>
  }

  const subConfig = SUBSCRIPTION_TYPES[license.subscription_type]
  const serverConfig = SERVER_TYPES[license.server_type]
  const addons = license.licenseAddons ?? license.license_addons ?? []

  const handleCopyKey = () => {
    void navigator.clipboard.writeText(license.license_key)
    setCopiedKey(true)
    toast.success("License Key disalin ke clipboard")
    setTimeout(() => setCopiedKey(false), 2000)
  }

  const handleCopySecret = () => {
    if (!license.license_secret) {
      return
    }
    void navigator.clipboard.writeText(license.license_secret)
    setCopiedSecret(true)
    toast.success("License Secret disalin ke clipboard")
    setTimeout(() => setCopiedSecret(false), 2000)
  }

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title={
        <div>
          <div className="text-sm font-bold text-foreground">
            Inspeksi Lisensi: {license.nama_instance}
          </div>
          <p className="text-[11px] font-normal text-muted-foreground">
            Rincian kredensial otentikasi, binding domain, dan modul addon.
          </p>
        </div>
      }
      className="sm:max-w-2xl"
    >
      <div className="space-y-4 text-xs">
        {/* Top summary row */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-muted/40 border border-border">
          <div className="space-y-0.5">
            <span className="text-[11px] text-muted-foreground">Produk Software</span>
            <p className="font-semibold text-foreground">
              {license.product?.nama || "Software"} (
              <span className="font-mono text-primary">{license.product?.code || "APP"}</span>)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={license.status} />
            <Badge variant={subConfig?.badgeVariant ?? "secondary"}>
              {subConfig?.label ?? license.subscription_type}
            </Badge>
          </div>
        </div>

        {/* License Key & Secret Section */}
        <div className="space-y-3 p-3.5 rounded-xl border border-border bg-card">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              License Key
            </label>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={license.license_key}
                className="w-full h-9 px-3 font-mono text-xs rounded-lg border border-border bg-muted/50 text-foreground select-all"
              />
              <button
                type="button"
                onClick={handleCopyKey}
                className="h-9 px-3 rounded-lg border border-border bg-card hover:bg-muted text-foreground flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
              >
                {copiedKey ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                <span className="text-xs">Salin</span>
              </button>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-border/60">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              License Secret (Private Token)
            </label>
            <div className="flex items-center gap-2">
              <input
                readOnly
                type={showSecret ? "text" : "password"}
                value={license.license_secret || "Rahasia belum digenerate"}
                className="w-full h-9 px-3 font-mono text-xs rounded-lg border border-border bg-muted/50 text-foreground select-all"
              />
              <button
                type="button"
                onClick={() => setShowSecret((prev) => !prev)}
                className="h-9 px-3 rounded-lg border border-border bg-card hover:bg-muted text-foreground flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                title={showSecret ? "Sembunyikan secret" : "Tampilkan secret"}
              >
                {showSecret ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <button
                type="button"
                onClick={handleCopySecret}
                disabled={!license.license_secret}
                className="h-9 px-3 rounded-lg border border-border bg-card hover:bg-muted text-foreground flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
              >
                {copiedSecret ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                <span className="text-xs">Salin</span>
              </button>
            </div>
          </div>
        </div>

        {/* Domain, Server, and Heartbeat info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-xl border border-border bg-card space-y-2">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <Globe size={13} className="text-primary" />
              <span>Binding Domain & Server</span>
            </div>
            <div className="space-y-1 text-muted-foreground text-[11px]">
              <p>Domain: <span className="font-mono text-foreground font-semibold">{license.domain_instance || "—"}</span></p>
              <p>Server: <span className="text-foreground">{serverConfig?.label ?? license.server_type}</span></p>
              <p>IP Terakhir: <span className="font-mono text-foreground">{license.last_ip_address || "Belum ada koneksi"}</span></p>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-border bg-card space-y-2">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <ShieldCheck size={13} className="text-emerald-500" />
              <span>Heartbeat & Masa Aktif</span>
            </div>
            <div className="space-y-1 text-muted-foreground text-[11px]">
              <p>Heartbeat: <span className="text-foreground font-mono">{license.last_heartbeat_at ? new Date(license.last_heartbeat_at).toLocaleString("id-ID") : "Belum pernah"}</span></p>
              <p>Kedaluwarsa: <span className="text-foreground font-mono">{license.expires_at ? new Date(license.expires_at).toLocaleDateString("id-ID") : "Lifetime"}</span></p>
              <p>Grace Period: <span className="text-foreground">{license.grace_period_days} Hari</span></p>
            </div>
          </div>
        </div>

        {/* Addons Section */}
        <div className="p-3 rounded-xl border border-border bg-card space-y-2">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <Puzzle size={13} className="text-indigo-500" />
            <span>Modul Addon Terpasang ({addons.length})</span>
          </div>
          {addons.length === 0 ? (
            <p className="text-[11px] text-muted-foreground">Belum ada modul addon yang terpasang pada lisensi ini.</p>
          ) : (
            <div className="flex flex-wrap gap-2 pt-1">
              {addons.map((addon) => (
                <div key={addon.id} className="flex items-center gap-2 px-2.5 py-1 rounded-lg border border-border bg-muted/30 text-xs">
                  <span className="font-semibold text-foreground">{addon.productAddon?.nama || addon.product_addon?.nama || "Addon"}</span>
                  <StatusBadge status={addon.status} className="text-[10px] py-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </BaseDialog>
  )
}
