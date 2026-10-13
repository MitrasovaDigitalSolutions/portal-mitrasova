"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { CheckCircle2, Landmark, Star, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { formatCurrency } from "@/utils"
import { CASH_ACCOUNT_TYPE_LABELS } from "../constants/cash-account-options"
import type { CashAccount } from "../@types/cash-account"

export function getCashAccountColumns(): ColumnDef<CashAccount>[] {
  return [
    {
      accessorKey: "name",
      header: "Nama Akun Kas",
      size: 320,
      cell: ({ row }) => {
        const account = row.original
        return (
          <TooltipProvider delayDuration={200}>
            <div className="flex max-w-[310px] items-center gap-2.5">
              <div className="flex size-7.5 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 shadow-2xs dark:text-emerald-400">
                <Landmark size={14} />
              </div>
              <div className="min-w-0 flex-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="block max-w-full truncate text-xs font-semibold text-foreground">
                      {account.name}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs text-xs">
                    {account.name}
                  </TooltipContent>
                </Tooltip>
                {account.is_default && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                    <Star className="size-2.5 fill-current" />
                    Akun default pelunasan invoice
                  </span>
                )}
              </div>
            </div>
          </TooltipProvider>
        )
      },
    },
    {
      accessorKey: "type",
      header: "Tipe",
      size: 150,
      cell: ({ row }) => (
        <Badge
          variant="secondary"
          className="text-[10px] font-medium whitespace-nowrap"
        >
          {CASH_ACCOUNT_TYPE_LABELS[row.original.type]}
        </Badge>
      ),
    },
    {
      accessorKey: "account_number",
      header: "No. Rekening",
      size: 160,
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">
          {row.original.account_number || "—"}
        </span>
      ),
    },
    {
      accessorKey: "current_balance",
      header: "Saldo Saat Ini",
      size: 160,
      cell: ({ row }) => (
        <span className="font-mono text-xs font-bold text-foreground">
          {formatCurrency(Number(row.original.current_balance))}
        </span>
      ),
    },
    {
      accessorKey: "is_active",
      header: "Status",
      size: 120,
      cell: ({ row }) =>
        row.original.is_active ? (
          <Badge
            variant="success"
            className="gap-1 text-[10px] whitespace-nowrap"
          >
            <CheckCircle2 className="size-3" />
            Aktif
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="gap-1 text-[10px] whitespace-nowrap text-muted-foreground"
          >
            <XCircle className="size-3" />
            Non-Aktif
          </Badge>
        ),
    },
  ]
}
