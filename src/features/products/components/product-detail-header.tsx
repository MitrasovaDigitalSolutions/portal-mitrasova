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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-3">
      <div className="flex items-center gap-2.5">
        <Link
          href="/products"
          className="flex h-8.5 w-8.5 items-center justify-center rounded-xl border border-border/80 bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer shrink-0 shadow-2xs"
          title="Kembali ke Daftar Produk"
        >
          <ArrowLeft size={15} />
        </Link>
        <div className="space-y-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
              {product?.nama ?? "Memuat Produk..."}
            </h1>
            {product?.code && (
              <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 font-bold text-primary shadow-2xs">
                {product.code}
              </span>
            )}
            {product && (
              product.is_active ? (
                <Badge variant="success" className="gap-1 text-[10px] font-medium">
                  <CheckCircle2 size={10} />
                  Aktif
                </Badge>
              ) : (
                <Badge variant="outline" className="gap-1 text-[10px] text-muted-foreground font-medium">
                  <XCircle size={10} />
                  Non-Aktif
                </Badge>
              )
            )}
          </div>
          <p className="text-[11px] text-muted-foreground">
            Kelola konfigurasi produk, status aktivasi, dan katalog modul addon terhubung.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isFetching}
          className="h-8.5 px-2.5 rounded-xl gap-1.5 text-xs font-medium cursor-pointer border-border/80 bg-card shadow-2xs"
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
          className="h-8.5 px-3 rounded-xl gap-1.5 text-xs font-medium cursor-pointer border-border/80 bg-card shadow-2xs"
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
          className="h-8.5 px-3 rounded-xl gap-1.5 text-xs font-semibold cursor-pointer shadow-2xs"
        >
          <Trash2 size={12} />
          <span>Hapus</span>
        </Button>
      </div>
    </div>
  )
}
