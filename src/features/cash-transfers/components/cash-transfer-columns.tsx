"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowRight, ArrowRightLeft } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { formatCurrency, formatDate } from "@/utils"
import type { CashTransfer } from "../@types/cash-transfer"

export function getCashTransferColumns(): ColumnDef<CashTransfer>[] {
  return [
    {
      accessorKey: "transfer_number",
      header: "No. Transfer",
      size: 160,
      cell: ({ row }) => (
        <span className="rounded-md border border-sky-500/20 bg-sky-500/10 px-2 py-0.5 font-mono text-xs font-bold text-sky-700 shadow-2xs dark:text-sky-400">
          {row.original.transfer_number}
        </span>
      ),
    },
    {
      accessorKey: "transfer_date",
      header: "Tanggal",
      size: 130,
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {formatDate(row.original.transfer_date)}
        </span>
      ),
    },
    {
      id: "accounts_route",
      header: "Alur Rekening",
      enableSorting: false,
      size: 320,
      cell: ({ row }) => {
        const fromName =
          row.original.from_account?.name ??
          row.original.fromAccount?.name ??
          "Akun Asal"
        const toName =
          row.original.to_account?.name ??
          row.original.toAccount?.name ??
          "Akun Tujuan"

        return (
          <TooltipProvider delayDuration={200}>
            <div className="flex max-w-[310px] items-center gap-1.5 text-xs">
              <div className="flex size-6 shrink-0 items-center justify-center rounded-md border border-border bg-muted/60 text-muted-foreground">
                <ArrowRightLeft size={12} />
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="truncate font-medium text-foreground">
                    {fromName}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  Dari: {fromName}
                </TooltipContent>
              </Tooltip>

              <ArrowRight
                size={12}
                className="shrink-0 text-muted-foreground"
              />

              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="truncate font-semibold text-primary">
                    {toName}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  Ke: {toName}
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        )
      },
    },
    {
      accessorKey: "amount",
      header: "Nominal Transfer",
      size: 160,
      cell: ({ row }) => (
        <span className="font-mono text-xs font-bold text-foreground">
          {formatCurrency(Number(row.original.amount))}
        </span>
      ),
    },
    {
      accessorKey: "admin_fee",
      header: "Biaya Admin",
      size: 130,
      cell: ({ row }) => {
        const fee = Number(row.original.admin_fee) || 0
        return (
          <span className="font-mono text-xs text-muted-foreground">
            {fee > 0 ? formatCurrency(fee) : "Rp 0"}
          </span>
        )
      },
    },
    {
      accessorKey: "notes",
      header: "Catatan",
      size: 240,
      cell: ({ row }) => {
        const notes = row.original.notes
        if (!notes) {
          return <span className="text-xs text-muted-foreground italic">—</span>
        }
        return (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="block max-w-[220px] truncate text-xs text-muted-foreground">
                  {notes}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs text-xs">
                {notes}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      },
    },
  ]
}
