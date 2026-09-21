"use client"

import type { ColumnDef } from "@tanstack/react-table"
import {
  Check,
  Copy,
  Globe,
  Puzzle,
  Server,
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { SUBSCRIPTION_TYPES, SERVER_TYPES, formatCodeToTitle } from "../constants"
import type { License } from "../@types/license"

export interface LicenseColumnActions {
  onInspectDetail: (license: License) => void
  onEdit: (license: License) => void
  onOrder?: (license: License) => void
  onExtend?: (license: License) => void
  onSyncAddons?: (license: License) => void
  onResetDomain: (license: License) => void
  onRegenerateSecret: (license: License) => void
  onDelete: (license: License) => void
}

function LicenseKeyCell({ licenseKey }: { licenseKey: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    void navigator.clipboard.writeText(licenseKey)
    setCopied(true)
    toast.success("License key disalin ke clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center gap-1.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-muted/60 text-foreground border border-border/80 truncate max-w-[150px]">
              {licenseKey}
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs font-mono">
            {licenseKey}
          </TooltipContent>
        </Tooltip>
        <button
          type="button"
          onClick={handleCopy}
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
          title="Salin License Key"
        >
          {copied ? (
            <Check size={12} className="text-emerald-500" />
          ) : (
            <Copy size={12} />
          )}
        </button>
      </div>
    </TooltipProvider>
  )
}

export function getLicenseColumns(): ColumnDef<License>[] {
  return [
    {
      accessorKey: "product",
      header: "Produk Software",
      size: 220,
      cell: ({ row }) => {
        const license = row.original
        const product = license.product
        return (
          <div className="space-y-1">
            <span className="font-semibold text-xs text-foreground block truncate">
              {product?.nama || "Software Instance"}
            </span>
            {product?.code && (
              <span className="font-mono text-[10px] font-bold text-primary px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20">
                {product.code}
              </span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "nama_instance",
      header: "Instance & Domain",
      size: 260,
      cell: ({ row }) => {
        const license = row.original
        const hasDomain = Boolean(license.domain_instance)

        return (
          <TooltipProvider delayDuration={200}>
            <div className="space-y-1 max-w-[240px]">
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="font-medium text-xs text-foreground truncate cursor-default">
                    {license.nama_instance}
                  </p>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs text-xs">
                  {license.nama_instance}
                </TooltipContent>
              </Tooltip>

              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground truncate">
                <Globe size={11} className="shrink-0 text-muted-foreground" />
                <span className="truncate font-mono">
                  {license.domain_instance || "Belum terikat"}
                </span>
                {hasDomain && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
                    Bound
                  </span>
                )}
              </div>
            </div>
          </TooltipProvider>
        )
      },
    },
    {
      accessorKey: "license_key",
      header: "License Key",
      size: 190,
      cell: ({ row }) => (
        <LicenseKeyCell licenseKey={row.original.license_key} />
      ),
    },
    {
      id: "subscription_server",
      header: "Paket & Server",
      size: 180,
      cell: ({ row }) => {
        const license = row.original
        const subConfig = SUBSCRIPTION_TYPES[license.subscription_type]
        const serverConfig = SERVER_TYPES[license.server_type]

        return (
          <div className="space-y-1">
            <Badge
              variant={subConfig?.badgeVariant ?? "secondary"}
              className="text-[10px] py-0 font-medium"
            >
              {subConfig?.label.split(" ")[0] ?? formatCodeToTitle(license.subscription_type)}
            </Badge>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Server size={10} className="shrink-0" />
              <span className="truncate">{serverConfig?.label ?? formatCodeToTitle(license.server_type)}</span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 130,
      cell: ({ row }) => {
        const status = row.original.status
        return <StatusBadge status={status} className="capitalize text-[11px]" />
      },
    },
    {
      accessorKey: "expires_at",
      header: "Masa Berlaku",
      size: 160,
      cell: ({ row }) => {
        const license = row.original
        if (license.subscription_type === "lifetime" || !license.expires_at) {
          return (
            <Badge variant="outline" className="text-[10px] font-normal text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
              Lifetime
            </Badge>
          )
        }

        const expiryDate = new Date(license.expires_at)
        const now = new Date()
        const isPast = expiryDate < now
        const formatted = expiryDate.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })

        return (
          <div className="space-y-0.5">
            <span
              className={`text-xs font-mono ${
                isPast ? "text-destructive font-semibold" : "text-foreground"
              }`}
            >
              {formatted}
            </span>
            {isPast && (
              <span className="block text-[10px] text-amber-500 font-medium">
                Grace period {license.grace_period_days} hari
              </span>
            )}
          </div>
        )
      },
    },
    {
      id: "addons",
      header: "Addon",
      size: 100,
      cell: ({ row }) => {
        const count =
          row.original.licenseAddons?.length ??
          row.original.license_addons?.length ??
          0
        return (
          <Badge variant="outline" className="text-[11px] font-mono gap-1">
            <Puzzle size={10} />
            <span>{count}</span>
          </Badge>
        )
      },
    },
  ]
}
