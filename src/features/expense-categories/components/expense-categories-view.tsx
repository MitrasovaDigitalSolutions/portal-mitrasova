"use client"

import { useMemo, useState, type JSX } from "react"
import { motion } from "framer-motion"
import { FolderTree } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useDebounce } from "@/hooks"
import {
  useDeleteExpenseCategory,
  useExpenseCategories,
} from "../api/expense-category.queries"
import { getExpenseCategoryColumns } from "./expense-category-columns"
import { ExpenseCategoryFormDialog } from "./expense-category-form-dialog"
import {
  ExpenseCategoriesToolbar,
  type ExpenseCategoryStatusFilter,
} from "./expense-categories-toolbar"
import type { ExpenseCategory } from "../@types/expense-category"

export function ExpenseCategoriesView(): JSX.Element {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] =
    useState<ExpenseCategoryStatusFilter>("all")
  const [sortBy, setSortBy] = useState<string | undefined>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>("asc")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedForEdit, setSelectedForEdit] =
    useState<ExpenseCategory | null>(null)
  const [selectedForDelete, setSelectedForDelete] =
    useState<ExpenseCategory | null>(null)

  const debouncedSearch = useDebounce(search, 400)

  const { data, isLoading, isFetching, refetch } = useExpenseCategories({
    search: debouncedSearch.trim() || undefined,
    is_active: statusFilter === "all" ? undefined : statusFilter === "active",
    sort_by: sortBy,
    sort_order: sortOrder,
  })
  const deleteMutation = useDeleteExpenseCategory()

  const categories = useMemo(() => data?.data ?? [], [data?.data])
  const columns = useMemo(() => getExpenseCategoryColumns(), [])

  const handleDelete = async () => {
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
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <FolderTree size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-foreground">
                Kategori Pengeluaran
              </h1>
              <Badge variant="secondary" className="font-mono text-xs">
                {categories.length} Kategori
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Klasifikasi jenis beban biaya, tagihan rutin, dan pos pengeluaran
              kas.
            </p>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="space-y-3.5 rounded-xl border border-border bg-card p-4 shadow-xs">
        <ExpenseCategoriesToolbar
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          isFetching={isFetching}
          onRefresh={() => void refetch()}
          onAddCategory={() => setIsCreateOpen(true)}
        />

        <DataTable
          columns={columns}
          data={categories}
          isLoading={isLoading}
          isFetching={isFetching}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={(col, order) => {
            setSortBy(col)
            setSortOrder(order)
          }}
          maxActionButtons={5}
          entityName="kategori pengeluaran"
          emptyMessage="Belum ada data kategori pengeluaran yang sesuai."
          onEdit={(cat) => setSelectedForEdit(cat)}
          onDelete={(cat) => setSelectedForDelete(cat)}
        />
      </div>

      {/* Create / Edit Form Dialog */}
      <ExpenseCategoryFormDialog
        open={isCreateOpen || Boolean(selectedForEdit)}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false)
            setSelectedForEdit(null)
          }
        }}
        category={selectedForEdit}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(selectedForDelete)}
        onOpenChange={(open) => !open && setSelectedForDelete(null)}
        title="Hapus Kategori Pengeluaran"
        description={
          <span>
            Apakah Anda yakin ingin menghapus kategori{" "}
            <strong className="text-foreground">
              {selectedForDelete?.name}
            </strong>
            ? Kategori yang sudah terhubung dengan catatan pengeluaran tidak
            dapat dihapus.
          </span>
        }
        confirmText="Hapus Kategori"
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </motion.div>
  )
}
