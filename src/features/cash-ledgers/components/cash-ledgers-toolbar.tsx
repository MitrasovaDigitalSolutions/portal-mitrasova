"use client"

import type { JSX } from "react"
import { RotateCw, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CommandSelect } from "@/components/ui/command-select"
import { DateRangeFilter } from "@/components/shared"
import type { CashAccount } from "@/features/cash-accounts/@types/cash-account"
import {
  CASH_LEDGER_MUTATION_OPTIONS,
  CASH_LEDGER_TYPE_OPTIONS,
} from "../constants/cash-ledger-options"

export interface CashLedgersToolbarProps {
  accounts: CashAccount[]
  selectedAccountId: string
  onAccountIdChange: (id: string) => void
  selectedType: string
  onTypeChange: (type: string) => void
  selectedMutationType: string
  onMutationTypeChange: (mut: string) => void
  dateFrom: string
  onDateFromChange: (val: string) => void
  dateTo: string
  onDateToChange: (val: string) => void
  onResetFilters: () => void
  isFetching?: boolean
  onRefresh?: () => void
}

export function CashLedgersToolbar({
  accounts,
  selectedAccountId,
  onAccountIdChange,
  selectedType,
  onTypeChange,
  selectedMutationType,
  onMutationTypeChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  onResetFilters,
  isFetching,
  onRefresh,
}: CashLedgersToolbarProps): JSX.Element {
  const accountOptions = [
    { value: "", label: "Semua Akun Kas" },
    ...accounts.map((a) => ({ value: String(a.id), label: a.name })),
  ]

  const hasFilter = Boolean(
    selectedAccountId ||
    selectedType ||
    selectedMutationType ||
    dateFrom ||
    dateTo
  )

  return (
    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {/* Account Filter */}
        <div className="w-full sm:w-44">
          <CommandSelect
            options={accountOptions}
            value={selectedAccountId}
            onChange={onAccountIdChange}
            placeholder="Pilih akun..."
            size="sm"
          />
        </div>

        {/* Mutation Direction Filter */}
        <div className="w-full sm:w-40">
          <CommandSelect
            options={CASH_LEDGER_MUTATION_OPTIONS}
            value={selectedMutationType}
            onChange={onMutationTypeChange}
            placeholder="Arah mutasi..."
            size="sm"
          />
        </div>

        {/* Transaction Type Filter */}
        <div className="w-full sm:w-44">
          <CommandSelect
            options={CASH_LEDGER_TYPE_OPTIONS}
            value={selectedType}
            onChange={onTypeChange}
            placeholder="Tipe transaksi..."
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
            title="Muat ulang mutasi buku kas"
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
      </div>
    </div>
  )
}
