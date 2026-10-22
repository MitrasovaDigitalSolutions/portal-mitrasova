"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Check, Copy, Globe, Puzzle, Server } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  SUBSCRIPTION_TYPES,
  SERVER_TYPES,
  formatCodeToTitle,
  getBusinessTypeBadge,
} from "../constants"
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
            <span className="max-w-[150px] truncate rounded-md border border-border/80 bg-muted/60 px-2 py-0.5 font-mono text-xs font-semibold text-foreground">
              {licenseKey}
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" className="font-mono text-xs">
            {licenseKey}
          </TooltipContent>
        </Tooltip>
        <button
          type="button"
          onClick={handleCopy}
          className="cursor-pointer rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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
      enableSorting: false,
      size: 220,
      cell: ({ row }) => {
        const license = row.original
        const product = license.product
        return (
          <div className="space-y-1">
            <span className="block truncate text-xs font-semibold text-foreground">
              {product?.nama || "Software Instance"}
            </span>
            {product?.code && (
              <span className="rounded border border-primary/20 bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-primary">
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
            <div className="max-w-[240px] space-y-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="cursor-default truncate text-xs font-medium text-foreground">
                    {license.nama_instance}
                  </p>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs text-xs">
                  {license.nama_instance}
                </TooltipContent>
              </Tooltip>

              <div className="flex items-center gap-1.5 truncate text-[11px] text-muted-foreground">
                <Globe size={11} className="shrink-0 text-muted-foreground" />
                <span className="truncate font-mono">
                  {license.domain_instance || "Belum terikat"}
                </span>
                {hasDomain && (
                  <span className="py-0.2 rounded-full bg-emerald-500/10 px-1.5 text-[9px] font-medium text-emerald-600 dark:text-emerald-400">
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
      accessorKey: "business_type",
      header: "Jenis Bisnis",
      size: 130,
      cell: ({ row }) => {
        const type = row.original.business_type ?? "retail"
        const badgeInfo = getBusinessTypeBadge(type)
        return (
          <Badge
            variant="outline"
            className={cn(
              "border px-2 py-0.5 text-[10px] font-medium",
              badgeInfo.className
            )}
          >
            {badgeInfo.label}
          </Badge>
        )
      },
    },
    {
      id: "subscription_server",
      header: "Paket & Server",
      enableSorting: false,
      size: 180,
      cell: ({ row }) => {
        const license = row.original
        const subConfig = SUBSCRIPTION_TYPES[license.subscription_type]
        const serverName =
          license.serverPackage?.nama ??
          license.server_package?.nama ??
          SERVER_TYPES[license.server_type as string]?.label ??
          formatCodeToTitle(license.server_type)

        return (
          <div className="space-y-1">
            <Badge
              variant={subConfig?.badgeVariant ?? "secondary"}
              className="py-0 text-[10px] font-medium"
            >
              {subConfig?.label.split(" ")[0] ??
                formatCodeToTitle(license.subscription_type)}
            </Badge>
            <div
              className="flex max-w-[170px] items-center gap-1 truncate text-[11px] text-muted-foreground"
              title={serverName}
            >
              <Server size={10} className="shrink-0" />
              <span className="truncate">{serverName}</span>
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
        return (
          <StatusBadge status={status} className="text-[11px] capitalize" />
        )
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
            <Badge
              variant="outline"
              className="border-emerald-500/30 text-[10px] font-normal text-emerald-600 dark:text-emerald-400"
            >
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
              className={`font-mono text-xs ${
                isPast ? "font-semibold text-destructive" : "text-foreground"
              }`}
            >
              {formatted}
            </span>
            {isPast && (
              <span className="block text-[10px] font-medium text-amber-500">
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
          <Badge variant="outline" className="gap-1 font-mono text-[11px]">
            <Puzzle size={10} />
            <span>{count}</span>
          </Badge>
        )
      },
    },
  ]
}
