"use client"

import { useMemo, type JSX } from "react"
import { Building2, Package, Sparkles } from "lucide-react"
import {
  FormDatePicker,
  FormNumberInput,
  FormSelect,
} from "@/components/forms"
import type { Client } from "@/features/clients/@types/client"
import type { Product } from "@/features/products/@types/product"
import { formatCurrency } from "@/utils"
import { LICENSE_STATUSES, SUBSCRIPTION_TYPES } from "../constants"

interface LicenseCreateSoftwareCardProps {
  clients: Client[]
  products: Product[]
  isLoadingClients: boolean
  isLoadingProducts: boolean
  selectedProduct?: Product
  isLifetime: boolean
}

export function LicenseCreateSoftwareCard({
  clients,
  products,
  isLoadingClients,
  isLoadingProducts,
  selectedProduct,
  isLifetime,
}: LicenseCreateSoftwareCardProps): JSX.Element {
  const clientOptions = useMemo(
    () =>
      clients.map((c) => ({
        value: c.id,
        label: `${c.nama_pemilik} ${c.nama_perusahaan ? `(${c.nama_perusahaan})` : ""}`,
      })),
    [clients]
  )

  const productOptions = useMemo(
    () =>
      products.map((p) => ({
        value: p.id,
        label: `${p.nama} (${p.code})`,
      })),
    [products]
  )

  const subscriptionOptions = useMemo(
    () => [
      { value: "annual", label: SUBSCRIPTION_TYPES.annual.label },
      { value: "monthly", label: SUBSCRIPTION_TYPES.monthly.label },
      { value: "lifetime", label: SUBSCRIPTION_TYPES.lifetime.label },
      { value: "trial", label: SUBSCRIPTION_TYPES.trial.label },
    ],
    []
  )

  const statusOptions = useMemo(
    () =>
      Object.entries(LICENSE_STATUSES).map(([val, conf]) => ({
        value: val,
        label: conf.label,
      })),
    []
  )

  return (
    <div className="rounded-xl border border-border bg-card p-3.5 sm:p-4 shadow-xs space-y-3.5">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-2.5">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
          <Building2 size={15} />
        </div>
        <div>
          <h2 className="text-xs font-bold text-foreground">
            Klien, Produk Aplikasi & Skema Langganan
          </h2>
          <p className="text-[11px] text-muted-foreground">
            Tentukan klien pemilik lisensi, produk software, dan periode aktif lisensi.
          </p>
        </div>
      </div>

      {/* Row 1: Client & Product Selection */}
      <div className="space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormSelect
            name="client_id"
            label="Klien / Merchant"
            placeholder="Cari nama klien..."
            searchPlaceholder="Ketik nama pemilik atau usaha..."
            emptyMessage="Klien tidak ditemukan."
            options={clientOptions}
            isLoading={isLoadingClients}
          />

          <FormSelect
            name="product_id"
            label="Produk Aplikasi Software"
            placeholder="Pilih produk software..."
            searchPlaceholder="Ketik nama atau kode produk..."
            emptyMessage="Produk tidak ditemukan."
            options={productOptions}
            isLoading={isLoadingProducts}
          />
        </div>

        {/* Compact Product Pill */}
        {selectedProduct && (
          <div className="flex flex-wrap items-center justify-between gap-1.5 rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-1.5 text-[11px]">
            <div className="flex items-center gap-1.5">
              <Package size={13} className="text-primary shrink-0" />
              <span className="font-semibold text-foreground">
                {selectedProduct.nama}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                ({selectedProduct.code})
              </span>
            </div>
            <div className="flex items-center gap-2.5 font-mono text-[10px]">
              <span className="text-muted-foreground">
                Bulanan:{" "}
                <strong className="text-foreground">
                  {selectedProduct.harga_bulanan
                    ? formatCurrency(selectedProduct.harga_bulanan)
                    : "Rp 0"}
                </strong>
              </span>
              <span className="text-muted-foreground">
                Tahunan:{" "}
                <strong className="text-primary">
                  {selectedProduct.harga_tahunan
                    ? formatCurrency(selectedProduct.harga_tahunan)
                    : "Rp 0"}
                </strong>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Row 2: Subscription & Expiry (4-cols) */}
      <div className="space-y-1.5 border-t border-border/60 pt-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
          Masa Aktif & Ketentuan Langganan
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
          <FormSelect
            name="subscription_type"
            label="Tipe Langganan"
            options={subscriptionOptions}
          />

          <FormSelect
            name="status"
            label="Status Awal Lisensi"
            options={statusOptions}
          />

          {!isLifetime ? (
            <FormDatePicker
              name="expires_at"
              label="Tanggal Kedaluwarsa"
              placeholder="Pilih tanggal..."
            />
          ) : (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Tanggal Kedaluwarsa
              </label>
              <div className="flex h-9 items-center justify-between rounded-lg border border-dashed border-emerald-500/40 bg-emerald-500/5 px-2.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                <span>Permanen (Lifetime)</span>
                <Sparkles size={12} />
              </div>
            </div>
          )}

          <FormNumberInput
            name="grace_period_days"
            label="Masa Tenggang (Hari)"
            placeholder="7"
            min={0}
            max={90}
            allowNegative={false}
            allowDecimal={false}
          />
        </div>
      </div>
    </div>
  )
}
