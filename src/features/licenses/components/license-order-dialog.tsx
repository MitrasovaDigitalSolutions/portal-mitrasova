"use client"

import { Check, CreditCard, Loader2, Receipt } from "lucide-react"
import type { JSX } from "react"
import { FormProvider } from "react-hook-form"

import { Badge } from "@/components/ui/badge"
import { BaseDialog } from "@/components/ui/base-dialog"
import { Button } from "@/components/ui/button"
import { Scrollable } from "@/components/ui/scrollable"
import type { Invoice } from "@/features/invoices/@types/invoice"
import { formatCurrency } from "@/utils"
import type { License } from "../@types/license"
import { useLicenseOrder } from "../hooks/use-license-order"
import { LicenseOrderAddonsList } from "./license-order-addons-list"
import { LicenseOrderBaseProduct } from "./license-order-base-product"
import { LicenseOrderPeriodSelector } from "./license-order-period-selector"
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
    basePrice,
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
      className="overflow-hidden sm:max-w-4xl"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={submitForm}
          className="flex min-h-0 flex-1 flex-col pt-1 text-xs"
        >
          {/* 2-Grid Layout: Left Column (Details & Breakdown), Right Column (Add-on List) */}
          <div className="grid min-h-0 flex-1 grid-cols-1 items-start gap-4 md:grid-cols-2 md:gap-5">
            {/* Kolom Kiri: Detail & Biaya Pokok + Rincian Item */}
            <div className="flex min-h-0 flex-col">
              <Scrollable
                className="h-[300px] pr-2.5 md:h-[350px]"
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
                      license.product?.nama ||
                      product?.nama ||
                      "Software Instance"
                    }
                    currentExpiryText={currentExpiryText}
                    isAnnual={isAnnual}
                    price={basePrice}
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
            <div className="flex min-h-0 flex-col">
              <Scrollable
                className="h-[300px] pr-2.5 md:h-[350px]"
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
          <div className="-mx-4 mt-4 -mb-4 flex shrink-0 flex-col items-stretch justify-between gap-3.5 rounded-b-2xl border-t border-border bg-muted/60 px-4 py-3.5 sm:-mx-6 sm:-mb-6 sm:flex-row sm:items-center sm:px-6 sm:py-4 dark:bg-muted/40">
            {/* Total Tagihan Summary */}
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                <Receipt size={18} />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                    Total Tagihan
                  </span>
                  <Badge
                    variant="secondary"
                    className="h-4 px-1.5 py-0 font-mono text-[10px]"
                  >
                    {isAnnual ? "12 Bulan" : "1 Bulan"}
                  </Badge>
                  {calculation.items.length > 0 && (
                    <span className="font-mono text-[10px] text-muted-foreground">
                      ({calculation.items.length} item)
                    </span>
                  )}
                </div>
                <div className="font-mono text-base leading-tight font-extrabold text-primary sm:text-lg">
                  {formatCurrency(calculation.grandTotal)}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex shrink-0 items-center justify-end gap-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
                className="h-9 cursor-pointer rounded-xl bg-background px-4 text-xs font-semibold hover:bg-muted"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitDisabled}
                className="h-9 cursor-pointer gap-2 rounded-xl bg-primary px-5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90"
              >
                {isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Check size={14} />
                )}
                <span>Terbitkan Tagihan</span>
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </BaseDialog>
  )
}
