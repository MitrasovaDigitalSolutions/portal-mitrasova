"use client"

import { useMemo, useState, type JSX } from "react"
import { ArrowLeftRight, RotateCw, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { DateRangeFilter } from "@/components/shared"
import { CommandSelect } from "@/components/ui/command-select"
import { useCashAccounts } from "@/features/cash-accounts/api/cash-account.queries"
import { useCashTransfers } from "../api/cash-transfer.queries"
import { getCashTransferColumns } from "./cash-transfer-columns"
import { CashTransferDetailDialog } from "./cash-transfer-detail-dialog"
import type { CashTransfer } from "../@types/cash-transfer"

export interface CashTransfersTabProps {
  onOpenCreateTransfer: () => void
}

export function CashTransfersTab({
  onOpenCreateTransfer,
}: CashTransfersTabProps): JSX.Element {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(15)
  const [selectedAccountId, setSelectedAccountId] = useState<string>("")
  const [dateFrom, setDateFrom] = useState<string>("")
  const [dateTo, setDateTo] = useState<string>("")
  const [sortBy, setSortBy] = useState<string | undefined>("transfer_date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>("desc")
  const [detailTransfer, setDetailTransfer] = useState<CashTransfer | null>(
    null
  )

  const { data: accountsData } = useCashAccounts({})
  const accounts = useMemo(() => accountsData?.data ?? [], [accountsData?.data])

  const accountFilterOptions = useMemo(
    () => [
      { value: "", label: "Semua Akun Kas" },
      ...accounts.map((acc) => ({
        value: String(acc.id),
        label: acc.name,
      })),
    ],
    [accounts]
  )

  const { data, isLoading, isFetching, refetch } = useCashTransfers({
    page,
    per_page: perPage,
    cash_account_id: selectedAccountId ? Number(selectedAccountId) : undefined,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    sort_by: sortBy,
    sort_order: sortOrder,
  })

  const columns = useMemo(() => getCashTransferColumns(), [])
  const transfers = useMemo(() => data?.data ?? [], [data?.data])

  const handleResetFilter = () => {
    setSelectedAccountId("")
    setDateFrom("")
    setDateTo("")
    setSortBy("transfer_date")
    setSortOrder("desc")
    setPage(1)
  }

  const hasFilter = Boolean(selectedAccountId || dateFrom || dateTo)

  return (
    <div className="space-y-3.5">
      {/* Filter Toolbar */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {/* Account Filter */}
          <div className="w-full sm:w-48">
            <CommandSelect
              options={accountFilterOptions}
              value={selectedAccountId}
              onChange={(val) => {
                setSelectedAccountId(val)
                setPage(1)
              }}
              placeholder="Filter akun..."
              size="sm"
            />
          </div>

          {/* Date Range Filter */}
          <DateRangeFilter
            dateFrom={dateFrom}
            dateTo={dateTo}
            onDateFromChange={(val) => {
              setDateFrom(val)
              setPage(1)
            }}
            onDateToChange={(val) => {
              setDateTo(val)
              setPage(1)
            }}
            size="sm"
          />

          {hasFilter && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleResetFilter}
              className="h-8 cursor-pointer gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <X size={12} />
              <span>Reset</span>
            </Button>
          )}
        </div>

        {/* Right Action */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void refetch()}
            disabled={isFetching}
            className="h-8.5 cursor-pointer rounded-xl border-border px-2.5 text-xs shadow-2xs"
            title="Muat ulang data transfer"
          >
            <RotateCw
              size={13}
              className={
                isFetching
                  ? "animate-spin text-primary"
                  : "text-muted-foreground"
              }
            />
          </Button>

          <Button
            type="button"
            onClick={onOpenCreateTransfer}
            className="h-8.5 cursor-pointer gap-1.5 rounded-xl px-3 text-xs font-semibold shadow-xs"
          >
            <ArrowLeftRight size={13} />
            <span>Transfer Kas Baru</span>
          </Button>
        </div>
      </div>

      {/* Main Table with Server Pagination */}
      <DataTable
        columns={columns}
        data={transfers}
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
        entityName="transfer kas"
        emptyMessage="Belum ada catatan transfer kas yang sesuai."
        maxActionButtons={5}
        onView={(item) => setDetailTransfer(item)}
      />

      {/* Detail Dialog */}
      <CashTransferDetailDialog
        open={Boolean(detailTransfer)}
        onOpenChange={(open) => !open && setDetailTransfer(null)}
        transfer={detailTransfer}
      />
    </div>
  )
}
