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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {/* Card 1: Product Code */}
        <div className="rounded-xl border border-border bg-card p-3 sm:p-3.5 shadow-2xs transition-all hover:border-primary/25 hover:shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-medium text-muted-foreground truncate">
              Kode Unik Produk
            </span>
            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
              <Package size={14} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between gap-2">
            <div className="text-base sm:text-lg font-mono font-bold text-foreground">
              {product.code}
            </div>
            <p className="text-[10px] text-muted-foreground truncate">
              Identitas terdaftar
            </p>
          </div>
        </div>

        {/* Card 2: Total Addons */}
        <div className="rounded-xl border border-border bg-card p-3 sm:p-3.5 shadow-2xs transition-all hover:border-primary/25 hover:shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-medium text-muted-foreground truncate">
              Modul Addon
            </span>
            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
              <Layers size={14} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between gap-2">
            <div className="text-base sm:text-lg font-bold font-mono text-foreground">
              {addonsCount}
            </div>
            <p className="text-[10px] text-muted-foreground truncate">
              Modul tersedia
            </p>
          </div>
        </div>

        {/* Card 3: Licenses */}
        <div className="rounded-xl border border-border bg-card p-3 sm:p-3.5 shadow-2xs transition-all hover:border-primary/25 hover:shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-medium text-muted-foreground truncate">
              Lisensi Terhubung
            </span>
            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <KeyRound size={14} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between gap-2">
            <div className="text-base sm:text-lg font-bold font-mono text-foreground">
              {licensesCount}
            </div>
            <p className="text-[10px] text-muted-foreground truncate">
              Instance klien
            </p>
          </div>
        </div>

        {/* Card 4: Created Date */}
        <div className="rounded-xl border border-border bg-card p-3 sm:p-3.5 shadow-2xs transition-all hover:border-primary/25 hover:shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-medium text-muted-foreground truncate">
              Tanggal Dibuat
            </span>
            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground border border-border">
              <Calendar size={14} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between gap-2">
            <div className="text-xs sm:text-sm font-semibold text-foreground truncate">
              {formatDate(product.created_at)}
            </div>
            <p className="text-[10px] text-muted-foreground truncate">
              Waktu registrasi
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Information Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
        <div className="rounded-xl border border-border bg-card p-3 sm:p-3.5 shadow-2xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7.5 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Coins size={14} />
            </div>
            <div>
              <span className="text-[11px] font-medium text-muted-foreground block">
                Tarif Lisensi Pokok (Bulanan)
              </span>
              <span className="font-mono text-sm sm:text-base font-bold text-foreground">
                {product.harga_bulanan ? formatCurrency(product.harga_bulanan) : "Rp 0"}
              </span>
            </div>
          </div>
          <span className="text-[11px] font-mono text-muted-foreground">/ bulan</span>
        </div>

        <div className="rounded-xl border border-border bg-card p-3 sm:p-3.5 shadow-2xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7.5 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CreditCard size={14} />
            </div>
            <div>
              <span className="text-[11px] font-medium text-muted-foreground block">
                Tarif Lisensi Pokok (Tahunan)
              </span>
              <span className="font-mono text-sm sm:text-base font-bold text-primary">
                {product.harga_tahunan ? formatCurrency(product.harga_tahunan) : "Rp 0"}
              </span>
            </div>
          </div>
          <span className="text-[11px] font-mono text-muted-foreground">/ tahun</span>
        </div>
      </div>

      {/* Description Box */}
      {product.description && (
        <div className="rounded-xl border border-border bg-card p-3 sm:p-3.5 shadow-2xs flex items-start gap-2.5">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground mt-0.5">
            <FileText size={13} />
          </div>
          <div className="space-y-0.5 flex-1 min-w-0">
            <div className="text-xs font-semibold text-foreground">
              Deskripsi & Cakupan Produk
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
