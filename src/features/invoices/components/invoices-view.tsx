"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"

import { DataTable } from "@/components/ui/data-table"
import { DataTableActionButton } from "@/components/ui/data-table-actions"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Ban, CheckCircle2, Download } from "lucide-react"
import { useInvoices, useDeleteInvoice, useCancelInvoice } from "../api/invoice.queries"
import { invoiceApi } from "../api/invoice.api"
import { getInvoiceColumns } from "./invoice-columns"
import { InvoicesMetricsGrid } from "./invoices-metrics-grid"
import { InvoicesToolbar } from "./invoices-toolbar"
import { InvoiceMobileCard } from "./invoice-mobile-card"
import { InvoiceDetailDialog } from "./invoice-detail-dialog"
import { InvoiceMarkPaidDialog } from "./invoice-mark-paid-dialog"
import { InvoicesSkeleton } from "./invoices-skeleton"
import type { Invoice, InvoiceStatus } from "../@types/invoice"

export function InvoicesView(): React.JSX.Element {
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

  // Delete & Cancel mutations
  const deleteMutation = useDeleteInvoice()
  const cancelMutation = useCancelInvoice()

  // Modal dialog states
  const [selectedInvoice, setSelectedInvoice] = React.useState<Invoice | null>(null)
  const [markPaidInvoice, setMarkPaidInvoice] = React.useState<Invoice | null>(null)
  const [invoiceToCancel, setInvoiceToCancel] = React.useState<Invoice | null>(null)
  const [invoiceToDelete, setInvoiceToDelete] = React.useState<Invoice | null>(null)

  const handleDownloadPdf = React.useCallback(async (invoice: Invoice) => {
    try {
      await invoiceApi.downloadPdf(invoice.id, invoice.invoice_number)
      toast.success(`PDF invoice ${invoice.invoice_number} berhasil diunduh`)
    } catch {
      toast.error("Gagal mengunduh PDF invoice")
    }
  }, [])

  const handleCancelConfirm = async () => {
    if (!invoiceToCancel) {
      return
    }
    await cancelMutation.mutateAsync(invoiceToCancel.id)
    setInvoiceToCancel(null)
  }

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
      }),
    []
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
      className="space-y-3.5 sm:space-y-4"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Manajemen Invoices
          </h1>
          <p className="text-xs text-muted-foreground">
            Kelola penerbitan faktur tagihan, status pelunasan, dan aktivasi perpanjangan lisensi.
          </p>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <InvoicesMetricsGrid
        totalInvoices={data?.meta?.total ?? invoicesList.length}
        unpaidCount={unpaidCount}
        paidCount={paidCount}
        pageAmountTotal={totalAmountSum}
      />

      {/* Filter and Actions Toolbar (Placed below summary cards, directly above DataTable) */}
      <InvoicesToolbar
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        isFetching={isFetching}
        onRefresh={() => void refetch()}
      />

      {/* Main Table with Server Pagination */}
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
        maxActionButtons={5}
        onView={(inv) => setSelectedInvoice(inv)}
        onDelete={(inv) => setInvoiceToDelete(inv)}
        hideDelete={(inv) => inv.status === "paid"}
        extraActions={(inv) => (
          <>
            {inv.status === "unpaid" && (
              <DataTableActionButton
                variant="emerald"
                tooltip="Tandai Lunas"
                onClick={() => setMarkPaidInvoice(inv)}
              >
                <CheckCircle2 size={16} />
              </DataTableActionButton>
            )}

            {inv.status === "unpaid" && (
              <DataTableActionButton
                variant="amber"
                tooltip="Batalkan Invoice"
                onClick={() => setInvoiceToCancel(inv)}
              >
                <Ban size={16} />
              </DataTableActionButton>
            )}

            <DataTableActionButton
              variant="sky"
              tooltip="Unduh PDF"
              onClick={() => handleDownloadPdf(inv)}
            >
              <Download size={16} />
            </DataTableActionButton>
          </>
        )}
        renderCardItem={(row) => (
          <InvoiceMobileCard
            invoice={row.original}
            onViewDetail={(inv) => setSelectedInvoice(inv)}
            onMarkPaid={(inv) => setMarkPaidInvoice(inv)}
            onCancel={(inv) => setInvoiceToCancel(inv)}
            onDownloadPdf={handleDownloadPdf}
            onDelete={(inv) => setInvoiceToDelete(inv)}
          />
        )}
      />

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
        onCancelClick={(inv) => setInvoiceToCancel(inv)}
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

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(invoiceToCancel)}
        onOpenChange={(open) => {
          if (!open) {
            setInvoiceToCancel(null)
          }
        }}
        title="Batalkan Invoice"
        description={
          <span>
            Apakah Anda yakin ingin membatalkan invoice{" "}
            <strong className="text-foreground font-mono">
              {invoiceToCancel?.invoice_number}
            </strong>
            ? Status invoice akan diubah menjadi dibatalkan.
          </span>
        }
        confirmText="Ya, Batalkan Invoice"
        cancelText="Tutup"
        variant="danger"
        isLoading={cancelMutation.isPending}
        onConfirm={handleCancelConfirm}
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
