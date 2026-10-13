"use client"

import type { JSX } from "react"
import {
  CreditCard,
  Landmark,
  Minus,
  Pencil,
  Plus,
  Smartphone,
  Trash2,
  Wallet,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatRupiah } from "@/hooks/use-format-rupiah"
import { cn } from "@/lib/utils"
import type { CashAccount } from "../@types/cash-account"

interface CashAccountCardProps {
  account: CashAccount
  isSelected: boolean
  onClick: () => void
  onAction: (account: CashAccount, type: "debit" | "credit") => void
  onEdit: (account: CashAccount) => void
  onDelete: (account: CashAccount) => void
  className?: string
}

function getAccountIcon(type: string) {
  switch (type) {
    case "bank":
      return Landmark
    case "cash":
      return Wallet
    case "payment_gateway":
    case "e-wallet":
      return Smartphone
    default:
      return CreditCard
  }
}

export function CashAccountCard({
  account,
  isSelected,
  onClick,
  onAction,
  onEdit,
  onDelete,
  className,
}: CashAccountCardProps): JSX.Element {
  const CardIcon = getAccountIcon(account.type)
  const isInactive = !account.is_active

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick()
        }
      }}
      className={cn(
        "flex w-[280px] shrink-0 cursor-pointer flex-col justify-between rounded-xl border p-3.5 transition-all select-none sm:w-[300px]",
        isSelected
          ? "border-primary bg-primary/5 shadow-xs ring-2 ring-primary/20"
          : isInactive
            ? "border-border/60 bg-muted/30 opacity-70"
            : "border-border bg-card hover:border-primary/40 hover:shadow-2xs",
        className
      )}
    >
      {/* ─── Header: Icon, Nama Kas, No Rekening, Aksi Edit/Delete ─── */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
            <CardIcon size={16} />
          </div>

          <div className="min-w-0 flex-1 leading-tight">
            <div className="flex items-center gap-1.5">
              <h4
                className="truncate text-xs font-bold text-foreground"
                title={account.name}
              >
                {account.name}
              </h4>
              {account.is_default && (
                <Badge
                  variant="secondary"
                  className="h-3.5 px-1 text-[8px] font-bold text-primary"
                >
                  Utama
                </Badge>
              )}
            </div>
            <p
              className="mt-0.5 truncate font-mono text-[10.5px] text-muted-foreground"
              title={account.account_number ?? "Kas Tunai"}
            >
              {account.account_number ?? "Kas Tunai"}
            </p>
          </div>
        </div>

        {/* Tombol Edit & Hapus Ringkas */}
        <div className="flex shrink-0 items-center">
          <button
            type="button"
            title="Ubah Akun"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(account)
            }}
            className="flex size-6 cursor-pointer items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Pencil size={11} />
          </button>

          <button
            type="button"
            title="Hapus Akun"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(account)
            }}
            className="flex size-6 cursor-pointer items-center justify-center rounded text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>

      {/* ─── Bawah: Nominal Saldo & Tombol Aksi In/Out ─── */}
      <div className="mt-3 flex items-baseline justify-between border-t border-border/50 pt-2.5">
        <div className="mr-2 min-w-0 flex-1">
          <div
            className="truncate font-mono text-base font-extrabold tracking-tight text-foreground sm:text-lg"
            title={formatRupiah(account.current_balance)}
          >
            {formatRupiah(account.current_balance)}
          </div>
        </div>

        {!isInactive ? (
          <div className="flex shrink-0 items-center gap-1">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                onAction(account, "credit") // Kas Masuk
              }}
              className="h-6.5 gap-1 rounded-md border-emerald-500/30 bg-emerald-500/10 px-2 text-[10px] font-bold text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400"
            >
              <Plus size={10} className="stroke-[3]" />
              In
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                onAction(account, "debit") // Kas Keluar
              }}
              className="h-6.5 gap-1 rounded-md border-rose-500/30 bg-rose-500/10 px-2 text-[10px] font-bold text-rose-600 hover:bg-rose-500/20 dark:text-rose-400"
            >
              <Minus size={10} className="stroke-[3]" />
              Out
            </Button>
          </div>
        ) : (
          <Badge variant="outline" className="h-5 px-1.5 text-[9px]">
            Nonaktif
          </Badge>
        )}
      </div>
    </div>
  )
}
