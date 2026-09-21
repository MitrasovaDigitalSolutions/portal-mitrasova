"use client"

import type React from "react"
import { Layers, Plus, Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/ui/data-table"
import { addonColumns } from "./addon-columns"
import { AddonMobileCard } from "./addon-mobile-card"
import type { ProductAddon } from "../@types/product"

export interface ProductDetailAddonsSectionProps {
  addons: ProductAddon[]
  filteredAddons: ProductAddon[]
  search: string
  onSearchChange: (value: string) => void
  isLoading: boolean
  isFetching: boolean
  onCreateAddon: () => void
  onEditAddon: (addon: ProductAddon) => void
  onDeleteAddon: (addon: ProductAddon) => void
}

export function ProductDetailAddonsSection({
  addons,
  filteredAddons,
  search,
  onSearchChange,
  isLoading,
  isFetching,
  onCreateAddon,
  onEditAddon,
  onDeleteAddon,
}: ProductDetailAddonsSectionProps): React.JSX.Element {
  return (
    <div className="space-y-4">
      {/* Section Header & Toolbar */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Layers className="size-4 text-sky-600 dark:text-sky-400" />
              <h2 className="text-sm font-bold text-foreground">
                Modul Product Addon
              </h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                {addons.length} Modul
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Daftar modul fitur berbayar yang dapat diaktifkan pada lisensi produk ini
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Cari kode atau nama addon..."
                className="pl-9 h-8 text-xs bg-background"
              />
            </div>

            <Button
              type="button"
              size="sm"
              onClick={onCreateAddon}
              className="h-8 text-xs gap-1.5 bg-sky-600 hover:bg-sky-700 text-white dark:bg-sky-500 cursor-pointer shadow-2xs shrink-0"
            >
              <Plus className="size-3.5" />
              <span>Tambah Addon</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Addons Table */}
      <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="size-6 animate-spin mb-2 text-primary" />
            <p className="text-xs">Memuat daftar modul addon...</p>
          </div>
        ) : (
          <DataTable
            columns={addonColumns}
            data={filteredAddons}
            isLoading={false}
            isFetching={isFetching}
            entityName="addon"
            emptyMessage="Belum ada modul addon untuk produk ini. Klik 'Tambah Addon' untuk mendaftarkan modul baru."
            onEdit={onEditAddon}
            onDelete={onDeleteAddon}
            renderCardItem={(row) => (
              <AddonMobileCard
                addon={row.original}
                onEdit={onEditAddon}
                onDelete={onDeleteAddon}
              />
            )}
          />
        )}
      </div>
    </div>
  )
}
