"use client"

import type { JSX } from "react"
import { FormProvider } from "react-hook-form"
import { CreditCard, Loader2, Receipt, Sparkles } from "lucide-react"

import { BaseDialog } from "@/components/ui/base-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Scrollable } from "@/components/ui/scrollable"
import { formatCurrency } from "@/utils"
import type { Invoice } from "@/features/invoices/@types/invoice"
import type { License } from "../@types/license"
import { useLicenseOrder } from "../hooks/use-license-order"
import { LicenseOrderPeriodSelector } from "./license-order-period-selector"
import { LicenseOrderBaseProduct } from "./license-order-base-product"
import { LicenseOrderAddonsList } from "./license-order-addons-list"
import { LicenseOrderSummary } from "./license-order-summary"

export interface LicenseOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  license: License | null
  initialAddonId?: string | null
  onSuccessInvoiceCreated?: (invoice: Invoice) => void
}

export function LicenseOrderDialog({
  open,
  onOpenChange,
  license,
  initialAddonId,
  onSuccessInvoiceCreated,
}: LicenseOrderDialogProps): JSX.Element | null {
  const {
    methods,
    billingPeriod,
    selectedAddonIds,
    isAnnual,
    product,
    availableAddons,
    currentSubscribedAddonIds,
    isLoadingProduct,
    currentExpiryText,
    calculation,
    setBillingPeriod,
    handleToggleAddon,
    isPending,
    isSubmitDisabled,
    submitForm,
  } = useLicenseOrder({
    open,
    license,
    initialAddonId,
    onOpenChange,
    onSuccessInvoiceCreated,
  })

  if (!license) {
    return null
  }

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      scrollable={false}
      title={
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CreditCard size={15} />
          </div>
          <div>
            <div className="text-sm font-bold text-foreground">
              Beli Perpanjangan & Add-on
            </div>
            <p className="text-[11px] font-normal text-muted-foreground">
              Instance: {license.nama_instance} ({license.license_key})
            </p>
          </div>
        </div>
      }
      className="sm:max-w-4xl overflow-hidden"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={submitForm}
          className="flex flex-col min-h-0 flex-1 pt-1 text-xs"
        >
          {/* 2-Grid Layout: Left Column (Details & Breakdown), Right Column (Add-on List) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 min-h-0 flex-1 items-start">
            {/* Kolom Kiri: Detail & Biaya Pokok + Rincian Item */}
            <div className="flex flex-col min-h-0">
              <Scrollable
                className="h-[300px] md:h-[350px] pr-2.5"
                scrollbarClassName="z-20"
              >
                <div className="space-y-3.5 pr-1 pb-2">
                  {/* 1. Billing Period Selector */}
                  <LicenseOrderPeriodSelector
                    billingPeriod={billingPeriod}
                    onSelectPeriod={setBillingPeriod}
                  />

                  {/* 2. Base Product Package (with FormSwitch) */}
                  <LicenseOrderBaseProduct
                    productName={
                      license.product?.nama || product?.nama || "Software Instance"
                    }
                    currentExpiryText={currentExpiryText}
                    isAnnual={isAnnual}
                  />

                  {/* 3. Itemized Breakdown & Notice */}
                  <LicenseOrderSummary
                    items={calculation.items}
                    isAnnual={isAnnual}
                  />
                </div>
              </Scrollable>
            </div>

            {/* Kolom Kanan: List Add-on yang dapat diaktifkan / dinonaktifkan */}
            <div className="flex flex-col min-h-0">
              <Scrollable
                className="h-[300px] md:h-[350px] pr-2.5"
                scrollbarClassName="z-20"
              >
                <div className="space-y-3 pr-1 pb-2">
                  <LicenseOrderAddonsList
                    addons={availableAddons}
                    isLoading={isLoadingProduct}
                    selectedAddonIds={selectedAddonIds}
                    isAnnual={isAnnual}
                    currentSubscribedAddonIds={currentSubscribedAddonIds}
                    onToggleAddon={handleToggleAddon}
                  />
                </div>
              </Scrollable>
            </div>
          </div>

          {/* Footer: Live Total Tagihan + Action Buttons (Solid background, completely opaque, docked at dialog bottom) */}
          <div className="-mx-4 -mb-4 sm:-mx-6 sm:-mb-6 mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 border-t border-border bg-muted/60 dark:bg-muted/40 px-4 py-3.5 sm:px-6 sm:py-4 rounded-b-2xl shrink-0">
            {/* Total Tagihan Summary */}
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                <Receipt size={18} />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Total Tagihan
                  </span>
                  <Badge
                    variant="secondary"
                    className="text-[10px] font-mono px-1.5 py-0 h-4"
                  >
                    {isAnnual ? "12 Bulan" : "1 Bulan"}
                  </Badge>
                  {calculation.items.length > 0 && (
                    <span className="text-[10px] text-muted-foreground font-mono">
                      ({calculation.items.length} item)
                    </span>
                  )}
                </div>
                <div className="font-mono text-base sm:text-lg font-extrabold text-primary leading-tight">
                  {formatCurrency(calculation.grandTotal)}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
                className="h-9 px-4 text-xs font-semibold cursor-pointer rounded-xl bg-background hover:bg-muted"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitDisabled}
                className="h-9 px-5 gap-2 text-xs font-semibold cursor-pointer rounded-xl shadow-xs bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Sparkles size={14} />
                )}
                <span>Terbitkan Tagihan & Pesan</span>
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </BaseDialog>
  )
}
