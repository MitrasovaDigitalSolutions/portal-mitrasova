"use client"

import type { JSX } from "react"
import { FilterX, Plus, Wallet } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CashAccountCard } from "./cash-account-card"
import type { CashAccount } from "../@types/cash-account"

interface CashAccountsBarProps {
  accounts: CashAccount[]
  isLoading?: boolean
  selectedAccountId: number | null
  onSelectAccount: (accountId: number | null) => void
  onOpenCreate: () => void
  onAction: (account: CashAccount, type: "debit" | "credit") => void
  onEdit: (account: CashAccount) => void
  onDelete: (account: CashAccount) => void
}

export function CashAccountsBar({
  accounts,
  isLoading = false,
  selectedAccountId,
  onSelectAccount,
  onOpenCreate,
  onAction,
  onEdit,
  onDelete,
}: CashAccountsBarProps): JSX.Element {
  const selectedAccount = accounts.find((acc) => acc.id === selectedAccountId)

  return (
    <div className="space-y-2">
      {/* Bar Header: Judul, Counter, dan Tombol Reset Filter */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
            Daftar Akun Kas
          </h3>
          <Badge variant="outline" className="px-1.5 text-[10px]">
            {accounts.length}
          </Badge>
          {selectedAccountId !== null && (
            <div className="flex items-center gap-1.5 pl-1">
              <span className="text-[11px] font-medium text-muted-foreground">
                Filter:{" "}
                <span className="font-bold text-foreground">
                  {selectedAccount?.name ?? `#${selectedAccountId}`}
                </span>
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onSelectAccount(null)}
                className="h-5 px-1.5 text-[10px] text-primary hover:text-primary"
              >
                <FilterX className="mr-1 size-3" />
                Semua
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Baris Kartu Akun Kas (Scrollable Horizontal Bersih) */}
      <div className="-mx-1 no-scrollbar flex items-stretch gap-2.5 overflow-x-auto px-1 py-1">
        {/* Tombol Buat Kas Baru */}
        <button
          type="button"
          onClick={onOpenCreate}
          className="group flex w-[130px] shrink-0 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-3 text-center transition-all select-none hover:border-primary hover:bg-primary/10 sm:w-[140px]"
        >
          <div className="flex size-7.5 items-center justify-center rounded-lg bg-primary/15 text-primary shadow-2xs transition-all group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground">
            <Plus size={16} className="stroke-[2.5]" />
          </div>
          <span className="text-xs font-bold text-foreground">Tambah Kas</span>
        </button>

        {/* Loading Skeleton */}
        {isLoading &&
          [1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="w-[280px] shrink-0 animate-pulse rounded-xl border border-border bg-muted/30 p-3 sm:w-[300px]"
            />
          ))}

        {/* Empty State */}
        {!isLoading && accounts.length === 0 && (
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-dashed border-border bg-muted/20 p-3.5 text-muted-foreground">
            <Wallet className="size-5 text-muted-foreground/60" />
            <p className="text-xs">
              Belum ada akun kas. Klik &quot;Tambah Kas&quot; untuk menambahkan.
            </p>
          </div>
        )}

        {/* Daftar Kartu Akun Kas */}
        {!isLoading &&
          accounts.map((acc) => {
            const isSelected = selectedAccountId === acc.id
            return (
              <CashAccountCard
                key={acc.id}
                account={acc}
                isSelected={isSelected}
                onClick={() => onSelectAccount(isSelected ? null : acc.id)}
                onAction={onAction}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            )
          })}
      </div>
    </div>
  )
}
