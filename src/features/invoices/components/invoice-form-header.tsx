"use client"

import type React from "react"
import Link from "next/link"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"

interface InvoiceFormHeaderProps {
  isEdit: boolean
  invoiceNumber?: string
  isSubmitting: boolean
  canSubmit: boolean
  onCancel: () => void
}

export function InvoiceFormHeader({
  isEdit,
  invoiceNumber,
  isSubmitting,
  canSubmit,
  onCancel,
}: InvoiceFormHeaderProps): React.JSX.Element {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
      <div className="flex items-center gap-3">
        <Link
          href="/invoices"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          title="Kembali ke Daftar Invoices"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight text-foreground">
              {isEdit ? "Edit Invoice" : "Buat Invoice Baru"}
            </h1>
            {isEdit && invoiceNumber && (
              <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-muted border border-border font-semibold text-foreground">
                {invoiceNumber}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {isEdit
              ? "Perbarui informasi penagihan, status pembayaran, atau rincian item"
              : "Terbitkan tagihan baru dan tautkan ke pelanggan atau lisensi sistem"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={isSubmitting}
          className="h-9 px-4 text-xs font-semibold cursor-pointer"
        >
          Batal
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting || !canSubmit}
          className="h-9 px-4 gap-1.5 text-xs font-semibold cursor-pointer shadow-xs"
        >
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          <span>{isEdit ? "Simpan Perubahan" : "Terbitkan Invoice"}</span>
        </Button>
      </div>
    </div>
  )
}
