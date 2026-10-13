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
import { Scrollable } from "@/components/ui/scrollable"
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
  onSubmitLicense?: () => void
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
  onSubmitLicense,
}: LicenseCreateInvoiceSummaryCardProps): JSX.Element {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      onCheckCoupon()
    }
  }

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-3.5 shadow-xs sm:p-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
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
        <span className="block text-[11px] font-semibold text-muted-foreground">
          Siklus Penagihan Faktur
        </span>
        <div className="grid grid-cols-2 gap-1.5 rounded-lg border border-border/60 bg-muted/40 p-1">
          <button
            type="button"
            onClick={() => onBillingPeriodChange("annual")}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-md px-2 py-1 text-xs font-medium transition-all ${
              isAnnual
                ? "border border-border/60 bg-background font-bold text-primary shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Tahunan (1 Thn)</span>
            <span className="text-[9px] leading-tight font-semibold text-emerald-600 dark:text-emerald-400">
              Hemat & Disarankan
            </span>
          </button>

          <button
            type="button"
            onClick={() => onBillingPeriodChange("monthly")}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-md px-2 py-1 text-xs font-medium transition-all ${
              !isAnnual
                ? "border border-border/60 bg-background font-bold text-primary shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Bulanan (1 Bln)</span>
            <span className="text-[9px] leading-tight text-muted-foreground">
              Fleksibel
            </span>
          </button>
        </div>
      </div>

      {/* Itemized Calculation Breakdown */}
      <div className="space-y-1.5 border-t border-border/60 pt-2.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            Item Biaya
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            {orderCalculation.items.length} item
          </span>
        </div>

        {orderCalculation.items.length === 0 ? (
          <p className="py-1 text-[11px] text-muted-foreground/80 italic">
            Pilih produk aplikasi untuk melihat rincian biaya.
          </p>
        ) : (
          <Scrollable className="max-h-24 pr-1.5 sm:max-h-28">
            <div className="space-y-1 text-xs">
              {orderCalculation.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2 py-0.5 text-[11px] text-muted-foreground"
                >
                  <span className="flex-1 truncate" title={item.name}>
                    {item.name}
                  </span>
                  <span className="shrink-0 font-mono font-medium text-foreground">
                    {formatCurrency(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>
          </Scrollable>
        )}
      </div>

      {/* Coupon Code Section */}
      <div className="space-y-1.5 border-t border-border/60 pt-2.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
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
              className="h-8 bg-background font-mono text-xs uppercase"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCheckCoupon}
              disabled={isCheckingCoupon || !enteredCouponCode}
              className="h-8 shrink-0 cursor-pointer px-2.5 text-xs font-medium"
            >
              {isCheckingCoupon ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <span>Terapkan</span>
              )}
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-xs">
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 size={12} className="shrink-0" />
                <span className="font-mono">{couponResult.code}</span>
              </div>
              <div className="font-mono text-[10px] text-muted-foreground">
                Hemat: -{couponResult.formatted_discount}
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRemoveCoupon}
              className="size-6 cursor-pointer p-0 text-muted-foreground hover:text-destructive"
              title="Hapus kupon"
            >
              <Trash2 size={12} />
            </Button>
          </div>
        )}

        {couponError && (
          <p className="text-[10px] leading-tight text-destructive">
            {couponError}
          </p>
        )}
      </div>

      {/* Pricing Totals */}
      <div className="space-y-1 border-t border-border/60 pt-2 text-xs">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Subtotal</span>
          <span className="font-mono text-foreground">
            {formatCurrency(orderCalculation.grossSubtotal)}
          </span>
        </div>

        {orderCalculation.discount > 0 && (
          <div className="flex items-center justify-between text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            <span className="flex items-center gap-1">
              <Sparkles size={11} />
              <span>Potongan Promo</span>
            </span>
            <span className="font-mono">
              -{formatCurrency(orderCalculation.discount)}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-border/60 pt-1.5 text-sm font-bold text-foreground">
          <span className="text-xs">Total Tagihan Awal</span>
          <span className="font-mono text-base text-primary">
            {formatCurrency(orderCalculation.netTotal)}
          </span>
        </div>
      </div>

      {/* Primary Submit Button */}
      <div className="border-t border-border/60 pt-1.5">
        <Button
          type="submit"
          form="license-create-form"
          onClick={onSubmitLicense}
          disabled={isSubmitting}
          className="h-9 w-full cursor-pointer gap-2 rounded-xl text-xs font-bold shadow-xs"
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
