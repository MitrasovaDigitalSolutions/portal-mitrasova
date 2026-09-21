"use client"

import type React from "react"
import { motion } from "framer-motion"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useProductDetailManagement } from "../hooks"
import { ProductDetailHeader } from "./product-detail-header"
import { ProductDetailInfoCard } from "./product-detail-info-card"
import { ProductDetailAddonsSection } from "./product-detail-addons-section"
import { ProductDetailSkeleton } from "./product-detail-skeleton"
import { ProductFormDialog } from "./product-form-dialog"
import { AddonFormDialog } from "./addon-form-dialog"

export interface ProductDetailViewProps {
  productId: string
}

export function ProductDetailView({
  productId,
}: ProductDetailViewProps): React.JSX.Element {
  const {
    product,
    addons,
    filteredAddons,
    addonSearch,
    setAddonSearch,
    isLoading,
    isFetching,
    isDeletingProduct,
    isDeletingAddon,
    isEditProductOpen,
    setIsEditProductOpen,
    isAddonFormOpen,
    setIsAddonFormOpen,
    selectedAddon,
    addonToDelete,
    setAddonToDelete,
    isDeleteProductOpen,
    setIsDeleteProductOpen,
    handleOpenEditProduct,
    handleOpenCreateAddon,
    handleOpenEditAddon,
    handleDeleteAddonConfirm,
    handleDeleteProductConfirm,
    handleRefreshAll,
  } = useProductDetailManagement(productId)

  if (isLoading && !product) {
    return <ProductDetailSkeleton />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Detail Page Header */}
      <ProductDetailHeader
        product={product}
        isFetching={isFetching}
        onRefresh={handleRefreshAll}
        onEdit={handleOpenEditProduct}
        onDelete={() => setIsDeleteProductOpen(true)}
      />

      {/* Product Information & Metrics Card */}
      {product && (
        <ProductDetailInfoCard
          product={product}
          addonsCount={addons.length}
        />
      )}

      {/* Modul Addon Section */}
      <ProductDetailAddonsSection
        addons={addons}
        filteredAddons={filteredAddons}
        search={addonSearch}
        onSearchChange={setAddonSearch}
        isLoading={isLoading}
        isFetching={isFetching}
        onCreateAddon={handleOpenCreateAddon}
        onEditAddon={handleOpenEditAddon}
        onDeleteAddon={(addon) => setAddonToDelete(addon)}
      />

      {/* Edit Product Modal */}
      <ProductFormDialog
        open={isEditProductOpen}
        onOpenChange={setIsEditProductOpen}
        product={product ?? null}
      />

      {/* Add / Edit Addon Modal */}
      <AddonFormDialog
        open={isAddonFormOpen}
        onOpenChange={setIsAddonFormOpen}
        productId={productId}
        productName={product?.nama ?? ""}
        addon={selectedAddon}
      />

      {/* Delete Addon Confirm Dialog */}
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
        isLoading={isDeletingAddon}
        onConfirm={handleDeleteAddonConfirm}
      />

      {/* Delete Product Confirm Dialog */}
      <ConfirmDialog
        open={isDeleteProductOpen}
        onOpenChange={setIsDeleteProductOpen}
        title="Hapus Produk Software"
        description={
          <span>
            Apakah Anda yakin ingin menghapus produk{" "}
            <strong className="text-foreground">{product?.nama}</strong> (
            <code className="font-mono text-xs">{product?.code}</code>)?
            Tindakan ini akan mempengaruhi lisensi dan modul addon yang terkait.
          </span>
        }
        confirmText="Hapus Produk"
        variant="danger"
        isLoading={isDeletingProduct}
        onConfirm={handleDeleteProductConfirm}
      />
    </motion.div>
  )
}
