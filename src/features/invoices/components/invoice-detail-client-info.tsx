"use client"

import * as React from "react"
import {
  Building,
  Check,
  Copy,
  KeyRound,
  Mail,
  Phone,
  Server,
  User,
} from "lucide-react"
import { toast } from "sonner"
import type {
  InvoiceClientRelation,
  InvoiceLicenseRelation,
} from "../@types/invoice"

interface InvoiceDetailClientInfoProps {
  client?: InvoiceClientRelation
  license?: InvoiceLicenseRelation
}

export function InvoiceDetailClientInfo({
  client,
  license,
}: InvoiceDetailClientInfoProps): React.JSX.Element {
  const [copiedKey, setCopiedKey] = React.useState(false)

  const copyLicenseKey = (key: string) => {
    void navigator.clipboard.writeText(key)
    setCopiedKey(true)
    setTimeout(() => setCopiedKey(false), 2000)
    toast.success("License key disalin ke clipboard")
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {/* Client Info Card */}
      <div className="space-y-2 rounded-xl border border-border/80 bg-card p-3 shadow-2xs sm:p-3.5">
        <div className="flex items-center gap-2 border-b border-border/60 pb-1.5 text-xs font-semibold text-foreground">
          <Building className="size-3.5 text-primary" />
          Informasi Pelanggan
        </div>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <User className="size-3 shrink-0 text-muted-foreground" />
            <span>{client?.nama_pemilik || "—"}</span>
          </div>
          {client?.nama_usaha && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building className="size-3 shrink-0 text-muted-foreground" />
              <span>{client.nama_usaha}</span>
            </div>
          )}
          {client?.email && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="size-3 shrink-0 text-muted-foreground" />
              <span className="truncate">{client.email}</span>
            </div>
          )}
          {client?.no_telepon && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="size-3 shrink-0 text-muted-foreground" />
              <span>{client.no_telepon}</span>
            </div>
          )}
        </div>
      </div>

      {/* License Info Card */}
      <div className="space-y-2 rounded-xl border border-border/80 bg-card p-3 shadow-2xs sm:p-3.5">
        <div className="flex items-center gap-2 border-b border-border/60 pb-1.5 text-xs font-semibold text-foreground">
          <Server className="size-3.5 text-emerald-500" />
          Lisensi / Produk Terkait
        </div>
        {license ? (
          <div className="space-y-1.5 text-xs">
            <div className="font-semibold text-foreground">
              {license.product?.name || "Produk Mitrasova"}
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Instance:</span>
              <span className="font-medium text-foreground">
                {license.nama_instance || "—"}
              </span>
            </div>
            {license.domain_instance && (
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Domain:</span>
                <span className="font-mono text-foreground">
                  {license.domain_instance}
                </span>
              </div>
            )}
            {license.license_key && (
              <div className="flex items-center justify-between border-t border-border/60 pt-1">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <KeyRound className="size-3" /> Key:
                </span>
                <div className="flex items-center gap-1 font-mono text-[11px] text-foreground">
                  <span>{license.license_key.slice(0, 14)}...</span>
                  <button
                    type="button"
                    onClick={() => copyLicenseKey(license.license_key || "")}
                    className="cursor-pointer rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                    title="Salin License Key"
                  >
                    {copiedKey ? (
                      <Check className="size-3 text-emerald-500" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-16 items-center justify-center text-muted-foreground italic">
            Layanan Umum / Tidak Terikat Lisensi
          </div>
        )}
      </div>
    </div>
  )
}
