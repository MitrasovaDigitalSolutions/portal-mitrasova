"use client"

import { useMemo, useState, type JSX } from "react"
import { motion } from "framer-motion"
import { Receipt } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useCashAccounts } from "@/features/cash-accounts/api/cash-account.queries"
import { useExpenseCategories } from "@/features/expense-categories/api/expense-category.queries"
import { formatCurrency } from "@/utils"
import { useDeleteExpense, useExpenses } from "../api/expense.queries"
import { getExpenseColumns } from "./expense-columns"
import { ExpensesToolbar } from "./expenses-toolbar"
import { ExpenseFormDialog } from "./expense-form-dialog"
import { ExpenseDetailDialog } from "./expense-detail-dialog"
import type { Expense } from "../@types/expense"

export function ExpensesView(): JSX.Element {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(15)
  const [selectedCategoryId, setSelectedCategoryId] = useState("")
  const [selectedAccountId, setSelectedAccountId] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [sortBy, setSortBy] = useState<string | undefined>("transaction_date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>("desc")

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedForDetail, setSelectedForDetail] = useState<Expense | null>(
    null
  )
  const [selectedForDelete, setSelectedForDelete] = useState<Expense | null>(
    null
  )

  const { data: accountsData } = useCashAccounts({ is_active: true })
  const accounts = useMemo(() => accountsData?.data ?? [], [accountsData?.data])

  const { data: categoriesData } = useExpenseCategories({ is_active: true })
  const categories = useMemo(
    () => categoriesData?.data ?? [],
    [categoriesData?.data]
  )

  const { data, isLoading, isFetching, refetch } = useExpenses({
    page,
    per_page: perPage,
    expense_category_id: selectedCategoryId
      ? Number(selectedCategoryId)
      : undefined,
    cash_account_id: selectedAccountId ? Number(selectedAccountId) : undefined,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    sort_by: sortBy,
    sort_order: sortOrder,
  })

  const deleteMutation = useDeleteExpense()

  const expenses = useMemo(() => data?.data ?? [], [data?.data])
  const columns = useMemo(() => getExpenseColumns(), [])

  const handleResetFilters = () => {
    setSelectedCategoryId("")
    setSelectedAccountId("")
    setDateFrom("")
    setDateTo("")
    setSortBy("transaction_date")
    setSortOrder("desc")
    setPage(1)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedForDelete) {
      return
    }
    try {
      await deleteMutation.mutateAsync(selectedForDelete.id)
      setSelectedForDelete(null)
    } catch {
      // Handled by query toast
    }
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
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <Receipt size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-foreground">
                Pengeluaran Kas
              </h1>
            </div>
            <p className="text-xs text-muted-foreground">
              Catatan biaya operasional, tagihan server, pembayaran vendor, dan
              beban kas.
            </p>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="space-y-3.5 rounded-xl border border-border bg-card p-4 shadow-xs">
        <ExpensesToolbar
          categories={categories}
          accounts={accounts}
          selectedCategoryId={selectedCategoryId}
          onCategoryIdChange={(val) => {
            setSelectedCategoryId(val)
            setPage(1)
          }}
          selectedAccountId={selectedAccountId}
          onAccountIdChange={(val) => {
            setSelectedAccountId(val)
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
          onAddExpense={() => setIsCreateOpen(true)}
        />

        <DataTable
          columns={columns}
          data={expenses}
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
          entityName="pengeluaran kas"
          emptyMessage="Belum ada catatan pengeluaran kas yang sesuai kriteria."
          onView={(exp) => setSelectedForDetail(exp)}
          onDelete={(exp) => setSelectedForDelete(exp)}
        />
      </div>

      {/* Create Dialog */}
      <ExpenseFormDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />

      {/* Detail Dialog */}
      <ExpenseDetailDialog
        open={Boolean(selectedForDetail)}
        onOpenChange={(open) => !open && setSelectedForDetail(null)}
        expense={selectedForDetail}
      />

      {/* Delete / Refund Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(selectedForDelete)}
        onOpenChange={(open) => !open && setSelectedForDelete(null)}
        title="Batalkan & Hapus Pengeluaran"
        description={
          <span>
            Apakah Anda yakin ingin membatalkan pengeluaran{" "}
            <strong className="text-foreground">
              {selectedForDelete?.expense_number}
            </strong>{" "}
            sebesar{" "}
            <strong className="text-foreground">
              {selectedForDelete
                ? formatCurrency(Number(selectedForDelete.amount))
                : ""}
            </strong>
            ? Saldo akan dikembalikan secara otomatis ke akun kas asal.
          </span>
        }
        confirmText="Ya, Batalkan & Kembalikan Saldo"
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
      />
    </motion.div>
  )
}
