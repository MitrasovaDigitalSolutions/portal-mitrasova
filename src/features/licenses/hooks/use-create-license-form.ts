"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useClients } from "@/features/clients/api/client.queries"
import { useProducts, useProduct } from "@/features/products/api/product.queries"
import { useServerPackages } from "@/features/server-packages/api/server-package.queries"
import { useCreateLicense } from "../api/license.queries"
import { licenseApi } from "../api/license.api"
import {
  licenseFormSchema,
  type LicenseFormValues,
} from "../validations/license.schema"
import type { CheckCouponResponse } from "../@types/license"

export function useCreateLicenseForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedClientId = searchParams.get("clientId") ?? ""

  const createMutation = useCreateLicense()

  // Queries
  const { data: clientsData, isLoading: isLoadingClients } = useClients({
    per_page: 100,
  })
  const { data: productsData, isLoading: isLoadingProducts } = useProducts({
    status: "active",
  })
  const { data: serverPackagesData, isLoading: isLoadingServers } = useServerPackages({
    is_active: true,
  })

  const clients = useMemo(() => clientsData?.data ?? [], [clientsData?.data])
  const products = useMemo(() => productsData?.data ?? [], [productsData?.data])
  const serverPackages = useMemo(() => serverPackagesData?.data ?? [], [serverPackagesData?.data])

  const methods = useForm<LicenseFormValues>({
    resolver: zodResolver(licenseFormSchema),
    defaultValues: {
      client_id: preselectedClientId,
      product_id: "",
      nama_instance: "",
      domain_instance: "",
      subscription_type: "annual",
      server_package_id: "",
      server_notes: "",
      status: "active",
      expires_at: "",
      grace_period_days: 7,
      addon_ids: [],
      create_invoice: true,
      billing_period: "annual",
      discount_amount: 0,
      discount_description: "",
      coupon_code: "",
    },
  })

  const { control, handleSubmit, setValue, reset } = methods

  // Watched form values via useWatch per rules
  const selectedClientId = useWatch({ control, name: "client_id" })
  const selectedProductId = useWatch({ control, name: "product_id" })
  const selectedServerId = useWatch({ control, name: "server_package_id" })
  const subscriptionType = useWatch({ control, name: "subscription_type" })
  const billingPeriod = useWatch({ control, name: "billing_period" })
  const watchedAddonIds = useWatch({ control, name: "addon_ids" })
  const createInvoice = useWatch({ control, name: "create_invoice" })
  const enteredCouponCode = useWatch({ control, name: "coupon_code" })

  const selectedAddonIds = useMemo(() => watchedAddonIds ?? [], [watchedAddonIds])

  // Fetch product detail for addons
  const { data: detailedProduct, isLoading: isLoadingProductDetail } = useProduct(
    selectedProductId,
    Boolean(selectedProductId)
  )

  // Selected client object
  const selectedClient = useMemo(
    () => clients.find((c) => c.id === selectedClientId),
    [clients, selectedClientId]
  )

  // Selected server package object
  const selectedServerPackage = useMemo(
    () => serverPackages.find((s) => s.id === selectedServerId),
    [serverPackages, selectedServerId]
  )

  // All addons for current product
  const productAddons = useMemo(
    () => detailedProduct?.addons ?? [],
    [detailedProduct?.addons]
  )

  // Built-in non-purchasable addons vs purchasable addons
  const { builtInAddons, purchasableAddons } = useMemo(() => {
    const builtIn = productAddons.filter((a) => (a as { is_purchasable?: boolean }).is_purchasable === false)
    const purchasable = productAddons.filter((a) => (a as { is_purchasable?: boolean }).is_purchasable !== false)
    return { builtInAddons: builtIn, purchasableAddons: purchasable }
  }, [productAddons])

  // Coupon state
  const [isCheckingCoupon, setIsCheckingCoupon] = useState(false)
  const [couponResult, setCouponResult] = useState<CheckCouponResponse["coupon"] | null>(null)
  const [couponError, setCouponError] = useState<string | null>(null)

  const isAnnual = billingPeriod === "annual"
  const isLifetime = subscriptionType === "lifetime"

  // Pre-fill client ID if param changes
  useEffect(() => {
    if (preselectedClientId) {
      setValue("client_id", preselectedClientId)
    }
  }, [preselectedClientId, setValue])

  // Auto-set billing period when subscription type changes
  useEffect(() => {
    if (subscriptionType === "monthly") {
      setValue("billing_period", "monthly")
    } else if (subscriptionType === "annual" || subscriptionType === "yearly") {
      setValue("billing_period", "annual")
    }
  }, [subscriptionType, setValue])

  // Auto-calculate suggested expiry date
  useEffect(() => {
    if (isLifetime) {
      setValue("expires_at", null)
      return
    }

    const now = new Date()
    if (subscriptionType === "monthly") {
      const nextMonth = new Date(now.setMonth(now.getMonth() + 1))
      setValue("expires_at", nextMonth.toISOString().split("T")[0])
    } else if (subscriptionType === "annual" || subscriptionType === "yearly") {
      const nextYear = new Date(now.setFullYear(now.getFullYear() + 1))
      setValue("expires_at", nextYear.toISOString().split("T")[0])
    } else if (subscriptionType === "trial") {
      const nextWeek = new Date(now.setDate(now.getDate() + 14))
      setValue("expires_at", nextWeek.toISOString().split("T")[0])
    }
  }, [subscriptionType, isLifetime, setValue])

  // Toggle purchasable addon
  const handleToggleAddon = (addonId: string) => {
    const exists = selectedAddonIds.includes(addonId)
    const updated = exists
      ? selectedAddonIds.filter((id) => id !== addonId)
      : [...selectedAddonIds, addonId]

    setValue("addon_ids", updated, { shouldValidate: true })
    // Invalidate applied coupon if addons change
    if (couponResult) {
      setCouponResult(null)
      setValue("discount_amount", 0)
      setValue("discount_description", null)
    }
  }

  // Invoice calculations
  const orderCalculation = useMemo(() => {
    const items: Array<{
      name: string
      type: "product" | "server" | "addon"
      price: number
      qty: number
      subtotal: number
    }> = []

    // 1. Base Product
    if (detailedProduct) {
      const price = isAnnual
        ? Number(detailedProduct.harga_tahunan) || 0
        : Number(detailedProduct.harga_bulanan) || 0
      if (price > 0 || detailedProduct.nama) {
        items.push({
          name: `Aplikasi ${detailedProduct.nama} (${isAnnual ? "1 Tahun" : "1 Bulan"})`,
          type: "product",
          price,
          qty: 1,
          subtotal: price,
        })
      }
    }

    // 2. Server Package
    if (selectedServerPackage) {
      const price = isAnnual
        ? Number(selectedServerPackage.harga_tahunan) || 0
        : Number(selectedServerPackage.harga_bulanan) || 0
      if (price > 0 || selectedServerPackage.nama) {
        items.push({
          name: `Hosting Server ${selectedServerPackage.nama} (${isAnnual ? "1 Tahun" : "1 Bulan"})`,
          type: "server",
          price,
          qty: 1,
          subtotal: price,
        })
      }
    }

    // 3. Selected Addons
    selectedAddonIds.forEach((addonId) => {
      const addon = purchasableAddons.find((a) => a.id === addonId)
      if (addon) {
        const price = isAnnual
          ? Number(addon.harga_tahunan) || 0
          : Number(addon.harga_bulanan) || 0
        items.push({
          name: `Add-on ${addon.nama} (${isAnnual ? "1 Tahun" : "1 Bulan"})`,
          type: "addon",
          price,
          qty: 1,
          subtotal: price,
        })
      }
    })

    const grossSubtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
    const discount = couponResult?.discount_amount ?? 0
    const netTotal = Math.max(0, grossSubtotal - discount)

    return { items, grossSubtotal, discount, netTotal }
  }, [
    detailedProduct,
    selectedServerPackage,
    selectedAddonIds,
    purchasableAddons,
    isAnnual,
    couponResult,
  ])

  // Check coupon handler
  const handleCheckCoupon = async () => {
    if (!enteredCouponCode || enteredCouponCode.trim() === "") {
      setCouponError("Ketik kode kupon terlebih dahulu")
      return
    }

    setIsCheckingCoupon(true)
    setCouponError(null)

    try {
      // Temporary dummy license key for validation before license is created
      const dummyKey = "NEW-LICENSE-PREVIEW"
      const res = await licenseApi.checkCoupon({
        license_key: dummyKey,
        coupon_code: enteredCouponCode.trim(),
        billing_period: (billingPeriod as "monthly" | "annual") ?? "annual",
        include_base_product: true,
        include_server: Boolean(selectedServerId),
        server_package_id: selectedServerId || undefined,
        addon_ids: selectedAddonIds,
      })

      if (res.valid) {
        setCouponResult(res.coupon)
        setValue("discount_amount", res.coupon.discount_amount)
        setValue("discount_description", `Kupon: ${res.coupon.code} (${res.coupon.name})`)
        toast.success(`Kupon ${res.coupon.code} berhasil diterapkan! Hemat ${res.coupon.formatted_discount}`)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Kupon tidak valid"
      setCouponError(msg)
      setCouponResult(null)
      setValue("discount_amount", 0)
      setValue("discount_description", null)
    } finally {
      setIsCheckingCoupon(false)
    }
  }

  const handleRemoveCoupon = () => {
    setCouponResult(null)
    setCouponError(null)
    setValue("coupon_code", "")
    setValue("discount_amount", 0)
    setValue("discount_description", null)
  }

  // Submit handler
  const onSubmit = async (values: LicenseFormValues) => {
    try {
      const payload = {
        ...values,
        coupon_code: couponResult?.code ?? values.coupon_code ?? undefined,
        discount_amount: couponResult?.discount_amount ?? values.discount_amount ?? 0,
        discount_description:
          couponResult ? `Kupon: ${couponResult.code} (${couponResult.name})` : values.discount_description ?? null,
      }

      const created = await createMutation.mutateAsync(payload)

      if (preselectedClientId) {
        router.push(`/clients/${preselectedClientId}`)
      } else {
        router.push(`/licenses/${created.id}`)
      }
    } catch {
      // Error handled by query mutation toast
    }
  }

  return {
    methods,
    control,
    clients,
    products,
    serverPackages,
    selectedClient,
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
    isSubmitting: createMutation.isPending,
    subscriptionType,
    billingPeriod: (billingPeriod as "monthly" | "annual") ?? "annual",
    isAnnual,
    isLifetime,
    createInvoice: createInvoice ?? true,
    enteredCouponCode,
    isCheckingCoupon,
    couponResult,
    couponError,
    orderCalculation,
    handleToggleAddon,
    handleCheckCoupon,
    handleRemoveCoupon,
    submitForm: handleSubmit(onSubmit),
    reset,
  }
}
