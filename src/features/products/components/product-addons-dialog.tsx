"use client"

import { BaseDialog } from "@/components/ui/base-dialog"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { DataTable } from "@/components/ui/data-table"
import { Input } from "@/components/ui/input"
import { Layers, Loader2, Plus, Search } from "lucide-react"
import type { Product } from "../@types/product"
import { useProductAddonsManagement } from "../hooks"
import { addonColumns } from "./addon-columns"
import { AddonFormDialog } from "./addon-form-dialog"
import { AddonMobileCard } from "./addon-mobile-card"

export interface ProductAddonsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
}

export function ProductAddonsDialog({
  open,
  onOpenChange,
  product,
}: ProductAddonsDialogProps): React.JSX.Element {
  const productId = product?.id ?? ""
  const {
    search,
    setSearch,
    filteredAddons,
    isLoading,
    isFetching,
    isFormOpen,
    setIsFormOpen,
    selectedAddon,
    addonToDelete,
    setAddonToDelete,
    isDeleting,
    handleCreate,
    handleEdit,
    handleDeleteClick,
    handleDeleteConfirm,
  } = useProductAddonsManagement(productId)

  return (
    <>
      <BaseDialog
        open={open}
        onOpenChange={onOpenChange}
        className="sm:max-w-4xl"
        title={
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Layers className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground">
                  Modul Addon
                </span>
                {product && (
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                    {product.code}
                  </span>
                )}
              </div>
              <p className="text-[11px] font-normal text-muted-foreground">
                Daftar modul pelengkap untuk produk:{" "}
                <strong className="text-foreground">{product?.nama}</strong>
              </p>
            </div>
          </div>
        }
      >
        <div className="space-y-4 pt-1">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari kode atau nama addon..."
                className="pl-9 h-8 text-xs bg-background"
              />
            </div>

            <Button
              type="button"
              onClick={handleCreate}
              className="h-9 px-4 gap-2 text-xs font-semibold cursor-pointer rounded-xl shadow-xs w-full sm:w-auto"
            >
              <Plus className="size-3.5" />
              <span>Tambah Addon</span>
            </Button>
          </div>

          {/* Addons Table */}
          <div className="rounded-xl border border-border bg-card shadow-2xs overflow-hidden">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Loader2 className="size-6 animate-spin mb-2 text-primary" />
                <p className="text-xs">Memuat daftar addon...</p>
              </div>
            ) : (
              <DataTable
                columns={addonColumns}
                data={filteredAddons}
                isLoading={false}
                isFetching={isFetching}
                emptyMessage="Belum ada modul addon untuk produk ini. Tambahkan addon pertama Anda."
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                renderCardItem={(row) => (
                  <AddonMobileCard
                    addon={row.original}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                  />
                )}
              />
            )}
          </div>
        </div>
      </BaseDialog>

      {/* Add / Edit Addon Form Dialog */}
      <AddonFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        productId={productId}
        productName={product?.nama ?? ""}
        addon={selectedAddon}
      />

      {/* Delete Addon Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(addonToDelete)}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setAddonToDelete(null)
          }
        }}
        title="Hapus Modul Addon"
        description={
          <span>
            Apakah Anda yakin ingin menghapus modul addon{" "}
            <strong className="text-foreground">{addonToDelete?.nama}</strong> (
            <code className="font-mono text-xs">{addonToDelete?.code}</code>)?
            Tindakan ini tidak dapat dibatalkan.
          </span>
        }
        confirmText="Hapus Addon"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
      />
    </>
  )
}
