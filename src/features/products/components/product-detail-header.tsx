"use client"

import type React from "react"
import Link from "next/link"
import {
  ArrowLeft,
  RotateCw,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Product } from "../@types/product"

export interface ProductDetailHeaderProps {
  product: Product | undefined
  isFetching: boolean
  onRefresh: () => void
  onEdit: () => void
  onDelete: () => void
}

export function ProductDetailHeader({
  product,
  isFetching,
  onRefresh,
  onEdit,
  onDelete,
}: ProductDetailHeaderProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-3 border-b border-border pb-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2.5">
        <Link
          href="/products"
          className="flex h-8.5 w-8.5 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-border/80 bg-card text-muted-foreground shadow-2xs transition-colors hover:bg-muted hover:text-foreground"
          title="Kembali ke Daftar Produk"
        >
          <ArrowLeft size={15} />
        </Link>
        <div className="space-y-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
              {product?.nama ?? "Memuat Produk..."}
            </h1>
            {product?.code && (
              <span className="rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 font-mono text-xs font-bold text-primary shadow-2xs">
                {product.code}
              </span>
            )}
            {product &&
              (product.is_active ? (
                <Badge
                  variant="success"
                  className="gap-1 text-[10px] font-medium"
                >
                  <CheckCircle2 size={10} />
                  Aktif
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="gap-1 text-[10px] font-medium text-muted-foreground"
                >
                  <XCircle size={10} />
                  Non-Aktif
                </Badge>
              ))}
          </div>
          <p className="text-[11px] text-muted-foreground">
            Kelola konfigurasi produk, status aktivasi, dan katalog modul addon
            terhubung.
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 self-end sm:self-auto">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isFetching}
          className="h-8.5 cursor-pointer gap-1.5 rounded-xl border-border/80 bg-card px-2.5 text-xs font-medium shadow-2xs"
          title="Segarkan data"
        >
          <RotateCw
            size={12}
            className={cn(isFetching && "animate-spin text-primary")}
          />
          <span className="hidden sm:inline">Refresh</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onEdit}
          disabled={!product}
          className="h-8.5 cursor-pointer gap-1.5 rounded-xl border-border/80 bg-card px-3 text-xs font-medium shadow-2xs"
        >
          <Pencil size={12} />
          <span>Edit Produk</span>
        </Button>

        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={onDelete}
          disabled={!product}
          className="h-8.5 cursor-pointer gap-1.5 rounded-xl px-3 text-xs font-semibold shadow-2xs"
        >
          <Trash2 size={12} />
          <span>Hapus</span>
        </Button>
      </div>
    </div>
  )
}
