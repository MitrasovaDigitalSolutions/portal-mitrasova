"use client"

import { useMemo, type JSX } from "react"
import { Building2, Package } from "lucide-react"
import { FormSelect } from "@/components/forms"
import type { Client } from "@/features/clients/@types/client"
import type { Product } from "@/features/products/@types/product"
import { formatCurrency } from "@/utils"

interface LicenseCreateClientProductCardProps {
  clients: Client[]
  products: Product[]
  isLoadingClients: boolean
  isLoadingProducts: boolean
  selectedProduct?: Product
}

export function LicenseCreateClientProductCard({
  clients,
  products,
  isLoadingClients,
  isLoadingProducts,
  selectedProduct,
}: LicenseCreateClientProductCardProps): JSX.Element {
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

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-xs space-y-4">
      <div className="flex items-center gap-2 border-b border-border/60 pb-3">
        <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Building2 size={15} />
        </div>
        <div>
          <h2 className="text-xs font-bold text-foreground">
            1. Pemilihan Klien & Produk Aplikasi
          </h2>
          <p className="text-[11px] text-muted-foreground">
            Tentukan penerima lisensi dan jenis software Mitrasova yang didaftarkan.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormSelect
          name="client_id"
          label="Pilih Klien / Merchant"
          placeholder="Cari nama klien..."
          searchPlaceholder="Ketik nama pemilik atau usaha..."
          emptyMessage="Klien tidak ditemukan."
          options={clientOptions}
          isLoading={isLoadingClients}
        />

        <FormSelect
          name="product_id"
          label="Pilih Produk Aplikasi"
          placeholder="Pilih produk software..."
          searchPlaceholder="Ketik nama atau kode produk..."
          emptyMessage="Produk tidak ditemukan."
          options={productOptions}
          isLoading={isLoadingProducts}
        />
      </div>

      {selectedProduct && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Package size={14} className="text-primary shrink-0" />
            <span className="font-semibold text-foreground">
              {selectedProduct.nama} ({selectedProduct.code})
            </span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px]">
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
  )
}
