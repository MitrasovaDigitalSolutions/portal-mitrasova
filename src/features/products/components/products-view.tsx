"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { DataTable } from "@/components/ui/data-table"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useProductsManagement } from "../hooks"
import { getProductColumns } from "./product-columns"
import { ProductMobileCard } from "./product-mobile-card"
import { ProductToolbar } from "./product-toolbar"
import { ProductMetricsGrid } from "./product-metrics-grid"
import { ProductFormDialog } from "./product-form-dialog"
import { ProductsSkeleton } from "./products-skeleton"

export function ProductsView(): React.JSX.Element {
  const {
    page,
    setPage,
    perPage,
    setPerPage,
    searchInput,
    handleSearchChange,
    statusFilter,
    handleStatusChange,
    data,
    productsList,
    totalProducts,
    activeCount,
    inactiveCount,
    totalAddons,
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
      className="space-y-6"
    >
      {/* Header & Filter Toolbar */}
      <ProductToolbar
        searchInput={searchInput}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        isFetching={isFetching}
        onRefresh={() => void refetch()}
        onCreateClick={handleCreate}
      />

      {/* KPI Overview Grid */}
      <ProductMetricsGrid
        totalProducts={totalProducts}
        activeCount={activeCount}
        inactiveCount={inactiveCount}
        totalAddons={totalAddons}
      />

      {/* Main Table with Server Pagination */}
      <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
        <DataTable
          columns={columns}
          data={productsList}
          isLoading={isLoading}
          isFetching={isFetching}
          paginationMode="server"
          page={page}
          perPage={perPage}
          onPageChange={setPage}
          onPerPageChange={(newPerPage) => {
            setPerPage(newPerPage)
            setPage(1)
          }}
          meta={data?.meta}
          entityName="produk"
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
      </div>

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
            <strong className="text-foreground">{productToDelete?.nama}</strong> (
            <code className="font-mono text-xs">{productToDelete?.code}</code>)?
            Tindakan ini akan mempengaruhi lisensi dan modul addon yang terkait.
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
