"use client"

import type { JSX } from "react"
import { FormProvider } from "react-hook-form"
import { CreditCard, Loader2, Sparkles } from "lucide-react"

import { BaseDialog } from "@/components/ui/base-dialog"
import { Button } from "@/components/ui/button"
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
    includeBase,
    selectedAddonIds,
    isAnnual,
    product,
    availableAddons,
    subscribedAddonsList,
    isLoadingProduct,
    currentExpiryText,
    calculation,
    setBillingPeriod,
    setIncludeBase,
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
      className="max-w-lg"
    >
      <FormProvider {...methods}>
        <form onSubmit={submitForm} className="space-y-4 pt-1 text-xs">
          {/* 1. Billing Period Selector */}
          <LicenseOrderPeriodSelector
            billingPeriod={billingPeriod}
            onSelectPeriod={setBillingPeriod}
          />

          {/* 2. Base Product Package */}
          <LicenseOrderBaseProduct
            productName={
              license.product?.nama || product?.nama || "Software Instance"
            }
            currentExpiryText={currentExpiryText}
            isAnnual={isAnnual}
            includeBase={includeBase}
            onToggleIncludeBase={setIncludeBase}
          />

          {/* 3. Add-on Modules */}
          <LicenseOrderAddonsList
            addons={availableAddons}
            isLoading={isLoadingProduct}
            selectedAddonIds={selectedAddonIds}
            isAnnual={isAnnual}
            subscribedAddons={subscribedAddonsList}
            onToggleAddon={handleToggleAddon}
          />

          {/* 4. Real-time Calculation & Order Summary */}
          <LicenseOrderSummary
            items={calculation.items}
            grandTotal={calculation.grandTotal}
            isAnnual={isAnnual}
          />

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="h-9 px-4 text-xs font-semibold cursor-pointer rounded-xl"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitDisabled}
              className="h-9 px-4 gap-2 text-xs font-semibold cursor-pointer rounded-xl shadow-xs bg-primary text-primary-foreground"
            >
              {isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Sparkles size={14} />
              )}
              <span>Terbitkan Tagihan & Pesan</span>
            </Button>
          </div>
        </form>
      </FormProvider>
    </BaseDialog>
  )
}
