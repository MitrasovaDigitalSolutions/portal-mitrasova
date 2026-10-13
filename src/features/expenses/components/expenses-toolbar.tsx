"use client"

import type { JSX } from "react"
import { Plus, RotateCw, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CommandSelect } from "@/components/ui/command-select"
import { DateRangeFilter } from "@/components/shared"
import type { CashAccount } from "@/features/cash-accounts/@types/cash-account"
import type { ExpenseCategory } from "@/features/expense-categories/@types/expense-category"

export interface ExpensesToolbarProps {
  categories: ExpenseCategory[]
  accounts: CashAccount[]
  selectedCategoryId: string
  onCategoryIdChange: (id: string) => void
  selectedAccountId: string
  onAccountIdChange: (id: string) => void
  dateFrom: string
  onDateFromChange: (val: string) => void
  dateTo: string
  onDateToChange: (val: string) => void
  onResetFilters: () => void
  isFetching?: boolean
  onRefresh?: () => void
  onAddExpense: () => void
}

export function ExpensesToolbar({
  categories,
  accounts,
  selectedCategoryId,
  onCategoryIdChange,
  selectedAccountId,
  onAccountIdChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  onResetFilters,
  isFetching,
  onRefresh,
  onAddExpense,
}: ExpensesToolbarProps): JSX.Element {
  const categoryOptions = [
    { value: "", label: "Semua Kategori" },
    ...categories.map((c) => ({ value: String(c.id), label: c.name })),
  ]

  const accountOptions = [
    { value: "", label: "Semua Akun Kas" },
    ...accounts.map((a) => ({ value: String(a.id), label: a.name })),
  ]

  const hasFilter = Boolean(
    selectedCategoryId || selectedAccountId || dateFrom || dateTo
  )

  return (
    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {/* Category Filter */}
        <div className="w-full sm:w-44">
          <CommandSelect
            options={categoryOptions}
            value={selectedCategoryId}
            onChange={onCategoryIdChange}
            placeholder="Filter kategori..."
            size="sm"
          />
        </div>

        {/* Account Filter */}
        <div className="w-full sm:w-44">
          <CommandSelect
            options={accountOptions}
            value={selectedAccountId}
            onChange={onAccountIdChange}
            placeholder="Filter akun kas..."
            size="sm"
          />
        </div>

        {/* Date Range Filter */}
        <DateRangeFilter
          dateFrom={dateFrom}
          dateTo={dateTo}
          onDateFromChange={onDateFromChange}
          onDateToChange={onDateToChange}
          size="sm"
        />

        {hasFilter && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="h-8 cursor-pointer gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <X size={12} />
            <span>Reset</span>
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {onRefresh && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isFetching}
            className="h-8.5 cursor-pointer rounded-xl border-border px-2.5 text-xs shadow-2xs"
            title="Muat ulang data pengeluaran"
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
        )}

        <Button
          type="button"
          onClick={onAddExpense}
          className="h-8.5 cursor-pointer gap-1.5 rounded-xl bg-rose-600 px-3 text-xs font-semibold text-white shadow-xs hover:bg-rose-700"
        >
          <Plus size={13} />
          <span>Catat Pengeluaran</span>
        </Button>
      </div>
    </div>
  )
}
