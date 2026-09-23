"use client"

import type { JSX } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, KeyRound } from "lucide-react"
import { FormProvider } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCreateLicenseForm } from "../hooks/use-create-license-form"
import { LicenseCreateClientProductCard } from "./license-create-client-product-card"
import { LicenseCreateInstanceServerCard } from "./license-create-instance-server-card"
import { LicenseCreateSubscriptionCard } from "./license-create-subscription-card"
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
    createInvoice,
    enteredCouponCode,
    isCheckingCoupon,
    couponResult,
    couponError,
    orderCalculation,
    handleToggleAddon,
    handleCheckCoupon,
    handleRemoveCoupon,
    submitForm,
  } = useCreateLicenseForm()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 max-w-7xl mx-auto pb-10"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <Link href="/licenses">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 w-9 p-0 rounded-xl cursor-pointer shrink-0"
              title="Kembali ke Daftar Lisensi"
            >
              <ArrowLeft size={16} />
            </Button>
          </Link>

          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
            <KeyRound size={20} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-foreground">
                Terbitkan Lisensi Instance Baru
              </h1>
              <Badge variant="secondary" className="font-mono text-xs">
                Registrasi & Faktur
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Konfigurasi instance klien, paket hosting server, modul add-on, dan terbitkan faktur otomatis.
            </p>
          </div>
        </div>
      </div>

      {/* Main Form Area */}
      <FormProvider {...methods}>
        <form onSubmit={submitForm}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Column: Form Details (8 cols) */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-4">
              <LicenseCreateClientProductCard
                clients={clients}
                products={products}
                isLoadingClients={isLoadingClients}
                isLoadingProducts={isLoadingProducts}
                selectedProduct={detailedProduct}
              />

              <LicenseCreateInstanceServerCard
                serverPackages={serverPackages}
                isLoadingServers={isLoadingServers}
                selectedServerPackage={selectedServerPackage}
              />

              <LicenseCreateSubscriptionCard isLifetime={isLifetime} />

              <LicenseCreateAddonsCard
                hasSelectedProduct={Boolean(selectedProductId)}
                isLoadingProductDetail={isLoadingProductDetail}
                builtInAddons={builtInAddons}
                purchasableAddons={purchasableAddons}
                selectedAddonIds={selectedAddonIds}
                isAnnual={isAnnual}
                onToggleAddon={handleToggleAddon}
              />
            </div>

            {/* Right Column: Invoice & Summary (4 cols) */}
            <div className="lg:col-span-5 xl:col-span-4">
              <LicenseCreateInvoiceSummaryCard
                createInvoice={createInvoice}
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
                onCouponCodeChange={(code) => methods.setValue("coupon_code", code)}
                onCheckCoupon={handleCheckCoupon}
                onRemoveCoupon={handleRemoveCoupon}
              />
            </div>
          </div>
        </form>
      </FormProvider>
    </motion.div>
  )
}
