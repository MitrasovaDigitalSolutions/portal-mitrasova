"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Paperclip, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { formatCurrency, formatDate } from "@/utils"
import type { Expense } from "../@types/expense"

export function getExpenseColumns(): ColumnDef<Expense>[] {
  return [
    {
      accessorKey: "expense_number",
      header: "No. Pengeluaran",
      size: 160,
      cell: ({ row }) => (
        <span className="rounded-md border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 font-mono text-xs font-bold text-rose-700 shadow-2xs dark:text-rose-400">
          {row.original.expense_number}
        </span>
      ),
    },
    {
      accessorKey: "transaction_date",
      header: "Tanggal",
      size: 130,
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {formatDate(row.original.transaction_date)}
        </span>
      ),
    },
    {
      accessorKey: "category",
      header: "Kategori Beban",
      size: 180,
      cell: ({ row }) => {
        const catName =
          row.original.categoryRef?.name ??
          row.original.category_ref?.name ??
          row.original.category ??
          "Umum"

        return (
          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
            <Tag size={12} className="shrink-0 text-muted-foreground" />
            <span className="truncate">{catName}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "cash_account",
      header: "Sumber Kas",
      enableSorting: false,
      size: 170,
      cell: ({ row }) => {
        const accName =
          row.original.cashAccount?.name ??
          row.original.cash_account?.name ??
          "Akun Kas"

        return (
          <span className="truncate font-medium text-foreground">
            {accName}
          </span>
        )
      },
    },
    {
      accessorKey: "amount",
      header: "Nominal",
      size: 150,
      cell: ({ row }) => (
        <span className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400">
          {formatCurrency(Number(row.original.amount))}
        </span>
      ),
    },
    {
      accessorKey: "receipt_path",
      header: "Bukti Struk",
      enableSorting: false,
      size: 110,
      cell: ({ row }) => {
        const hasReceipt = Boolean(row.original.receipt_path)
        return hasReceipt ? (
          <Badge
            variant="secondary"
            className="gap-1 font-mono text-[10px] text-primary"
          >
            <Paperclip size={11} />
            Ada
          </Badge>
        ) : (
          <span className="text-xs text-muted-foreground italic">—</span>
        )
      },
    },
    {
      accessorKey: "notes",
      header: "Keterangan",
      size: 260,
      cell: ({ row }) => {
        const notes = row.original.notes
        if (!notes) {
          return <span className="text-xs text-muted-foreground italic">—</span>
        }
        return (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="block max-w-[240px] truncate text-xs text-muted-foreground">
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
