"use client"

import type React from "react"
import { Building } from "lucide-react"
import { Card } from "@/components/ui/card"
import { FormInput, FormSelect, FormDatePicker } from "@/components/forms"
import type { CommandOption } from "@/components/ui/command-select"
import type { InvoiceClientRelation } from "../@types/invoice"

interface InvoiceFormClientFieldsProps {
  isEdit: boolean
  clientRelation?: InvoiceClientRelation
}

const STATUS_OPTIONS: CommandOption[] = [
  { value: "unpaid", label: "Belum Dibayar (Unpaid)" },
  { value: "paid", label: "Lunas (Paid)" },
  { value: "cancelled", label: "Dibatalkan (Cancelled)" },
  { value: "expired", label: "Kedaluwarsa (Expired)" },
]

export function InvoiceFormClientFields({
  isEdit,
  clientRelation,
}: InvoiceFormClientFieldsProps): React.JSX.Element {
  return (
    <Card className="rounded-2xl border-border bg-card p-5 space-y-4 shadow-xs">
      <div className="flex items-center gap-2 text-sm font-bold text-foreground border-b border-border pb-3">
        <Building className="size-4 text-primary" />
        <span>Identitas Pelanggan & Relasi</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <FormInput
            name="client_id"
            label="UUID Pelanggan"
            placeholder="e.g. 9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
            required={!isEdit}
            disabled={isEdit}
            className="font-mono text-xs"
          />
          {isEdit && clientRelation ? (
            <p className="text-[11px] text-muted-foreground flex items-center gap-1 pt-0.5">
              Nama Klien:{" "}
              <span className="font-semibold text-foreground">
                {clientRelation.nama_pemilik || clientRelation.nama_usaha}
              </span>
            </p>
          ) : (
            <p className="text-[11px] text-muted-foreground">
              UUID pelanggan terdaftar dari tabel clients.
            </p>
          )}
        </div>

        <div className="space-y-1">
          <FormInput
            name="license_id"
            label="UUID Lisensi (Opsional)"
            placeholder="UUID lisensi jika ada"
            disabled={isEdit}
            className="font-mono text-xs"
          />
          <p className="text-[11px] text-muted-foreground">
            Kosongkan jika invoice ini untuk pembayaran jasa atau layanan umum.
          </p>
        </div>
      </div>

      {/* Row 2: Status, Due Date, Payment Method */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-border/60">
        <div>
          <FormSelect
            name="status"
            label="Status Pembayaran"
            options={STATUS_OPTIONS}
            placeholder="Pilih status faktur..."
          />
        </div>

        <div>
          <FormDatePicker
            name="due_date"
            label="Jatuh Tempo"
            placeholder="Pilih tanggal..."
          />
        </div>

        <div>
          <FormInput
            name="payment_method"
            label="Metode Pembayaran"
            placeholder="e.g. Transfer Bank BCA / QRIS"
          />
        </div>
      </div>
    </Card>
  )
}
