"use client"

import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { formatCurrency, formatDate, formatToTime } from "@/utils"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowDownLeft, ArrowUpRight } from "lucide-react"
import type { CashLedger, CashLedgerType } from "../@types/cash-ledger"
import {
  CASH_LEDGER_REF_LABELS,
  CASH_LEDGER_TYPE_LABELS,
} from "../constants/cash-ledger-options"

export function getCashLedgerColumns(): ColumnDef<CashLedger>[] {
  return [
    {
      accessorKey: "transaction_date",
      header: "Waktu & Tanggal",
      size: 160,
      cell: ({ row }) => {
        const item = row.original
        const timeStr = formatToTime(item.created_at || item.transaction_date)
        const dateStr = formatDate(
          item.transaction_date || item.created_at || "",
          "dd MMM yyyy"
        )

        return (
          <div className="flex flex-col gap-0.5 text-xs">
            <div className="flex items-center gap-1.5 font-medium text-foreground">

              <span>{dateStr}</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">

              <span>{timeStr ? `${timeStr} WIB` : "—"}</span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "cash_account",
      header: "Akun Kas",
      enableSorting: false,
      size: 170,
      cell: ({ row }) => {
        const name =
          row.original.cashAccount?.name ??
          row.original.cash_account?.name ??
          "—"
        return (
          <span className="truncate font-semibold text-foreground">{name}</span>
        )
      },
    },
    {
      accessorKey: "description",
      header: "Deskripsi & Referensi",
      size: 340,
      cell: ({ row }) => {
        const item = row.original
        const refType = item.reference_type
          ? (CASH_LEDGER_REF_LABELS[
            item.reference_type as keyof typeof CASH_LEDGER_REF_LABELS
          ] ?? item.reference_type)
          : null

        return (
          <TooltipProvider delayDuration={200}>
            <div className="max-w-[330px] space-y-0.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="block truncate text-xs font-medium text-foreground">
                    {item.description}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs text-xs">
                  {item.description}
                </TooltipContent>
              </Tooltip>

              {refType && (
                <div className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                  <span>Ref: {refType}</span>
                  {item.reference_id && <span>#{item.reference_id}</span>}
                </div>
              )}
            </div>
          </TooltipProvider>
        )
      },
    },
    {
      accessorKey: "type",
      header: "Tipe Transaksi",
      size: 160,
      cell: ({ row }) => {
        const rawType = row.original.type as CashLedgerType
        const label = CASH_LEDGER_TYPE_LABELS[rawType] ?? row.original.type

        return (
          <Badge
            variant="outline"
            className="text-[10px] font-medium whitespace-nowrap"
          >
            {label}
          </Badge>
        )
      },
    },
    {
      accessorKey: "amount",
      header: "Nominal Mutasi",
      size: 160,
      cell: ({ row }) => {
        const isCredit = row.original.mutation_type === "credit"
        const amount = Number(row.original.amount) || 0

        return (
          <div
            className={`flex items-center gap-1 font-mono text-xs font-bold ${isCredit
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-rose-600 dark:text-rose-400"
              }`}
          >
            {isCredit ? (
              <ArrowDownLeft size={13} className="shrink-0" />
            ) : (
              <ArrowUpRight size={13} className="shrink-0" />
            )}
            <span>
              {isCredit ? "+" : "-"} {formatCurrency(amount)}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "balance_after",
      header: "Saldo Akhir",
      size: 150,
      cell: ({ row }) => (
        <span className="font-mono text-xs font-semibold text-foreground">
          {formatCurrency(Number(row.original.balance_after))}
        </span>
      ),
    },
  ]
}
