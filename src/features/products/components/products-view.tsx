"use client"

import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { DataTable } from "@/components/ui/data-table"
import { motion } from "framer-motion"
import { useMemo } from "react"
import { useProductsManagement } from "../hooks"
import { getProductColumns } from "./product-columns"
import { ProductFormDialog } from "./product-form-dialog"
import { ProductMetricsGrid } from "./product-metrics-grid"
import { ProductMobileCard } from "./product-mobile-card"
import { ProductToolbar } from "./product-toolbar"
import { ProductsSkeleton } from "./products-skeleton"

export function ProductsView(): React.JSX.Element {
  const {
    data,
    productsList,
    totalProducts,
    activeCount,
    inactiveCount,
    totalAddons,
    searchInput,
    handleSearchChange,
    statusFilter,
    handleStatusChange,
    isLoading,
    isFetching,
    refetch,
    isFormOpen,
    setIsFormOpen,
    selectedProduct,
    productToDelete,
    setProductToDelete,
    isDeleting,
    handleCreate,
    handleEdit,
    handleViewDetail,
    handleDeleteClick,
    handleDeleteConfirm,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
  } = useProductsManagement()

  // Setup columns
  const columns = useMemo(
    () =>
      getProductColumns({
        onViewDetail: handleViewDetail,
      }),
    [handleViewDetail]
  )

  if (isLoading && !data) {
    return <ProductsSkeleton />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3.5 sm:space-y-4"
    >
      {/* Page Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Katalog Produk & Layanan
          </h1>
          <p className="text-xs text-muted-foreground">
            Kelola master produk sistem Mitrasova dan modul product add-on
            terhubung.
          </p>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <ProductMetricsGrid
        totalProducts={totalProducts}
        activeCount={activeCount}
        inactiveCount={inactiveCount}
        totalAddons={totalAddons}
      />

      {/* Actions Toolbar */}
      <ProductToolbar
        searchInput={searchInput}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        isFetching={isFetching}
        onRefresh={() => void refetch()}
        onCreateClick={handleCreate}
      />

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={productsList}
        isLoading={isLoading}
        isFetching={isFetching}
        paginationMode="client"
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={(col, order) => {
          setSortBy(col)
          setSortOrder(order)
        }}
        actionColumnSize={110}
        entityName="Produk"
        emptyMessage="Belum ada data produk software yang sesuai kriteria pencarian."
        onView={handleViewDetail}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        renderCardItem={(row) => (
          <ProductMobileCard
            product={row.original}
            onViewDetail={handleViewDetail}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        )}
      />

      {/* Product Create / Edit Modal */}
      <ProductFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        product={selectedProduct}
      />

      {/* Delete Product Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(productToDelete)}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setProductToDelete(null)
          }
        }}
        title="Hapus Produk Software"
        description={
          <span>
            Apakah Anda yakin ingin menghapus produk{" "}
            <strong className="text-foreground">{productToDelete?.nama}</strong>{" "}
            (<code className="font-mono text-xs">{productToDelete?.code}</code>
            )? Tindakan ini akan mempengaruhi lisensi dan modul addon yang
            terkait.
          </span>
        }
        confirmText="Hapus Produk"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
      />
    </motion.div>
  )
}
