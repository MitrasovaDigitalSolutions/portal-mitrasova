"use client"

import type { JSX } from "react"
import {
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  FileText,
  Landmark,
  User,
} from "lucide-react"
import { BaseDialog } from "@/components/ui/base-dialog"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatToReadableDate, formatToTime } from "@/utils"
import {
  CASH_LEDGER_REF_LABELS,
  CASH_LEDGER_TYPE_LABELS,
} from "../constants/cash-ledger-options"
import type { CashLedger, CashLedgerType } from "../@types/cash-ledger"

export interface CashLedgerDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ledger: CashLedger | null
}

export function CashLedgerDetailDialog({
  open,
  onOpenChange,
  ledger,
}: CashLedgerDetailDialogProps): JSX.Element {
  if (!ledger) {
    return <></>
  }

  const isCredit = ledger.mutation_type === "credit"
  const amount = Number(ledger.amount) || 0
  const before = Number(ledger.balance_before) || 0
  const after = Number(ledger.balance_after) || 0

  const accountName =
    ledger.cashAccount?.name ?? ledger.cash_account?.name ?? "Akun Kas"
  const typeLabel =
    CASH_LEDGER_TYPE_LABELS[ledger.type as CashLedgerType] ?? ledger.type
  const refType = ledger.reference_type
    ? (CASH_LEDGER_REF_LABELS[
        ledger.reference_type as keyof typeof CASH_LEDGER_REF_LABELS
      ] ?? ledger.reference_type)
    : null

  const txDate = ledger.transaction_date || ledger.created_at || ""
  const timeStr = formatToTime(ledger.created_at || ledger.transaction_date)

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      className="sm:max-w-md"
      title={
        <div className="flex items-center gap-2.5">
          <div
            className={`flex size-8 shrink-0 items-center justify-center rounded-xl border ${
              isCredit
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400"
            }`}
          >
            {isCredit ? (
              <ArrowDownLeft size={16} />
            ) : (
              <ArrowUpRight size={16} />
            )}
          </div>
          <div>
            <div className="text-sm font-bold text-foreground">
              Rincian Mutasi Buku Kas
            </div>
            <p className="font-mono text-[11px] text-muted-foreground">
              ID #{ledger.id}
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-3.5 text-xs">
        {/* Nominal Mutasi Card */}
        <div
          className={`rounded-xl border p-3.5 shadow-2xs ${
            isCredit
              ? "border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-card to-primary/5"
              : "border-rose-500/20 bg-gradient-to-br from-rose-500/5 via-card to-primary/5"
          }`}
        >
          <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            {isCredit ? "Kas Masuk (Kredit)" : "Kas Keluar (Debit)"}
          </span>
          <div
            className={`mt-0.5 font-mono text-2xl font-bold tracking-tight ${
              isCredit
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {isCredit ? "+" : "-"} {formatCurrency(amount)}
          </div>
        </div>

        {/* Balance Progression Card */}
        <div className="rounded-xl border border-border bg-muted/20 p-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Saldo Sebelum:</span>
            <span className="font-mono font-medium text-foreground">
              {formatCurrency(before)}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between border-t border-border/60 pt-1 font-semibold">
            <span className="text-foreground">Saldo Sesudah:</span>
            <span className="font-mono text-foreground">
              {formatCurrency(after)}
            </span>
          </div>
        </div>

        {/* Source & Type Info */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="flex items-center gap-2 rounded-xl border border-border p-2.5">
            <Landmark size={14} className="text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] text-muted-foreground">
                Akun Kas Terkait
              </span>
              <span className="truncate font-semibold text-foreground">
                {accountName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-border p-2.5">
            <FileText size={14} className="text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] text-muted-foreground">
                Tipe Mutasi
              </span>
              <span className="truncate font-semibold text-foreground">
                {typeLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Date & Operator */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="flex items-center gap-2 rounded-xl border border-border p-2.5">
            <Calendar size={14} className="text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] text-muted-foreground">
                Tanggal & Waktu Transaksi
              </span>
              <div className="truncate font-medium text-foreground">
                <span>{formatToReadableDate(txDate)}</span>
                {timeStr && (
                  <span className="ml-1.5 font-mono text-[11px] text-muted-foreground">
                    ({timeStr} WIB)
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-border p-2.5">
            <User size={14} className="text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] text-muted-foreground">
                Diproses Oleh
              </span>
              <span className="truncate font-medium text-foreground">
                {ledger.creator?.name ?? "Sistem / Otomatis"}
              </span>
            </div>
          </div>
        </div>

        {/* Description & Reference */}
        <div className="space-y-1 rounded-xl border border-border bg-muted/20 p-3">
          <span className="block text-[10px] font-semibold text-muted-foreground uppercase">
            Keterangan Transaksi:
          </span>
          <p className="text-foreground">{ledger.description}</p>
          {refType && (
            <p className="border-t border-border/60 pt-1 font-mono text-[10px] text-muted-foreground">
              Referensi: {refType}{" "}
              {ledger.reference_id && `#${ledger.reference_id}`}
            </p>
          )}
        </div>

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
