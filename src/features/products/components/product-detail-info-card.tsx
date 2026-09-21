"use client"

import type React from "react"
import {
  Package,
  Layers,
  KeyRound,
  Calendar,
  FileText,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { formatDate } from "@/utils"
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
    <div className="space-y-4">
      {/* 4 Metric Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Product Code */}
        <Card className="rounded-2xl border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Kode Unik Produk
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Package className="size-4" />
            </div>
          </div>
          <div className="mt-2 text-lg font-mono font-bold text-foreground">
            {product.code}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Identitas sistem terdaftar
          </p>
        </Card>

        {/* Card 2: Total Addons */}
        <Card className="rounded-2xl border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Modul Addon
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
              <Layers className="size-4" />
            </div>
          </div>
          <div className="mt-2 text-lg font-bold text-foreground">
            {addonsCount}{" "}
            <span className="text-xs font-normal text-muted-foreground">
              Modul
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Fitur tambahan tersedia
          </p>
        </Card>

        {/* Card 3: Licenses */}
        <Card className="rounded-2xl border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Lisensi Terhubung
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <KeyRound className="size-4" />
            </div>
          </div>
          <div className="mt-2 text-lg font-bold text-foreground">
            {licensesCount}{" "}
            <span className="text-xs font-normal text-muted-foreground">
              Instance
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Klien aktif menggunakan
          </p>
        </Card>

        {/* Card 4: Created Date */}
        <Card className="rounded-2xl border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Tanggal Dibuat
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-muted text-muted-foreground border border-border">
              <Calendar className="size-4" />
            </div>
          </div>
          <div className="mt-2 text-sm font-semibold text-foreground">
            {formatDate(product.created_at)}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Waktu registrasi sistem
          </p>
        </Card>
      </div>

      {/* Description Box */}
      {product.description && (
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs flex items-start gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground mt-0.5">
            <FileText className="size-3.5" />
          </div>
          <div className="space-y-0.5 flex-1">
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
