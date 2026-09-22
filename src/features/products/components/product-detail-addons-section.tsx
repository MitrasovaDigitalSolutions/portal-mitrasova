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
    <div className="space-y-3">
      {/* Section Header & Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
            <Layers size={14} />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-foreground">
                Modul Product Addon
              </h2>
              <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 font-mono">
                {addons.length} Modul
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Daftar modul fitur berbayar yang dapat diaktifkan pada lisensi produk ini.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari modul addon..."
              className="pl-8.5 pr-8.5 h-8.5 text-xs rounded-xl bg-card border-border/80 shadow-2xs focus-visible:ring-1"
            />
          </div>

          <Button
            type="button"
            size="sm"
            onClick={onCreateAddon}
            className="h-8.5 px-3 rounded-xl text-xs gap-1.5 font-semibold bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-xs shrink-0"
          >
            <Plus size={13} />
            <span>Tambah Addon</span>
          </Button>
        </div>
      </div>

      {/* Addons Table */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Loader2 size={20} className="animate-spin mb-2 text-primary" />
          <p className="text-xs">Memuat daftar modul addon...</p>
        </div>
      ) : (
        <DataTable
          columns={addonColumns}
          data={filteredAddons}
          isLoading={false}
          isFetching={isFetching}
          actionColumnSize={110}
          entityName="Addon"
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
  )
}
