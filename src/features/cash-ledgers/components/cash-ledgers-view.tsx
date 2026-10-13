"use client"

import { useMemo, useState, type JSX } from "react"
import { motion } from "framer-motion"
import { BookOpen } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { useCashAccounts } from "@/features/cash-accounts/api/cash-account.queries"
import { useCashLedgers } from "../api/cash-ledger.queries"
import { getCashLedgerColumns } from "./cash-ledger-columns"
import { CashLedgersToolbar } from "./cash-ledgers-toolbar"
import { CashLedgerDetailDialog } from "./cash-ledger-detail-dialog"
import type { CashLedger, CashLedgerMutationType } from "../@types/cash-ledger"

export function CashLedgersView(): JSX.Element {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(20)
  const [selectedAccountId, setSelectedAccountId] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [selectedMutationType, setSelectedMutationType] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [sortBy, setSortBy] = useState<string | undefined>("transaction_date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>("desc")

  const [detailLedger, setDetailLedger] = useState<CashLedger | null>(null)

  const { data: accountsData } = useCashAccounts({})
  const accounts = useMemo(() => accountsData?.data ?? [], [accountsData?.data])

  const { data, isLoading, isFetching, refetch } = useCashLedgers({
    page,
    per_page: perPage,
    cash_account_id: selectedAccountId ? Number(selectedAccountId) : undefined,
    type: selectedType || undefined,
    mutation_type: selectedMutationType
      ? (selectedMutationType as CashLedgerMutationType)
      : undefined,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    sort_by: sortBy,
    sort_order: sortOrder,
  })

  const ledgers = useMemo(() => data?.data ?? [], [data?.data])
  const columns = useMemo(() => getCashLedgerColumns(), [])

  const handleResetFilters = () => {
    setSelectedAccountId("")
    setSelectedType("")
    setSelectedMutationType("")
    setDateFrom("")
    setDateTo("")
    setSortBy("transaction_date")
    setSortOrder("desc")
    setPage(1)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Page Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
            <BookOpen size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-foreground">
                Buku Kas & Riwayat Mutasi
              </h1>
            </div>
            <p className="text-xs text-muted-foreground">
              Rekam jejak seluruh mutasi kredit (kas masuk) dan debit (kas
              keluar) secara kronologis.
            </p>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="space-y-3.5 rounded-xl border border-border bg-card p-4 shadow-xs">
        <CashLedgersToolbar
          accounts={accounts}
          selectedAccountId={selectedAccountId}
          onAccountIdChange={(val) => {
            setSelectedAccountId(val)
            setPage(1)
          }}
          selectedType={selectedType}
          onTypeChange={(val) => {
            setSelectedType(val)
            setPage(1)
          }}
          selectedMutationType={selectedMutationType}
          onMutationTypeChange={(val) => {
            setSelectedMutationType(val)
            setPage(1)
          }}
          dateFrom={dateFrom}
          onDateFromChange={(val) => {
            setDateFrom(val)
            setPage(1)
          }}
          dateTo={dateTo}
          onDateToChange={(val) => {
            setDateTo(val)
            setPage(1)
          }}
          onResetFilters={handleResetFilters}
          isFetching={isFetching}
          onRefresh={() => void refetch()}
        />

        <DataTable
          columns={columns}
          data={ledgers}
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
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={(col, order) => {
            setSortBy(col)
            setSortOrder(order)
            setPage(1)
          }}
          meta={data?.meta}
          maxActionButtons={5}
          entityName="mutasi buku kas"
          emptyMessage="Belum ada catatan mutasi kas yang sesuai kriteria."
          onView={(item) => setDetailLedger(item)}
        />
      </div>

      {/* Detail Dialog */}
      <CashLedgerDetailDialog
        open={Boolean(detailLedger)}
        onOpenChange={(open) => !open && setDetailLedger(null)}
        ledger={detailLedger}
      />
    </motion.div>
  )
}
