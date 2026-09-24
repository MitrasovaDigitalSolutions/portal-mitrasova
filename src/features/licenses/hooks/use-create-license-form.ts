"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm, useWatch, type FieldErrors } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useClients } from "@/features/clients/api/client.queries"
import { useProducts, useProduct } from "@/features/products/api/product.queries"
import { useServerPackages } from "@/features/server-packages/api/server-package.queries"
import { couponApi } from "@/features/coupons/api/coupon.api"
import { formatCurrency } from "@/utils"
import { useCreateLicense } from "../api/license.queries"
import {
  licenseFormSchema,
  type LicenseFormValues,
} from "../validations/license.schema"
import type { CheckCouponResponse, CreateLicensePayload } from "../@types/license"

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

  const handleSelectAllAddons = () => {
    const allPurchasableIds = purchasableAddons.map((a) => a.id)
    setValue("addon_ids", allPurchasableIds, { shouldValidate: true })
    if (couponResult) {
      setCouponResult(null)
      setValue("discount_amount", 0)
      setValue("discount_description", null)
    }
  }

  const handleClearAddons = () => {
    setValue("addon_ids", [], { shouldValidate: true })
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
      const code = enteredCouponCode.trim()
      const couponsRes = await couponApi.getCoupons({ search: code, per_page: 20 })
      const matchingCoupon = couponsRes.data?.find(
        (c) => c.code.toUpperCase() === code.toUpperCase()
      )

      if (!matchingCoupon) {
        setCouponError("Kode kupon tidak ditemukan atau tidak valid")
        setCouponResult(null)
        setValue("discount_amount", 0)
        setValue("discount_description", null)
        return
      }

      if (!matchingCoupon.is_active) {
        setCouponError("Kupon ini sedang tidak aktif")
        setCouponResult(null)
        setValue("discount_amount", 0)
        setValue("discount_description", null)
        return
      }

      const now = new Date()
      if (matchingCoupon.starts_at && new Date(matchingCoupon.starts_at) > now) {
        setCouponError("Kupon promo ini belum dapat digunakan")
        setCouponResult(null)
        setValue("discount_amount", 0)
        setValue("discount_description", null)
        return
      }

      if (matchingCoupon.expires_at && new Date(matchingCoupon.expires_at) < now) {
        setCouponError("Kupon promo ini telah kedaluwarsa")
        setCouponResult(null)
        setValue("discount_amount", 0)
        setValue("discount_description", null)
        return
      }

      if (
        matchingCoupon.max_uses &&
        (matchingCoupon.usages_count ?? 0) >= matchingCoupon.max_uses
      ) {
        setCouponError("Batas penggunaan kupon promo ini telah habis")
        setCouponResult(null)
        setValue("discount_amount", 0)
        setValue("discount_description", null)
        return
      }

      if (
        matchingCoupon.applicable_period &&
        matchingCoupon.applicable_period !== "all" &&
        matchingCoupon.applicable_period !== billingPeriod
      ) {
        const periodLabel =
          matchingCoupon.applicable_period === "annual" ? "Tahunan" : "Bulanan"
        setCouponError(`Kupon ini hanya berlaku untuk siklus penagihan ${periodLabel}`)
        setCouponResult(null)
        setValue("discount_amount", 0)
        setValue("discount_description", null)
        return
      }

      if (
        matchingCoupon.min_order_amount &&
        orderCalculation.grossSubtotal < matchingCoupon.min_order_amount
      ) {
        setCouponError(
          `Minimal total transaksi untuk kupon ini adalah ${formatCurrency(matchingCoupon.min_order_amount)}`
        )
        setCouponResult(null)
        setValue("discount_amount", 0)
        setValue("discount_description", null)
        return
      }

      // Calculate discount amount ensuring pure numeric types
      const rawDiscValue = Number(matchingCoupon.discount_value) || 0
      const rawMaxDisc =
        matchingCoupon.max_discount_amount !== null && matchingCoupon.max_discount_amount !== undefined
          ? Number(matchingCoupon.max_discount_amount)
          : null

      let discountAmount = 0
      if (matchingCoupon.discount_type === "percentage") {
        discountAmount = Math.round(
          (orderCalculation.grossSubtotal * rawDiscValue) / 100
        )
        if (rawMaxDisc !== null && discountAmount > rawMaxDisc) {
          discountAmount = rawMaxDisc
        }
      } else {
        discountAmount = rawDiscValue
        if (discountAmount > orderCalculation.grossSubtotal) {
          discountAmount = orderCalculation.grossSubtotal
        }
      }

      const numericDiscountAmount = Number(discountAmount) || 0

      const couponObj = {
        code: matchingCoupon.code,
        name: matchingCoupon.name,
        discount_type: matchingCoupon.discount_type,
        discount_value: rawDiscValue,
        discount_amount: numericDiscountAmount,
        formatted_discount: formatCurrency(numericDiscountAmount),
        subtotal: orderCalculation.grossSubtotal,
        final_amount: Math.max(0, orderCalculation.grossSubtotal - numericDiscountAmount),
      }

      setCouponResult(couponObj)
      setValue("discount_amount", numericDiscountAmount, { shouldValidate: true })
      setValue("discount_description", `Kupon: ${matchingCoupon.code} (${matchingCoupon.name})`)
      toast.success(
        `Kupon ${matchingCoupon.code} berhasil diterapkan! Hemat ${formatCurrency(numericDiscountAmount)}`
      )
    } catch (err: unknown) {
      const rawMsg = err instanceof Error ? err.message : "Kupon tidak valid"
      const userFriendlyMsg = /license.*key/i.test(rawMsg)
        ? "Kode kupon tidak valid atau tidak dapat diterapkan"
        : rawMsg
      setCouponError(userFriendlyMsg)
      setCouponResult(null)
      setValue("discount_amount", 0, { shouldValidate: true })
      setValue("discount_description", null)
    } finally {
      setIsCheckingCoupon(false)
    }
  }

  const handleRemoveCoupon = () => {
    setCouponResult(null)
    setCouponError(null)
    setValue("coupon_code", "")
    setValue("discount_amount", 0, { shouldValidate: true })
    setValue("discount_description", null)
  }

  // Submit handler
  const onSubmit = async (values: LicenseFormValues) => {
    try {
      const payload: CreateLicensePayload = {
        ...values,
        grace_period_days: Number(values.grace_period_days) || 0,
        domain_instance: values.domain_instance?.trim() || null,
        server_notes: values.server_notes?.trim() || null,
        expires_at: isLifetime ? null : values.expires_at || null,
        create_invoice: true,
        coupon_code: couponResult?.code ?? values.coupon_code ?? undefined,
        discount_amount: Number(couponResult?.discount_amount ?? values.discount_amount ?? 0) || 0,
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

  // Field names mapping for clear Indonesian validation toasts
  const FIELD_LABELS: Record<string, string> = {
    client_id: "Klien / Merchant",
    product_id: "Produk Software",
    nama_instance: "Nama Instance / Cabang",
    domain_instance: "Domain / IP Instance",
    subscription_type: "Tipe Langganan",
    server_package_id: "Paket Hosting Server",
    status: "Status Lisensi",
    expires_at: "Tanggal Kedaluwarsa",
    grace_period_days: "Masa Tenggang",
    discount_amount: "Nominal Diskon",
    coupon_code: "Kode Kupon",
  }

  // Validation failure handler to provide direct visual feedback and auto-scroll
  const onInvalid = (errors: FieldErrors<LicenseFormValues>) => {
    const errorEntries = Object.entries(errors)
    if (errorEntries.length === 0) {
      return
    }

    const [firstField, firstErr] = errorEntries[0]
    const fieldLabel = FIELD_LABELS[firstField] || firstField
    const message = (firstErr?.message as string) || "Harap lengkapi data wajib pada formulir"
    toast.error(`Formulir belum lengkap pada kolom ${fieldLabel}: ${message}`)

    // Smoothly scroll to the first invalid field
    const el =
      document.querySelector(`[name="${firstField}"]`) ||
      document.getElementById(firstField) ||
      document.getElementById(`wrapper-${firstField}`)

    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" })
      if (el instanceof HTMLElement) {
        el.focus()
      }
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
    handleSelectAllAddons,
    handleClearAddons,
    handleCheckCoupon,
    handleRemoveCoupon,
    submitForm: handleSubmit(onSubmit, onInvalid),
    reset,
  }
}
