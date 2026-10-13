"use client"

import type React from "react"
import {
  Package,
  Layers,
  KeyRound,
  Calendar,
  FileText,
  CreditCard,
  Coins,
} from "lucide-react"
import { formatDate, formatCurrency } from "@/utils"
import type { Product } from "../@types/product"

export interface ProductDetailInfoCardProps {
  product: Product
  addonsCount: number
}

export function ProductDetailInfoCard({
  product,
  addonsCount,
}: ProductDetailInfoCardProps): React.JSX.Element {
  const licensesCount = product.licenses_count ?? 0

  return (
    <div className="space-y-3">
      {/* 4 Metric Overview Cards (2-col mobile, 4-col desktop) */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        {/* Card 1: Product Code */}
        <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-3 shadow-2xs transition-all hover:border-primary/25 hover:shadow-xs sm:p-3.5">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-[11px] font-medium text-muted-foreground">
              Kode Unik Produk
            </span>
            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
              <Package size={14} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between gap-2">
            <div className="font-mono text-base font-bold text-foreground sm:text-lg">
              {product.code}
            </div>
            <p className="truncate text-[10px] text-muted-foreground">
              Identitas terdaftar
            </p>
          </div>
        </div>

        {/* Card 2: Total Addons */}
        <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-3 shadow-2xs transition-all hover:border-primary/25 hover:shadow-xs sm:p-3.5">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-[11px] font-medium text-muted-foreground">
              Modul Addon
            </span>
            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Layers size={14} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between gap-2">
            <div className="font-mono text-base font-bold text-foreground sm:text-lg">
              {addonsCount}
            </div>
            <p className="truncate text-[10px] text-muted-foreground">
              Modul tersedia
            </p>
          </div>
        </div>

        {/* Card 3: Licenses */}
        <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-3 shadow-2xs transition-all hover:border-primary/25 hover:shadow-xs sm:p-3.5">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-[11px] font-medium text-muted-foreground">
              Lisensi Terhubung
            </span>
            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <KeyRound size={14} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between gap-2">
            <div className="font-mono text-base font-bold text-foreground sm:text-lg">
              {licensesCount}
            </div>
            <p className="truncate text-[10px] text-muted-foreground">
              Instance klien
            </p>
          </div>
        </div>

        {/* Card 4: Created Date */}
        <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-3 shadow-2xs transition-all hover:border-primary/25 hover:shadow-xs sm:p-3.5">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-[11px] font-medium text-muted-foreground">
              Tanggal Dibuat
            </span>
            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
              <Calendar size={14} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between gap-2">
            <div className="truncate text-xs font-semibold text-foreground sm:text-sm">
              {formatDate(product.created_at)}
            </div>
            <p className="truncate text-[10px] text-muted-foreground">
              Waktu registrasi
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Information Grid */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
        <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-3 shadow-2xs sm:p-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7.5 shrink-0 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Coins size={14} />
            </div>
            <div>
              <span className="block text-[11px] font-medium text-muted-foreground">
                Tarif Lisensi Pokok (Bulanan)
              </span>
              <span className="font-mono text-sm font-bold text-foreground sm:text-base">
                {product.harga_bulanan
                  ? formatCurrency(product.harga_bulanan)
                  : "Rp 0"}
              </span>
            </div>
          </div>
          <span className="font-mono text-[11px] text-muted-foreground">
            / bulan
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-3 shadow-2xs sm:p-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7.5 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CreditCard size={14} />
            </div>
            <div>
              <span className="block text-[11px] font-medium text-muted-foreground">
                Tarif Lisensi Pokok (Tahunan)
              </span>
              <span className="font-mono text-sm font-bold text-primary sm:text-base">
                {product.harga_tahunan
                  ? formatCurrency(product.harga_tahunan)
                  : "Rp 0"}
              </span>
            </div>
          </div>
          <span className="font-mono text-[11px] text-muted-foreground">
            / tahun
          </span>
        </div>
      </div>

      {/* Description Box */}
      {product.description && (
        <div className="flex items-start gap-2.5 rounded-xl border border-border bg-card p-3 shadow-2xs sm:p-3.5">
          <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <FileText size={13} />
          </div>
          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="text-xs font-semibold text-foreground">
              Deskripsi & Cakupan Produk
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
