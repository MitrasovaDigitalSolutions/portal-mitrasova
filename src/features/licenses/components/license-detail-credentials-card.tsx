"use client"

import { useState, type JSX } from "react"
import {
  Check,
  Copy,
  Eye,
  EyeOff,
  KeyRound,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import type { License } from "../@types/license"

interface LicenseDetailCredentialsCardProps {
  license: License
}

export function LicenseDetailCredentialsCard({
  license,
}: LicenseDetailCredentialsCardProps): JSX.Element {
  const [showSecret, setShowSecret] = useState(false)
  const [copiedKey, setCopiedKey] = useState(false)
  const [copiedSecret, setCopiedSecret] = useState(false)

  const handleCopyKey = () => {
    void navigator.clipboard.writeText(license.license_key)
    setCopiedKey(true)
    toast.success("License Key disalin ke clipboard")
    setTimeout(() => setCopiedKey(false), 2000)
  }

  const handleCopySecret = () => {
    if (!license.license_secret) {
      toast.error("License secret tidak tersedia")
      return
    }
    void navigator.clipboard.writeText(license.license_secret)
    setCopiedSecret(true)
    toast.success("License Secret disalin ke clipboard")
    setTimeout(() => setCopiedSecret(false), 2000)
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-xs space-y-3">
      <div className="flex items-center justify-between pb-2.5 border-b border-border">
        <div className="flex items-center gap-2">
          <KeyRound size={15} className="text-muted-foreground" />
          <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Kredensial & Kunci Lisensi
          </h2>
        </div>
        <span className="text-[11px] text-muted-foreground">
          Gunakan pada konfigurasi (.env) aplikasi klien
        </span>
      </div>

      <div className="space-y-3 text-xs">
        {/* License Key */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-muted-foreground">
            License Key (Publik)
          </label>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={license.license_key}
              className="w-full h-9 px-3 font-mono text-xs rounded-lg border border-border bg-muted/40 text-foreground select-all focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyKey}
              className="h-9 px-3 text-xs shrink-0 gap-1.5 cursor-pointer"
            >
              {copiedKey ? (
                <>
                  <Check size={13} className="text-emerald-500" />
                  <span className="text-emerald-500">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Salin</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* License Secret */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-medium text-muted-foreground">
              License Secret (Privat)
            </label>
            <span className="text-[10px] text-muted-foreground">
              Jangan dibagikan ke pihak luar
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                readOnly
                type={showSecret ? "text" : "password"}
                value={license.license_secret || "••••••••••••••••••••••••••••••••"}
                className="w-full h-9 px-3 pr-10 font-mono text-xs rounded-lg border border-border bg-muted/40 text-foreground select-all focus:outline-none focus:ring-1 focus:ring-primary/40"
              />
              {license.license_secret && (
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                  title={showSecret ? "Sembunyikan Secret" : "Tampilkan Secret"}
                >
                  {showSecret ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!license.license_secret}
              onClick={handleCopySecret}
              className="h-9 px-3 text-xs shrink-0 gap-1.5 cursor-pointer"
            >
              {copiedSecret ? (
                <>
                  <Check size={13} className="text-emerald-500" />
                  <span className="text-emerald-500">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Salin</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
