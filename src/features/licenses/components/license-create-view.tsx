"use client"

import type { JSX } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, KeyRound } from "lucide-react"
import { FormProvider } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { useCreateLicenseForm } from "../hooks/use-create-license-form"
import { LicenseCreateSoftwareCard } from "./license-create-software-card"
import { LicenseCreateServerCard } from "./license-create-server-card"
import { LicenseCreateAddonsCard } from "./license-create-addons-card"
import { LicenseCreateInvoiceSummaryCard } from "./license-create-invoice-summary-card"

export function LicenseCreateView(): JSX.Element {
  const {
    methods,
    clients,
    products,
    serverPackages,
    selectedProductId,
    selectedServerPackage,
    detailedProduct,
    builtInAddons,
    purchasableAddons,
    selectedAddonIds,
    isLoadingClients,
    isLoadingProducts,
    isLoadingServers,
    isLoadingProductDetail,
    isSubmitting,
    isAnnual,
    isLifetime,
    enteredCouponCode,
    isCheckingCoupon,
    couponResult,
    couponError,
    orderCalculation,
    handleToggleAddon,
    handleSelectAllAddons,
    handleClearAddons,
    handleCheckCoupon,
    handleRemoveCoupon,
    submitForm,
  } = useCreateLicenseForm()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-7xl space-y-3.5 pb-10"
    >
      {/* Top Header Bar (Ultra-Compact) */}
      <div className="flex items-center justify-between gap-2.5 rounded-xl border border-border bg-card px-3.5 py-2.5 shadow-xs">
        <div className="flex items-center gap-2.5">
          <Link href="/licenses">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 w-8 shrink-0 cursor-pointer rounded-lg p-0"
              title="Kembali ke Daftar Lisensi"
            >
              <ArrowLeft size={15} />
            </Button>
          </Link>

          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
            <KeyRound size={17} />
          </div>

          <div>
            <h1 className="text-sm font-bold text-foreground sm:text-base">
              Terbitkan Lisensi Instance Baru
            </h1>
            <p className="text-[11px] leading-tight text-muted-foreground">
              Konfigurasi instance, paket server hosting, modul add-on, dan
              terbitkan faktur otomatis.
            </p>
          </div>
        </div>
      </div>

      {/* Main Form Area */}
      <FormProvider {...methods}>
        <form id="license-create-form" onSubmit={submitForm}>
          <div className="grid grid-cols-1 items-start gap-3.5 sm:gap-4 lg:grid-cols-12">
            {/* Left Column: Form Details (8 cols) */}
            <div className="space-y-3.5 lg:col-span-7 xl:col-span-8">
              <LicenseCreateSoftwareCard
                clients={clients}
                products={products}
                isLoadingClients={isLoadingClients}
                isLoadingProducts={isLoadingProducts}
                selectedProduct={detailedProduct}
                isLifetime={isLifetime}
              />

              <LicenseCreateServerCard
                serverPackages={serverPackages}
                isLoadingServers={isLoadingServers}
                selectedServerPackage={selectedServerPackage}
              />

              <LicenseCreateAddonsCard
                hasSelectedProduct={Boolean(selectedProductId)}
                isLoadingProductDetail={isLoadingProductDetail}
                builtInAddons={builtInAddons}
                purchasableAddons={purchasableAddons}
                selectedAddonIds={selectedAddonIds}
                isAnnual={isAnnual}
                onToggleAddon={handleToggleAddon}
                onSelectAllAddons={handleSelectAllAddons}
                onClearAddons={handleClearAddons}
              />
            </div>

            {/* Right Column: Invoice & Summary (4 cols) - Sticky when scrolling */}
            <div className="self-start lg:sticky lg:top-3 lg:col-span-5 xl:col-span-4">
              <LicenseCreateInvoiceSummaryCard
                isAnnual={isAnnual}
                isSubmitting={isSubmitting}
                enteredCouponCode={enteredCouponCode}
                isCheckingCoupon={isCheckingCoupon}
                couponResult={couponResult}
                couponError={couponError}
                orderCalculation={orderCalculation}
                onBillingPeriodChange={(period) =>
                  methods.setValue("billing_period", period, {
                    shouldValidate: true,
                  })
                }
                onCouponCodeChange={(code) =>
                  methods.setValue("coupon_code", code)
                }
                onCheckCoupon={handleCheckCoupon}
                onRemoveCoupon={handleRemoveCoupon}
                onSubmitLicense={submitForm}
              />
            </div>
          </div>
        </form>
      </FormProvider>
    </motion.div>
  )
}
