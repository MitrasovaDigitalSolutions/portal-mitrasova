"use client"

import { useMemo, type JSX } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { DataTable } from "@/components/ui/data-table"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useClientsManagement } from "../hooks"
import { getClientColumns } from "./client-columns"
import { ClientMobileCard } from "./client-mobile-card"
import { ClientsMetricsGrid } from "./clients-metrics-grid"
import { ClientsToolbar } from "./clients-toolbar"
import { ClientFormDialog } from "./client-form-dialog"
import { ClientsSkeleton } from "./clients-skeleton"
import type { Client } from "../@types/client"

export function ClientsView(): JSX.Element {
  const router = useRouter()
  const {
    clients,
    meta,
    search,
    setSearch,
    page,
    setPage,
    perPage,
    setPerPage,
    isLoading,
    isFetching,
    metrics,
    isFormOpen,
    setIsFormOpen,
    selectedClient,
    clientToDelete,
    setClientToDelete,
    isDeleting,
    handleOpenCreate,
    handleOpenEdit,
    handleDeleteConfirm,
    refetch,
  } = useClientsManagement()

  const handleNavigateDetail = (client: Client) => {
    router.push(`/clients/${client.id}`)
  }

  const columns = useMemo(
    () =>
      getClientColumns({
        onViewDetail: handleNavigateDetail,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  if (isLoading && clients.length === 0) {
    return <ClientsSkeleton />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3.5 sm:space-y-4"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Klien & Pelanggan
          </h1>
          <p className="text-xs text-muted-foreground">
            Kelola data mitra, pelanggan, dan keterikatan lisensi software Portal Mitrasova.
          </p>
        </div>
      </div>

      {/* KPI Metrics Summary (Compact & Informative) */}
      <ClientsMetricsGrid metrics={metrics} />

      {/* Search & Actions Toolbar */}
      <ClientsToolbar
        search={search}
        onSearchChange={setSearch}
        isFetching={isFetching}
        onRefresh={() => void refetch()}
        onCreateClient={handleOpenCreate}
      />

      {/* Main Data Table */}
      <DataTable
        columns={columns}
        data={clients}
        isLoading={isLoading}
        isFetching={isFetching}
        actionColumnSize={110}
        entityName="Klien"
        renderCardItem={(row) => (
          <ClientMobileCard
            client={row.original}
            onViewDetail={handleNavigateDetail}
            onEdit={handleOpenEdit}
            onDelete={(c) => setClientToDelete(c)}
          />
        )}
        onView={handleNavigateDetail}
        onEdit={handleOpenEdit}
        onDelete={(client) => setClientToDelete(client)}
        paginationMode="server"
        page={page}
        perPage={perPage}
        onPageChange={setPage}
        onPerPageChange={(newPerPage) => {
          setPerPage(newPerPage)
          setPage(1)
        }}
        meta={meta}
      />

      {/* Create / Edit Client Dialog */}
      <ClientFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        client={selectedClient}
      />

      {/* Delete Client Confirm Dialog */}
      <ConfirmDialog
        open={Boolean(clientToDelete)}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setClientToDelete(null)
          }
        }}
        title="Hapus Data Klien"
        description={
          <span>
            Apakah Anda yakin ingin menghapus data klien{" "}
            <strong className="text-foreground">
              {clientToDelete?.nama_pemilik}
            </strong>{" "}
            ({clientToDelete?.nama_perusahaan})? Semua lisensi yang terkait dengan
            klien ini juga akan terhapus.
          </span>
        }
        confirmText="Hapus Klien"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
      />
    </motion.div>
  )
}
