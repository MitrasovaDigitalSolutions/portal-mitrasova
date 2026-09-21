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
import type { InvoiceClientRelation, InvoiceLicenseRelation } from "../@types/invoice"

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Client Info Card */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-2.5">
        <div className="flex items-center gap-2 font-semibold text-foreground border-b border-border/60 pb-2">
          <Building className="size-3.5 text-primary" />
          Informasi Pelanggan
        </div>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <User className="size-3 text-muted-foreground shrink-0" />
            <span>{client?.nama_pemilik || "—"}</span>
          </div>
          {client?.nama_usaha && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building className="size-3 text-muted-foreground shrink-0" />
              <span>{client.nama_usaha}</span>
            </div>
          )}
          {client?.email && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="size-3 text-muted-foreground shrink-0" />
              <span>{client.email}</span>
            </div>
          )}
          {client?.no_telepon && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="size-3 text-muted-foreground shrink-0" />
              <span>{client.no_telepon}</span>
            </div>
          )}
        </div>
      </div>

      {/* License Info Card */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-2.5">
        <div className="flex items-center gap-2 font-semibold text-foreground border-b border-border/60 pb-2">
          <Server className="size-3.5 text-emerald-500" />
          Lisensi / Produk Terkait
        </div>
        {license ? (
          <div className="space-y-1.5 text-xs">
            <div className="font-semibold text-foreground">
              {license.product?.name || "Produk Mitrasova"}
            </div>
            <div className="text-muted-foreground flex items-center justify-between">
              <span>Instance:</span>
              <span className="font-medium text-foreground">
                {license.nama_instance || "—"}
              </span>
            </div>
            {license.domain_instance && (
              <div className="text-muted-foreground flex items-center justify-between">
                <span>Domain:</span>
                <span className="font-mono text-foreground">
                  {license.domain_instance}
                </span>
              </div>
            )}
            {license.license_key && (
              <div className="flex items-center justify-between pt-1 border-t border-border/60">
                <span className="text-muted-foreground flex items-center gap-1">
                  <KeyRound className="size-3" /> Key:
                </span>
                <div className="flex items-center gap-1 font-mono text-[11px] text-foreground">
                  <span>{license.license_key.slice(0, 14)}...</span>
                  <button
                    type="button"
                    onClick={() => copyLicenseKey(license.license_key || "")}
                    className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
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
          <div className="flex items-center justify-center h-16 text-muted-foreground italic">
            Layanan Umum / Tidak Terikat Lisensi
          </div>
        )}
      </div>
    </div>
  )
}
