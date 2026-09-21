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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
      <div className="flex items-center gap-3">
        <Link
          href="/products"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer shrink-0"
          title="Kembali ke Daftar Produk"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight text-foreground">
              {product?.nama ?? "Memuat Produk..."}
            </h1>
            {product?.code && (
              <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 font-bold text-primary">
                {product.code}
              </span>
            )}
            {product && (
              product.is_active ? (
                <Badge variant="success" className="gap-1 text-[10px]">
                  <CheckCircle2 className="size-2.5" />
                  Aktif
                </Badge>
              ) : (
                <Badge variant="outline" className="gap-1 text-[10px] text-muted-foreground">
                  <XCircle className="size-2.5" />
                  Non-Aktif
                </Badge>
              )
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Kelola konfigurasi produk utama, status aktivasi, dan daftar modul addon pelengkap
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isFetching}
          className="h-9 px-3 gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <RotateCw className={cn("size-3.5", isFetching && "animate-spin")} />
          <span className="hidden sm:inline">Segarkan</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onEdit}
          disabled={!product}
          className="h-9 px-3 gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <Pencil className="size-3.5" />
          <span>Edit Produk</span>
        </Button>

        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={onDelete}
          disabled={!product}
          className="h-9 px-3 gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <Trash2 className="size-3.5" />
          <span>Hapus</span>
        </Button>
      </div>
    </div>
  )
}
