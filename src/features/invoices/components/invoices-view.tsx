"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

import { DataTable } from "@/components/ui/data-table"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useInvoices, useDeleteInvoice } from "../api/invoice.queries"
import { getInvoiceColumns } from "./invoice-columns"
import { InvoicesMetricsGrid } from "./invoices-metrics-grid"
import { InvoicesToolbar } from "./invoices-toolbar"
import { InvoiceMobileCard } from "./invoice-mobile-card"
import { InvoiceDetailDialog } from "./invoice-detail-dialog"
import { InvoiceMarkPaidDialog } from "./invoice-mark-paid-dialog"
import { InvoicesSkeleton } from "./invoices-skeleton"
import type { Invoice, InvoiceStatus } from "../@types/invoice"

export function InvoicesView(): React.JSX.Element {
  const router = useRouter()

  // Query state
  const [page, setPage] = React.useState<number>(1)
  const [perPage, setPerPage] = React.useState<number>(10)
  const [searchInput, setSearchInput] = React.useState<string>("")
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [statusFilter, setStatusFilter] = React.useState<"all" | InvoiceStatus>("all")

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput)
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  // Reset page on status filter change
  const handleStatusChange = (status: "all" | InvoiceStatus) => {
    setStatusFilter(status)
    setPage(1)
  }

  // Fetch paginated invoices
  const { data, isLoading, isFetching, refetch } = useInvoices({
    page,
    per_page: perPage,
    search: searchQuery || undefined,
    status: statusFilter === "all" ? undefined : statusFilter,
  })

  // Delete mutation
  const deleteMutation = useDeleteInvoice()

  // Modal dialog states
  const [selectedInvoice, setSelectedInvoice] = React.useState<Invoice | null>(null)
  const [markPaidInvoice, setMarkPaidInvoice] = React.useState<Invoice | null>(null)
  const [invoiceToDelete, setInvoiceToDelete] = React.useState<Invoice | null>(null)

  // Handlers
  const handleEdit = React.useCallback(
    (invoice: Invoice) => {
      router.push(`/invoices/${invoice.id}/edit`)
    },
    [router]
  )

  const handleDeleteConfirm = async () => {
    if (!invoiceToDelete) {
      return
    }
    await deleteMutation.mutateAsync(invoiceToDelete.id)
    setInvoiceToDelete(null)
  }

  // Table columns
  const columns = React.useMemo(
    () =>
      getInvoiceColumns({
        onViewDetail: (inv) => setSelectedInvoice(inv),
        onMarkPaid: (inv) => setMarkPaidInvoice(inv),
        onEdit: handleEdit,
        onDelete: (inv) => setInvoiceToDelete(inv),
      }),
    [handleEdit]
  )

  // Computed metrics
  const invoicesList = data?.data ?? []
  const unpaidCount = invoicesList.filter((inv) => inv.status === "unpaid").length
  const paidCount = invoicesList.filter((inv) => inv.status === "paid").length
  const totalAmountSum = invoicesList.reduce(
    (acc, inv) => acc + (Number(inv.total_amount) || 0),
    0
  )

  if (isLoading && !data) {
    return <InvoicesSkeleton />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header & Filter Toolbar */}
      <InvoicesToolbar
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        isFetching={isFetching}
        onRefresh={() => void refetch()}
        onCreateClick={() => router.push("/invoices/create")}
      />

      {/* KPI Overview Grid */}
      <InvoicesMetricsGrid
        totalInvoices={data?.meta?.total ?? invoicesList.length}
        unpaidCount={unpaidCount}
        paidCount={paidCount}
        pageAmountTotal={totalAmountSum}
      />

      {/* Main Table with Server Pagination */}
      <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
        <DataTable
          columns={columns}
          data={invoicesList}
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
          entityName="invoice"
          emptyMessage="Belum ada data invoice yang sesuai kriteria pencarian."
          renderCardItem={(row) => (
            <InvoiceMobileCard
              invoice={row.original}
              onViewDetail={(inv) => setSelectedInvoice(inv)}
              onMarkPaid={(inv) => setMarkPaidInvoice(inv)}
              onEdit={handleEdit}
              onDelete={(inv) => setInvoiceToDelete(inv)}
            />
          )}
        />
      </div>

      {/* Detail Dialog with BaseDialog */}
      <InvoiceDetailDialog
        open={Boolean(selectedInvoice)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedInvoice(null)
          }
        }}
        invoice={selectedInvoice}
        onMarkPaidClick={(inv) => setMarkPaidInvoice(inv)}
      />

      {/* Mark Paid Dialog with BaseDialog */}
      <InvoiceMarkPaidDialog
        open={Boolean(markPaidInvoice)}
        onOpenChange={(open) => {
          if (!open) {
            setMarkPaidInvoice(null)
          }
        }}
        invoice={markPaidInvoice}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(invoiceToDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setInvoiceToDelete(null)
          }
        }}
        title="Hapus Invoice"
        description={
          <span>
            Apakah Anda yakin ingin menghapus invoice{" "}
            <strong className="text-foreground font-mono">
              {invoiceToDelete?.invoice_number}
            </strong>
            ? Tindakan ini tidak dapat dibatalkan.
          </span>
        }
        confirmText="Ya, Hapus Invoice"
        cancelText="Batal"
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
      />
    </motion.div>
  )
}
