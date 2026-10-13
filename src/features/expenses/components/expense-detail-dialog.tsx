"use client"

import type { JSX } from "react"
import {
  Calendar,
  ExternalLink,
  FileText,
  Landmark,
  Tag,
  User,
} from "lucide-react"
import { BaseDialog } from "@/components/ui/base-dialog"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/utils"
import type { Expense } from "../@types/expense"

export interface ExpenseDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  expense: Expense | null
}

export function ExpenseDetailDialog({
  open,
  onOpenChange,
  expense,
}: ExpenseDetailDialogProps): JSX.Element {
  if (!expense) {
    return <></>
  }

  const categoryName =
    expense.categoryRef?.name ??
    expense.category_ref?.name ??
    expense.category ??
    "Umum"
  const accountName =
    expense.cashAccount?.name ?? expense.cash_account?.name ?? "Akun Kas"
  const amount = Number(expense.amount) || 0

  const receiptUrl = expense.receipt_path
    ? `${process.env.NEXT_PUBLIC_API_URL ?? ""}/storage/${expense.receipt_path}`
    : null

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      className="sm:max-w-md"
      title={
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <FileText size={16} />
          </div>
          <div>
            <div className="text-sm font-bold text-foreground">
              Detail Pengeluaran Kas
            </div>
            <p className="font-mono text-[11px] text-muted-foreground">
              {expense.expense_number}
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-3.5 text-xs">
        {/* Nominal Card */}
        <div className="rounded-xl border border-border bg-gradient-to-br from-rose-500/5 via-card to-primary/5 p-3.5 shadow-2xs">
          <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            Nominal Pengeluaran
          </span>
          <div className="mt-0.5 font-mono text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
            {formatCurrency(amount)}
          </div>
        </div>

        {/* Source & Category */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="flex items-center gap-2 rounded-xl border border-border p-2.5">
            <Landmark size={14} className="text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] text-muted-foreground">
                Sumber Kas
              </span>
              <span className="truncate font-semibold text-foreground">
                {accountName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-border p-2.5">
            <Tag size={14} className="text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] text-muted-foreground">
                Kategori Beban
              </span>
              <span className="truncate font-semibold text-foreground">
                {categoryName}
              </span>
            </div>
          </div>
        </div>

        {/* Date & Creator */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="flex items-center gap-2 rounded-xl border border-border p-2.5">
            <Calendar size={14} className="text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] text-muted-foreground">
                Tanggal Transaksi
              </span>
              <span className="truncate font-medium text-foreground">
                {formatDate(expense.transaction_date)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-border p-2.5">
            <User size={14} className="text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] text-muted-foreground">
                Dicatat Oleh
              </span>
              <span className="truncate font-medium text-foreground">
                {expense.creator?.name ?? "Admin"}
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {expense.notes && (
          <div className="rounded-xl border border-border bg-muted/20 p-3">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase">
              Catatan:
            </span>
            <p className="mt-0.5 whitespace-pre-wrap text-muted-foreground">
              {expense.notes}
            </p>
          </div>
        )}

        {/* Receipt Link */}
        {receiptUrl && (
          <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-2.5">
            <span className="text-xs text-muted-foreground">
              Bukti / Struk Pembayaran Tersedia
            </span>
            <a
              href={receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-xs font-semibold text-foreground shadow-2xs hover:bg-muted"
            >
              <ExternalLink size={12} />
              <span>Buka Berkas</span>
            </a>
          </div>
        )}

        <div className="flex justify-end border-t border-border pt-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-8.5 cursor-pointer rounded-xl px-4 text-xs font-semibold"
          >
            Tutup
          </Button>
        </div>
      </div>
    </BaseDialog>
  )
}
