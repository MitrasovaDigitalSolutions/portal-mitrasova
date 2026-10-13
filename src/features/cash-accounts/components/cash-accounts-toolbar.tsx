"use client"

import type { JSX } from "react"
import { ArrowLeftRight, Plus, RotateCw, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { CASH_ACCOUNT_STATUS_TABS } from "../constants/cash-account-options"
import type { CashAccountStatusFilter } from "../@types/cash-account"

export interface CashAccountsToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: CashAccountStatusFilter
  onStatusFilterChange: (filter: CashAccountStatusFilter) => void
  isFetching?: boolean
  onRefresh?: () => void
  onAddAccount: () => void
  onTransferClick: () => void
}

export function CashAccountsToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  isFetching,
  onRefresh,
  onAddAccount,
  onTransferClick,
}: CashAccountsToolbarProps): JSX.Element {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Left: Search & Filter Tabs */}
      <div className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:items-center">
        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search
            size={13}
            className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari nama akun, no. rekening..."
            className="h-8.5 rounded-xl bg-background pr-7 pl-8 text-xs"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
              title="Hapus pencarian"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 rounded-xl border border-border bg-muted/50 p-1 text-xs">
          {CASH_ACCOUNT_STATUS_TABS.map((tab) => {
            const isSelected = statusFilter === tab.value
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onStatusFilterChange(tab.value)}
                className={cn(
                  "cursor-pointer rounded-lg px-2.5 py-1 text-xs font-semibold transition-all",
                  isSelected
                    ? "bg-card font-bold text-foreground shadow-2xs"
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {onRefresh && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isFetching}
            className="h-8.5 cursor-pointer rounded-xl border-border px-2.5 text-xs shadow-2xs"
            title="Muat ulang data akun"
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
          variant="outline"
          onClick={onTransferClick}
          className="h-8.5 cursor-pointer gap-1.5 rounded-xl border-border px-3 text-xs font-semibold shadow-2xs"
        >
          <ArrowLeftRight size={13} className="text-primary" />
          <span>Transfer Kas</span>
        </Button>

        <Button
          type="button"
          onClick={onAddAccount}
          className="h-8.5 cursor-pointer gap-1.5 rounded-xl px-3 text-xs font-semibold shadow-xs"
        >
          <Plus size={13} />
          <span>Tambah Akun</span>
        </Button>
      </div>
    </div>
  )
}
