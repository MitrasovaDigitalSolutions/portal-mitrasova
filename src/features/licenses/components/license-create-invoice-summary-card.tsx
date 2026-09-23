"use client"

import type { JSX } from "react"
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
import { FormSwitch } from "@/components/forms"
import { formatCurrency } from "@/utils"
import type { CheckCouponResponse } from "../@types/license"

interface LicenseCreateInvoiceSummaryCardProps {
  createInvoice: boolean
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
  createInvoice,
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
  return (
    <div className="rounded-xl border border-border bg-card shadow-xs p-4 space-y-4 lg:sticky lg:top-4">
      {/* Card Header */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-3">
        <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <Receipt size={15} />
        </div>
        <div>
          <h2 className="text-xs font-bold text-foreground">
            Ringkasan Tagihan & Faktur
          </h2>
          <p className="text-[11px] text-muted-foreground">
            Estimasi kalkulasi biaya awal dan invoice otomatis.
          </p>
        </div>
      </div>

      {/* Auto Create Invoice Switch */}
      <div className="rounded-xl border border-border bg-muted/20 p-3">
        <FormSwitch
          name="create_invoice"
          label="Otomatis Buat Faktur Tagihan"
          description="Sistem akan menerbitkan invoice pembayaran awal yang dapat diunduh klien."
        />
      </div>

      {createInvoice && (
        <div className="space-y-4 pt-1">
          {/* Billing Period Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Periode Penagihan Invoice
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onBillingPeriodChange("annual")}
                className={`py-1.5 px-3 rounded-lg border text-xs font-medium transition-all cursor-pointer flex flex-col items-center ${
                  isAnnual
                    ? "border-primary bg-primary/10 text-primary font-semibold shadow-2xs"
                    : "border-border bg-muted/30 text-muted-foreground hover:bg-muted/60"
                }`}
              >
                <span>Tahunan (12 Bln)</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  Hemat & Rekomendasi
                </span>
              </button>

              <button
                type="button"
                onClick={() => onBillingPeriodChange("monthly")}
                className={`py-1.5 px-3 rounded-lg border text-xs font-medium transition-all cursor-pointer flex flex-col items-center justify-center ${
                  !isAnnual
                    ? "border-primary bg-primary/10 text-primary font-semibold shadow-2xs"
                    : "border-border bg-muted/30 text-muted-foreground hover:bg-muted/60"
                }`}
              >
                <span>Bulanan (1 Bln)</span>
                <span className="text-[10px] text-muted-foreground">
                  Fleksibel
                </span>
              </button>
            </div>
          </div>

          {/* Coupon Input & Verification */}
          <div className="space-y-1.5 border-t border-border/60 pt-3">
            <label className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Tag size={13} className="text-amber-500" />
                <span>Kupon Diskon (Opsional)</span>
              </span>
              {couponResult && (
                <span className="text-[10px] text-emerald-600 font-normal">
                  Kupon Aktif
                </span>
              )}
            </label>

            {!couponResult ? (
              <div className="flex items-center gap-2">
                <Input
                  value={enteredCouponCode ?? ""}
                  onChange={(e) => onCouponCodeChange(e.target.value.toUpperCase())}
                  placeholder="Ketik kode kupon promo..."
                  className="h-8 text-xs font-mono uppercase bg-background"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onCheckCoupon}
                  disabled={isCheckingCoupon || !enteredCouponCode}
                  className="h-8 px-3 text-xs shrink-0 cursor-pointer font-medium"
                >
                  {isCheckingCoupon ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <span>Terapkan</span>
                  )}
                </Button>
              </div>
            ) : (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2.5 flex items-center justify-between gap-2 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 size={13} />
                    <span>{couponResult.code}</span>
                    <span className="font-normal text-[11px]">
                      ({couponResult.name})
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground font-mono">
                    Potongan: -{couponResult.formatted_discount}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onRemoveCoupon}
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive cursor-pointer"
                  title="Hapus kupon"
                >
                  <Trash2 size={13} />
                </Button>
              </div>
            )}

            {couponError && (
              <p className="text-[11px] text-destructive leading-tight">
                {couponError}
              </p>
            )}
          </div>

          {/* Itemized Calculation Breakdown */}
          <div className="space-y-2 border-t border-border/60 pt-3">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Rincian Item Tagihan
            </span>

            {orderCalculation.items.length === 0 ? (
              <p className="text-[11px] text-muted-foreground italic">
                Belum ada produk atau add-on yang dipilih.
              </p>
            ) : (
              <div className="space-y-1.5 text-xs max-h-48 overflow-y-auto pr-1">
                {orderCalculation.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-muted-foreground gap-2"
                  >
                    <span className="truncate text-[11px]">{item.name}</span>
                    <span className="font-mono text-[11px] text-foreground shrink-0 font-medium">
                      {formatCurrency(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-border/60 pt-2 space-y-1 text-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Subtotal Kotor</span>
                <span className="font-mono text-foreground">
                  {formatCurrency(orderCalculation.grossSubtotal)}
                </span>
              </div>

              {orderCalculation.discount > 0 && (
                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Sparkles size={12} />
                    <span>Diskon Kupon</span>
                  </span>
                  <span className="font-mono">
                    -{formatCurrency(orderCalculation.discount)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-sm font-bold text-foreground pt-1 border-t border-border/60">
                <span>Total Tagihan Awal</span>
                <span className="font-mono text-primary text-base">
                  {formatCurrency(orderCalculation.netTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-2 border-t border-border/60">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-10 gap-2 text-xs font-bold cursor-pointer rounded-xl shadow-xs"
        >
          {isSubmitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <FileText size={16} />
          )}
          <span>Terbitkan Lisensi Baru</span>
        </Button>
      </div>
    </div>
  )
}
