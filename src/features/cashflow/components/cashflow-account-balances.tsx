"use client"

import type { JSX } from "react"
import {
  Building2,
  CreditCard,
  Landmark,
  Smartphone,
  Wallet,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { formatRupiah } from "@/hooks/use-format-rupiah"
import type { CashflowSummaryAccount } from "../@types/cashflow"

interface CashflowAccountBalancesProps {
  accounts: CashflowSummaryAccount[] | undefined
  isLoading?: boolean
}

function getAccountTypeBadge(type: string): {
  label: string
  icon: typeof Landmark
} {
  switch (type) {
    case "bank":
      return { label: "Bank Transfer", icon: Landmark }
    case "cash":
      return { label: "Kas Tunai", icon: Wallet }
    case "e-wallet":
      return { label: "E-Wallet / QRIS", icon: Smartphone }
    default:
      return { label: "Lainnya", icon: CreditCard }
  }
}

export function CashflowAccountBalances({
  accounts = [],
  isLoading = false,
}: CashflowAccountBalancesProps): JSX.Element {
  return (
    <Card className="rounded-xl border border-border bg-card p-4 shadow-2xs">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
            <Building2 size={14} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-foreground">
              Saldo per Akun Kas
            </h3>
            <p className="text-[10px] text-muted-foreground">
              Rincian likuiditas kas aktif saat ini
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-[10px]">
          {accounts.length} Akun
        </Badge>
      </div>

      <div className="mt-3">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="h-20 animate-pulse rounded-lg border border-border/60 bg-muted/40"
              />
            ))}
          </div>
        ) : accounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
            <Wallet className="size-8 stroke-1 text-muted-foreground/60" />
            <p className="mt-2 text-xs">
              Belum ada data akun kas yang terdaftar.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {accounts.map((acc) => {
              const typeInfo = getAccountTypeBadge(acc.type)
              const Icon = typeInfo.icon
              return (
                <div
                  key={acc.id}
                  className="flex flex-col justify-between rounded-xl border border-border/70 bg-background/50 p-3 transition-colors hover:border-primary/30"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-xs font-semibold text-foreground">
                          {acc.name}
                        </span>
                        {acc.is_default && (
                          <Badge
                            variant="secondary"
                            className="h-4 px-1 text-[9px] font-semibold text-primary"
                          >
                            Utama
                          </Badge>
                        )}
                      </div>
                      <p className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground">
                        {acc.account_number ?? "Tanpa No. Rek"}
                      </p>
                    </div>
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-md border border-border bg-muted/60 text-muted-foreground">
                      <Icon size={12} />
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-baseline justify-between border-t border-border/40 pt-2">
                    <span className="text-[10px] text-muted-foreground">
                      {typeInfo.label}
                    </span>
                    <span className="font-mono text-xs font-bold text-foreground">
                      {formatRupiah(acc.current_balance)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Card>
  )
}
