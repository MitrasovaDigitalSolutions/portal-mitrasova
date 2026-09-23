"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { CheckCircle2, Percent, Tag, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { formatCurrency, formatDate } from "@/utils"
import type { Coupon } from "../@types/coupon"

export function getCouponColumns(): ColumnDef<Coupon>[] {
  return [
    {
      accessorKey: "code",
      header: "Kode Kupon",
      size: 150,
      cell: ({ row }) => {
        const coupon = row.original
        return (
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 whitespace-nowrap shadow-2xs">
              {coupon.code}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "name",
      header: "Nama Promo",
      size: 300,
      cell: ({ row }) => {
        const coupon = row.original
        return (
          <TooltipProvider delayDuration={200}>
            <div className="flex items-center gap-2.5 max-w-[290px]">
              <div className="flex size-7.5 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-2xs">
                <Tag size={14} />
              </div>
              <div className="min-w-0 flex-1 space-y-0.5">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="font-semibold text-xs text-foreground block truncate max-w-full">
                      {coupon.name}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs text-xs">
                    <p className="font-semibold">{coupon.name}</p>
                    {coupon.description && (
                      <p className="text-zinc-400 text-[11px] leading-relaxed mt-0.5">
                        {coupon.description}
                      </p>
                    )}
                  </TooltipContent>
                </Tooltip>

                {coupon.description ? (
                  <div className="text-[11px] text-muted-foreground truncate leading-tight">
                    {coupon.description}
                  </div>
                ) : (
                  <div className="text-[11px] text-muted-foreground/60 italic">
                    Tidak ada deskripsi
                  </div>
                )}
              </div>
            </div>
          </TooltipProvider>
        )
      },
    },
    {
      id: "discount",
      header: "Nilai Diskon",
      size: 160,
      cell: ({ row }) => {
        const { discount_type, discount_value, max_discount_amount } = row.original
        const isPercent = discount_type === "percentage"

        return (
          <div className="space-y-0.5 text-xs font-mono">
            <div className="flex items-center gap-1 font-semibold text-foreground">
              {isPercent ? (
                <>
                  <Percent size={12} className="text-amber-600" />
                  <span>{discount_value}%</span>
                </>
              ) : (
                <span>{formatCurrency(discount_value)}</span>
              )}
            </div>
            {isPercent && max_discount_amount && (
              <div className="text-[10px] text-muted-foreground">
                Maks: {formatCurrency(max_discount_amount)}
              </div>
            )}
          </div>
        )
      },
    },
    {
      id: "terms",
      header: "Ketentuan Berlaku",
      size: 170,
      cell: ({ row }) => {
        const { min_order_amount, applicable_period } = row.original
        const periodText =
          applicable_period === "monthly"
            ? "Bulanan Saja"
            : applicable_period === "annual"
              ? "Tahunan Saja"
              : "Semua Periode"

        return (
          <div className="space-y-0.5 text-xs">
            <div className="text-foreground text-[11px] font-medium">
              {periodText}
            </div>
            <div className="text-[10px] text-muted-foreground font-mono">
              Min: {min_order_amount ? formatCurrency(min_order_amount) : "Rp 0"}
            </div>
          </div>
        )
      },
    },
    {
      id: "usage",
      header: "Penggunaan",
      size: 130,
      cell: ({ row }) => {
        const used = row.original.usages_count ?? 0
        const max = row.original.max_uses
        return (
          <div className="text-xs font-mono">
            <span className="font-semibold text-foreground">{used}</span>
            <span className="text-muted-foreground"> / {max ? `${max}x` : "∞"}</span>
          </div>
        )
      },
    },
    {
      id: "validity",
      header: "Masa Berlaku",
      size: 160,
      cell: ({ row }) => {
        const { starts_at, expires_at } = row.original
        if (!starts_at && !expires_at) {
          return <span className="text-xs text-muted-foreground">Selamanya</span>
        }
        return (
          <div className="space-y-0.5 text-[11px]">
            {starts_at && (
              <div className="text-muted-foreground">
                Mulai: <span className="text-foreground">{formatDate(starts_at)}</span>
              </div>
            )}
            {expires_at ? (
              <div className="text-muted-foreground">
                S/d: <span className="text-foreground font-medium">{formatDate(expires_at)}</span>
              </div>
            ) : (
              <div className="text-muted-foreground italic">Tanpa batas akhir</div>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "is_active",
      header: "Status",
      size: 110,
      cell: ({ row }) => {
        const isActive = row.original.is_active
        return isActive ? (
          <Badge variant="success" className="gap-1 whitespace-nowrap text-[10px]">
            <CheckCircle2 className="size-3" />
            Aktif
          </Badge>
        ) : (
          <Badge variant="outline" className="gap-1 text-muted-foreground whitespace-nowrap text-[10px]">
            <XCircle className="size-3" />
            Non-Aktif
          </Badge>
        )
      },
    },
  ]
}
