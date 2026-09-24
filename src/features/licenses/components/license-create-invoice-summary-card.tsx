"use client"

import type { JSX, KeyboardEvent } from "react"
import {
  CheckCircle2,
  FileText,
  Loader2,
  Receipt,
  Sparkles,
  Tag,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatCurrency } from "@/utils"
import type { CheckCouponResponse } from "../@types/license"

interface LicenseCreateInvoiceSummaryCardProps {
  isAnnual: boolean
  isSubmitting: boolean
  enteredCouponCode?: string | null
  isCheckingCoupon: boolean
  couponResult: CheckCouponResponse["coupon"] | null
  couponError: string | null
  orderCalculation: {
    items: Array<{
      name: string
      type: "product" | "server" | "addon"
      price: number
      qty: number
      subtotal: number
    }>
    grossSubtotal: number
    discount: number
    netTotal: number
  }
  onBillingPeriodChange: (val: "monthly" | "annual") => void
  onCouponCodeChange: (val: string) => void
  onCheckCoupon: () => void
  onRemoveCoupon: () => void
}

export function LicenseCreateInvoiceSummaryCard({
  isAnnual,
  isSubmitting,
  enteredCouponCode,
  isCheckingCoupon,
  couponResult,
  couponError,
  orderCalculation,
  onBillingPeriodChange,
  onCouponCodeChange,
  onCheckCoupon,
  onRemoveCoupon,
}: LicenseCreateInvoiceSummaryCardProps): JSX.Element {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      onCheckCoupon()
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-xs p-3.5 sm:p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Receipt size={15} />
          </div>
          <div>
            <h2 className="text-xs font-bold text-foreground">
              Ringkasan Tagihan & Faktur
            </h2>
            <p className="text-[11px] text-muted-foreground">
              Kalkulasi biaya awal dan invoice otomatis.
            </p>
          </div>
        </div>
      </div>

      {/* Billing Period Segmented Tabs */}
      <div className="space-y-1">
        <span className="text-[11px] font-semibold text-muted-foreground block">
          Siklus Penagihan Faktur
        </span>
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-lg bg-muted/40 border border-border/60">
          <button
            type="button"
            onClick={() => onBillingPeriodChange("annual")}
            className={`py-1 px-2 rounded-md text-xs font-medium transition-all cursor-pointer flex flex-col items-center justify-center ${
              isAnnual
                ? "bg-background text-primary font-bold shadow-xs border border-border/60"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Tahunan (1 Thn)</span>
            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold leading-tight">
              Hemat & Disarankan
            </span>
          </button>

          <button
            type="button"
            onClick={() => onBillingPeriodChange("monthly")}
            className={`py-1 px-2 rounded-md text-xs font-medium transition-all cursor-pointer flex flex-col items-center justify-center ${
              !isAnnual
                ? "bg-background text-primary font-bold shadow-xs border border-border/60"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Bulanan (1 Bln)</span>
            <span className="text-[9px] text-muted-foreground leading-tight">
              Fleksibel
            </span>
          </button>
        </div>
      </div>

      {/* Itemized Calculation Breakdown */}
      <div className="space-y-1.5 border-t border-border/60 pt-2.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
            Item Biaya
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            {orderCalculation.items.length} item
          </span>
        </div>

        {orderCalculation.items.length === 0 ? (
          <p className="text-[11px] text-muted-foreground/80 italic py-1">
            Pilih produk aplikasi untuk melihat rincian biaya.
          </p>
        ) : (
          <div className="space-y-1 text-xs max-h-36 overflow-y-auto pr-1">
            {orderCalculation.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground py-0.5"
              >
                <span className="truncate flex-1">{item.name}</span>
                <span className="font-mono text-foreground font-medium shrink-0">
                  {formatCurrency(item.subtotal)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Coupon Code Section */}
      <div className="space-y-1.5 border-t border-border/60 pt-2.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1 font-semibold text-muted-foreground text-[10px] uppercase tracking-wider">
            <Tag size={11} className="text-amber-500" />
            <span>Kupon Diskon Promo</span>
          </span>
          {couponResult && (
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
              Aktif
            </span>
          )}
        </div>

        {!couponResult ? (
          <div className="flex items-center gap-1.5">
            <Input
              value={enteredCouponCode ?? ""}
              onChange={(e) => onCouponCodeChange(e.target.value.toUpperCase())}
              onKeyDown={handleKeyDown}
              placeholder="Kode kupon..."
              className="h-8 text-xs font-mono uppercase bg-background"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCheckCoupon}
              disabled={isCheckingCoupon || !enteredCouponCode}
              className="h-8 px-2.5 text-xs shrink-0 cursor-pointer font-medium"
            >
              {isCheckingCoupon ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <span>Terapkan</span>
              )}
            </Button>
          </div>
        ) : (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 flex items-center justify-between gap-2 text-xs">
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400 text-[11px]">
                <CheckCircle2 size={12} className="shrink-0" />
                <span className="font-mono">{couponResult.code}</span>
              </div>
              <div className="text-[10px] text-muted-foreground font-mono">
                Hemat: -{couponResult.formatted_discount}
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRemoveCoupon}
              className="size-6 p-0 text-muted-foreground hover:text-destructive cursor-pointer"
              title="Hapus kupon"
            >
              <Trash2 size={12} />
            </Button>
          </div>
        )}

        {couponError && (
          <p className="text-[10px] text-destructive leading-tight">
            {couponError}
          </p>
        )}
      </div>

      {/* Pricing Totals */}
      <div className="border-t border-border/60 pt-2 space-y-1 text-xs">
        <div className="flex items-center justify-between text-muted-foreground text-[11px]">
          <span>Subtotal</span>
          <span className="font-mono text-foreground">
            {formatCurrency(orderCalculation.grossSubtotal)}
          </span>
        </div>

        {orderCalculation.discount > 0 && (
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
            <span className="flex items-center gap-1">
              <Sparkles size={11} />
              <span>Potongan Promo</span>
            </span>
            <span className="font-mono">
              -{formatCurrency(orderCalculation.discount)}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm font-bold text-foreground pt-1.5 border-t border-border/60">
          <span className="text-xs">Total Tagihan Awal</span>
          <span className="font-mono text-primary text-base">
            {formatCurrency(orderCalculation.netTotal)}
          </span>
        </div>
      </div>

      {/* Primary Submit Button */}
      <div className="pt-1.5 border-t border-border/60">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-9.5 gap-2 text-xs font-bold cursor-pointer rounded-xl shadow-xs"
        >
          {isSubmitting ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <FileText size={15} />
          )}
          <span>Terbitkan Lisensi Baru</span>
        </Button>
      </div>
    </div>
  )
}
