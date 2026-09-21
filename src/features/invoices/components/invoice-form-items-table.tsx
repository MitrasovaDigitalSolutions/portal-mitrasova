"use client"

import type React from "react"
import { FileText, Plus, Sparkles, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { NominalInput } from "@/components/ui/nominal-input"
import type { InvoiceItem } from "../@types/invoice"
import { formatCurrency } from "@/utils"

const QUICK_SERVICE_PRESETS: { description: string; price: number }[] = [
  { description: "Langganan Lisensi Bulanan POS", price: 150000 },
  { description: "Langganan Lisensi Tahunan POS", price: 1500000 },
  { description: "Setup Instance Domain & Server", price: 500000 },
  { description: "Biaya Maintenance & Support Addon", price: 100000 },
]

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
  return (
    <Card className="rounded-2xl border-border bg-card p-5 space-y-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <FileText className="size-4 text-primary" />
            <span>Rincian Layanan & Item Tagihan</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Daftar layanan atau produk yang ditagihkan kepada pelanggan
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onAddItem()}
          className="h-8 text-xs gap-1.5 px-3 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="size-3.5" />
          <span>Tambah Baris</span>
        </Button>
      </div>

      {/* Quick Presets Pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
          <Sparkles className="size-3 text-primary" /> Preset Cepat:
        </span>
        {QUICK_SERVICE_PRESETS.map((preset) => (
          <button
            key={preset.description}
            type="button"
            onClick={() => onAddItem(preset)}
            className="px-2.5 py-1 rounded-lg text-[11px] font-medium border border-border/80 bg-muted/40 hover:bg-muted text-foreground transition-colors cursor-pointer"
          >
            + {preset.description} ({formatCurrency(preset.price)})
          </button>
        ))}
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
              Klik tombol &ldquo;Tambah Baris&rdquo; di atas atau pilih salah satu preset cepat untuk menambahkan layanan.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onAddItem()}
            className="h-8 text-xs gap-1.5 px-3 cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>Tambah Item Pertama</span>
          </Button>
        </div>
      )}
    </Card>
  )
}
