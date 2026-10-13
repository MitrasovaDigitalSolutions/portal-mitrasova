"use client"

import type { JSX } from "react"
import { ArrowRight, Calendar, FileText, User } from "lucide-react"
import { BaseDialog } from "@/components/ui/base-dialog"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/utils"
import type { CashTransfer } from "../@types/cash-transfer"

export interface CashTransferDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transfer: CashTransfer | null
}

export function CashTransferDetailDialog({
  open,
  onOpenChange,
  transfer,
}: CashTransferDetailDialogProps): JSX.Element {
  if (!transfer) {
    return <></>
  }

  const fromName =
    transfer.from_account?.name ?? transfer.fromAccount?.name ?? "Akun Asal"
  const toName =
    transfer.to_account?.name ?? transfer.toAccount?.name ?? "Akun Tujuan"
  const amount = Number(transfer.amount) || 0
  const fee = Number(transfer.admin_fee) || 0
  const total = amount + fee

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      className="sm:max-w-md"
      title={
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <FileText size={16} />
          </div>
          <div>
            <div className="text-sm font-bold text-foreground">
              Detail Transfer Kas
            </div>
            <p className="font-mono text-[11px] text-muted-foreground">
              {transfer.transfer_number}
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-3.5 text-xs">
        {/* Main Amount Card */}
        <div className="rounded-xl border border-border bg-gradient-to-br from-sky-500/5 via-card to-primary/5 p-3.5 shadow-2xs">
          <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            Nominal Dana Ditransfer
          </span>
          <div className="mt-0.5 font-mono text-2xl font-bold tracking-tight text-foreground">
            {formatCurrency(amount)}
          </div>
          {fee > 0 && (
            <div className="mt-1 flex items-center justify-between border-t border-border/60 pt-2 text-[11px] text-muted-foreground">
              <span>Biaya Admin: {formatCurrency(fee)}</span>
              <span className="font-semibold text-foreground">
                Total Keluar: {formatCurrency(total)}
              </span>
            </div>
          )}
        </div>

        {/* Route Info */}
        <div className="rounded-xl border border-border bg-muted/20 p-3.5">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase">
                Dari Akun
              </span>
              <p className="truncate font-medium text-foreground">{fromName}</p>
            </div>

            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground">
              <ArrowRight size={14} />
            </div>

            <div className="min-w-0 flex-1 text-right">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase">
                Ke Akun
              </span>
              <p className="truncate font-semibold text-primary">{toName}</p>
            </div>
          </div>
        </div>

        {/* Meta Info */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="flex items-center gap-2 rounded-xl border border-border p-2.5">
            <Calendar size={14} className="text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] text-muted-foreground">
                Tanggal Transfer
              </span>
              <span className="truncate font-medium text-foreground">
                {formatDate(transfer.transfer_date)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-border p-2.5">
            <User size={14} className="text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] text-muted-foreground">
                Diproses Oleh
              </span>
              <span className="truncate font-medium text-foreground">
                {transfer.creator?.name ?? "Admin"}
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {transfer.notes && (
          <div className="rounded-xl border border-border bg-muted/20 p-3">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase">
              Catatan:
            </span>
            <p className="mt-0.5 whitespace-pre-wrap text-muted-foreground">
              {transfer.notes}
            </p>
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
