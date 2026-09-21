"use client"

import type React from "react"
import { Building } from "lucide-react"
import { useWatch, useFormContext } from "react-hook-form"
import { Card } from "@/components/ui/card"
import { FormSelect, FormDatePicker, FormInput } from "@/components/forms"
import { useInfiniteClients, useClient } from "@/features/clients"
import type { Client } from "@/features/clients"
import type { CreateInvoiceFormValues } from "../validations/invoice.schema"
import type { CommandOption } from "@/components/ui/command-select"
import type { AsyncQueryParams, AsyncQueryResult } from "@/components/forms/form-select"

// ─── Status options ───────────────────────────────────────────────────────────
const STATUS_OPTIONS: CommandOption[] = [
  { value: "unpaid", label: "Belum Dibayar (Unpaid)" },
  { value: "paid", label: "Lunas (Paid)" },
  { value: "cancelled", label: "Dibatalkan (Cancelled)" },
  { value: "expired", label: "Kedaluwarsa (Expired)" },
]

// ─── Map client to CommandOption ──────────────────────────────────────────────
function mapClientOption(client: Client): CommandOption {
  return {
    value: client.id,
    label: client.nama_pemilik,
    description: client.nama_perusahaan,
  }
}

// ─── Infinite hook adapter for FormSelect ────────────────────────────────────
function useInfiniteClientsQuery(
  params: AsyncQueryParams
): AsyncQueryResult<Client> {
  return useInfiniteClients({
    search: params.search,
    per_page: params.per_page ?? 8,
  }) as AsyncQueryResult<Client>
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface InvoiceFormClientFieldsProps {
  isEdit: boolean
}

export function InvoiceFormClientFields({
  isEdit,
}: InvoiceFormClientFieldsProps): React.JSX.Element {
  const { control } = useFormContext<CreateInvoiceFormValues>()
  const watchedClientId = useWatch({ control, name: "client_id" }) || ""

  // Fetch selected client details to populate license options
  const { data: selectedClient } = useClient(watchedClientId, Boolean(watchedClientId))

  // Build license options from the selected client's licenses
  const licenseOptions: CommandOption[] = (selectedClient?.licenses ?? []).map(
    (lic) => ({
      value: lic.id,
      label: lic.nama_instance,
      description: lic.domain_instance ?? lic.license_key,
      badge: lic.status,
    })
  )

  return (
    <Card className="rounded-2xl border-border bg-card p-5 space-y-4 shadow-xs">
      <div className="flex items-center gap-2 text-sm font-bold text-foreground border-b border-border pb-3">
        <Building className="size-4 text-primary" />
        <span>Identitas Pelanggan &amp; Relasi</span>
      </div>

      {/* Row 1: Client Selector + License Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Client selector (async infinite) */}
        <div>
          <FormSelect<CreateInvoiceFormValues, Client>
            name="client_id"
            label="Pelanggan"
            placeholder="Cari & pilih klien..."
            searchPlaceholder="Ketik nama klien..."
            emptyMessage="Klien tidak ditemukan."
            useAsyncQuery={useInfiniteClientsQuery}
            mapOption={mapClientOption}
            disabled={isEdit}
          />
        </div>

        {/* License selector — populated from selected client's licenses */}
        <div>
          <FormSelect<CreateInvoiceFormValues>
            name="license_id"
            label="Lisensi Terkait (Opsional)"
            placeholder={
              watchedClientId
                ? "Pilih lisensi klien..."
                : "Pilih klien terlebih dahulu"
            }
            emptyMessage="Klien ini belum memiliki lisensi."
            options={licenseOptions}
            disabled={isEdit || !watchedClientId}
          />
          <p className="text-[11px] text-muted-foreground mt-1">
            Kosongkan jika invoice untuk jasa/layanan umum.
          </p>
        </div>
      </div>

      {/* Row 2: Status, Due Date, Payment Method */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-border/60">
        <div>
          <FormSelect<CreateInvoiceFormValues>
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
