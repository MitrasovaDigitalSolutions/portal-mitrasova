"use client"

import type React from "react"
import { useState } from "react"
import {
  FileText,
  Package,
  Plus,
  Puzzle,
  Sparkles,
  Trash2,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { NominalInput } from "@/components/ui/nominal-input"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { useProducts } from "@/features/products"
import { formatCurrency } from "@/utils"
import type { InvoiceItem } from "../@types/invoice"

interface InvoiceFormItemsTableProps {
  items: InvoiceItem[]
  onAddItem: (preset?: { description: string; price: number }) => void
  onRemoveItem: (index: number) => void
  onItemChange: (
    index: number,
    field: keyof InvoiceItem,
    val: string | number
  ) => void
}

export function InvoiceFormItemsTable({
  items,
  onAddItem,
  onRemoveItem,
  onItemChange,
}: InvoiceFormItemsTableProps): React.JSX.Element {
  const [catalogOpen, setCatalogOpen] = useState(false)

  // Fetch active products with their addons for the catalog picker
  const { data: productsData, isLoading: isLoadingProducts } = useProducts({
    status: "active",
    per_page: 100,
  })

  const products = productsData?.data ?? []

  return (
    <Card className="rounded-2xl border-border bg-card p-5 space-y-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <FileText className="size-4 text-primary" />
            <span>Rincian Layanan &amp; Item Tagihan</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Daftar layanan atau produk yang ditagihkan kepada pelanggan
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Catalog picker button */}
          <PopoverPrimitive.Root open={catalogOpen} onOpenChange={setCatalogOpen}>
            <PopoverPrimitive.Trigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs gap-1.5 px-3 cursor-pointer border-primary/40 text-primary hover:bg-primary/5"
                >
                  <Sparkles className="size-3.5" />
                  <span>Dari Katalog</span>
                </Button>
              }
            />

            <PopoverPrimitive.Portal>
              <PopoverPrimitive.Positioner
                align="end"
                side="bottom"
                sideOffset={4}
                className="isolate z-[100000]"
              >
                <PopoverPrimitive.Popup className="w-80 max-h-[380px] overflow-hidden rounded-xl border border-border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95 duration-100 outline-none">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-border bg-muted/30 px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="size-3.5 text-primary" />
                      <span className="text-xs font-semibold text-foreground">
                        Katalog Produk &amp; Addon
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCatalogOpen(false)}
                      className="rounded p-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>

                  {/* Catalog list */}
                  <div className="overflow-y-auto max-h-[320px] p-2 space-y-1.5">
                    {isLoadingProducts && (
                      <div className="py-6 text-center text-xs text-muted-foreground">
                        Memuat katalog...
                      </div>
                    )}
                    {!isLoadingProducts && products.length === 0 && (
                      <div className="py-6 text-center text-xs text-muted-foreground">
                        Belum ada produk aktif.
                      </div>
                    )}
                    {products.map((product) => (
                      <div key={product.id} className="space-y-1">
                        {/* Product header */}
                        <button
                          type="button"
                          onClick={() => {
                            onAddItem({
                              description: `${product.nama} (${product.code})`,
                              price: 0,
                            })
                            setCatalogOpen(false)
                          }}
                          className="w-full flex items-start gap-2 rounded-lg px-2.5 py-2 text-left hover:bg-accent transition-colors cursor-pointer"
                        >
                          <Package className="size-3.5 mt-0.5 shrink-0 text-primary" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-semibold text-foreground truncate">
                                {product.nama}
                              </span>
                              <span className="shrink-0 rounded border border-primary/20 bg-primary/10 px-1.5 py-0.5 text-[9px] leading-none font-bold text-primary uppercase">
                                {product.code}
                              </span>
                            </div>
                            {product.description && (
                              <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                                {product.description}
                              </p>
                            )}
                          </div>
                        </button>

                        {/* Product addons */}
                        {product.addons && product.addons.length > 0 && (
                          <div className="ml-5 space-y-0.5">
                            {product.addons
                              .filter((a) => a.is_active)
                              .map((addon) => (
                                <div
                                  key={addon.id}
                                  className="flex items-center gap-1.5"
                                >
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onAddItem({
                                        description: `${addon.nama} – ${product.nama}`,
                                        price: addon.harga_bulanan,
                                      })
                                      setCatalogOpen(false)
                                    }}
                                    title={`Bulanan: ${formatCurrency(addon.harga_bulanan)}`}
                                    className="flex min-w-0 flex-1 items-center gap-1.5 rounded-lg px-2 py-1 text-left hover:bg-accent transition-colors cursor-pointer"
                                  >
                                    <Puzzle className="size-3 shrink-0 text-muted-foreground" />
                                    <span className="text-[11px] text-foreground truncate">
                                      {addon.nama}
                                    </span>
                                    <span className="ml-auto shrink-0 text-[10px] text-muted-foreground font-mono">
                                      {formatCurrency(addon.harga_bulanan)}/bln
                                    </span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onAddItem({
                                        description: `${addon.nama} – ${product.nama} (Tahunan)`,
                                        price: addon.harga_tahunan,
                                      })
                                      setCatalogOpen(false)
                                    }}
                                    title={`Tahunan: ${formatCurrency(addon.harga_tahunan)}`}
                                    className="shrink-0 rounded-lg border border-border px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
                                  >
                                    {formatCurrency(addon.harga_tahunan)}/thn
                                  </button>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </PopoverPrimitive.Popup>
              </PopoverPrimitive.Positioner>
            </PopoverPrimitive.Portal>
          </PopoverPrimitive.Root>

          {/* Manual row button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onAddItem()}
            className="h-8 text-xs gap-1.5 px-3 cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>Tambah Baris</span>
          </Button>
        </div>
      </div>

      {/* Table */}
      {items.length > 0 ? (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-[11px] font-semibold text-muted-foreground">
                <th className="py-2.5 px-3 w-10 text-center">No</th>
                <th className="py-2.5 px-3">Deskripsi Layanan / Produk</th>
                <th className="py-2.5 px-2 w-24 text-center">Jumlah</th>
                <th className="py-2.5 px-3 w-40 text-right">Harga Satuan</th>
                <th className="py-2.5 px-3 w-40 text-right">Subtotal</th>
                <th className="py-2.5 px-2 w-10 text-center" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {items.map((item, idx) => (
                <tr key={idx} className="hover:bg-muted/20">
                  <td className="p-2 text-center text-xs text-muted-foreground">
                    {idx + 1}
                  </td>
                  <td className="p-2">
                    <Input
                      type="text"
                      placeholder="Deskripsi layanan atau modul"
                      value={item.description}
                      onChange={(e) =>
                        onItemChange(idx, "description", e.target.value)
                      }
                      required
                      className="h-8 text-xs"
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        onItemChange(idx, "quantity", Number(e.target.value))
                      }
                      className="h-8 text-xs text-center"
                    />
                  </td>
                  <td className="p-2">
                    <NominalInput
                      value={item.unit_price}
                      onValueChange={(val) =>
                        onItemChange(idx, "unit_price", val || 0)
                      }
                      className="h-8 text-xs text-right font-mono"
                      showCalculator={false}
                    />
                  </td>
                  <td className="p-2 text-right font-semibold text-foreground text-xs font-mono">
                    {formatCurrency(item.amount)}
                  </td>
                  <td className="p-2 text-center">
                    <button
                      type="button"
                      onClick={() => onRemoveItem(idx)}
                      className="p-1 text-muted-foreground hover:text-destructive rounded transition-colors cursor-pointer"
                      title="Hapus baris"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-8 text-center space-y-3">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            <FileText className="size-5" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-foreground">
              Belum ada baris item tagihan
            </p>
            <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
              Klik &ldquo;Dari Katalog&rdquo; untuk menambahkan produk/addon,
              atau &ldquo;Tambah Baris&rdquo; untuk entri manual.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCatalogOpen(true)}
              className="h-8 text-xs gap-1.5 px-3 cursor-pointer border-primary/40 text-primary hover:bg-primary/5"
            >
              <Sparkles className="size-3.5" />
              <span>Dari Katalog</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onAddItem()}
              className="h-8 text-xs gap-1.5 px-3 cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>Tambah Manual</span>
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
