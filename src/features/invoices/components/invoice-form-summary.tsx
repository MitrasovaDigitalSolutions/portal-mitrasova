"use client"

import type React from "react"
import { AlertCircle, Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { formatCurrency, formatDate } from "@/utils"

interface InvoiceFormSummaryProps {
  itemCount: number
  totalQuantity: number
  dueDate: string
  status: string
  totalAmount: number
  isSubmitting: boolean
  canSubmit: boolean
  isEdit: boolean
  onCancel: () => void
}

export function InvoiceFormSummary({
  itemCount,
  totalQuantity,
  dueDate,
  status,
  totalAmount,
  isSubmitting,
  canSubmit,
  isEdit,
  onCancel,
}: InvoiceFormSummaryProps): React.JSX.Element {
  return (
    <Card className="rounded-2xl border-border bg-card p-5 space-y-4 shadow-xs">
        <div className="text-sm font-bold text-foreground border-b border-border pb-3">
          Ringkasan Faktur
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Jumlah Item:</span>
            <span className="font-semibold text-foreground">{itemCount} Baris</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Total Kuantitas:</span>
            <span className="font-semibold text-foreground">{totalQuantity} Qty</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Jatuh Tempo:</span>
            <span className="font-semibold text-foreground">
              {dueDate ? formatDate(dueDate) : "—"}
            </span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Status Awal:</span>
            <span className="font-semibold uppercase text-foreground">
              {status}
            </span>
          </div>
        </div>

        {/* Total Box */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-1">
          <span className="text-xs font-semibold text-muted-foreground">
            Total Jumlah Tagihan
          </span>
          <div className="text-2xl font-bold font-mono text-primary">
            {formatCurrency(totalAmount)}
          </div>
        </div>

        {/* Warning/Info */}
        <div className="flex items-start gap-2 p-3 rounded-xl bg-muted/40 border border-border/80 text-[11px] text-muted-foreground">
          <AlertCircle className="size-4 text-amber-500 shrink-0 mt-0.5" />
          <span>
            Nomor invoice resmi akan digenerate otomatis oleh backend sistem saat faktur disimpan.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <Button
            type="submit"
            disabled={isSubmitting || !canSubmit}
            className="w-full h-10 font-semibold text-xs gap-1.5 cursor-pointer shadow-xs"
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            <span>{isEdit ? "Simpan Perubahan" : "Terbitkan Invoice Sekarang"}</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="w-full h-9 text-xs cursor-pointer"
          >
            Batal
          </Button>
        </div>
      </Card>
  )
}
