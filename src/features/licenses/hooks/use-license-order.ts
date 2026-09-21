"use client"

import { useEffect, useMemo } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import type { Invoice } from "@/features/invoices/@types/invoice"
import { useProduct } from "@/features/products/api/product.queries"
import { formatDate } from "@/utils"
import type { License } from "../@types/license"
import { useCreateLicenseOrder } from "../api/license.queries"
import { KNOWN_PRODUCT_ADDONS, formatCodeToTitle } from "../constants"
import {
  licenseOrderSchema,
  type LicenseOrderValues,
} from "../validations/license-order.schema"

export const BASE_PRODUCT_MONTHLY_PRICE = 120000
export const BASE_PRODUCT_ANNUAL_PRICE = 1200000

export interface SubscribedAddonItem {
  id: string
  name: string
  code?: string
  expires_at?: string | null
}

export interface UseLicenseOrderParams {
  open: boolean
  license: License | null
  initialAddonId?: string | null
  onOpenChange: (open: boolean) => void
  onSuccessInvoiceCreated?: (invoice: Invoice) => void
}

export interface OrderCalculationItem {
  name: string
  type: "base" | "addon"
  price: number
  qty: number
  subtotal: number
}

export function useLicenseOrder({
  open,
  license,
  initialAddonId,
  onOpenChange,
  onSuccessInvoiceCreated,
}: UseLicenseOrderParams) {
  const createOrderMutation = useCreateLicenseOrder()

  const { data: product, isLoading: isLoadingProduct } = useProduct(
    license?.product_id ?? "",
    Boolean(license?.product_id && open)
  )

  const currentSubscribedAddonIds = useMemo(() => {
    const list = license?.licenseAddons ?? license?.license_addons ?? []
    return new Set(
      list
        .filter((item) => !item.status || item.status === "active")
        .map((item) => item.product_addon_id)
    )
  }, [license])

  const subscribedAddonsList = useMemo<SubscribedAddonItem[]>(() => {
    const list = license?.licenseAddons ?? license?.license_addons ?? []
    return list
      .filter((item) => !item.status || item.status === "active")
      .map((item) => {
        const prodAddon = product?.addons?.find(
          (a) => a.id === item.product_addon_id
        )
        const info = item.productAddon ?? item.product_addon
        const code = prodAddon?.code || info?.code || ""
        const known = KNOWN_PRODUCT_ADDONS[code]
        const name =
          prodAddon?.nama ||
          info?.nama ||
          known?.nama ||
          (code ? formatCodeToTitle(code) : "Modul Add-on")

        return {
          id: item.product_addon_id,
          name,
          code,
          expires_at: item.expires_at,
        }
      })
  }, [license, product?.addons])

  const availableAddons = useMemo(() => {
    return (product?.addons ?? []).filter((a) => a.is_active)
  }, [product?.addons])

  const defaultSelectedAddonIds = useMemo(() => {
    const ids = new Set<string>()
    currentSubscribedAddonIds.forEach((id) => ids.add(id))
    if (initialAddonId) {
      ids.add(initialAddonId)
    }
    return Array.from(ids)
  }, [currentSubscribedAddonIds, initialAddonId])

  const methods = useForm<LicenseOrderValues>({
    resolver: zodResolver(licenseOrderSchema),
    defaultValues: {
      license_key: license?.license_key ?? "",
      billing_period: "annual",
      include_base_product: true,
      addon_ids: defaultSelectedAddonIds,
    },
  })

  const { control, handleSubmit, setValue, reset } = methods

  const billingPeriod = useWatch({ control, name: "billing_period" })
  const includeBase = useWatch({ control, name: "include_base_product" })
  const rawAddonIds = useWatch({ control, name: "addon_ids" })
  const selectedAddonIds = useMemo(
    () => rawAddonIds ?? [],
    [rawAddonIds]
  )

  const isAnnual = billingPeriod === "annual"

  useEffect(() => {
    if (open && license) {
      const ids = new Set<string>()
      const list = license.licenseAddons ?? license.license_addons ?? []
      list.forEach((item) => {
        if (!item.status || item.status === "active") {
          ids.add(item.product_addon_id)
        }
      })
      if (initialAddonId) {
        ids.add(initialAddonId)
      }

      reset({
        license_key: license.license_key,
        billing_period: "annual",
        include_base_product: true,
        addon_ids: Array.from(ids),
      })
    }
  }, [open, license, initialAddonId, reset])

  const currentActiveAddonsMap = useMemo(() => {
    const list = license?.licenseAddons ?? license?.license_addons ?? []
    const map: Record<string, { status: string; expires_at: string | null }> = {}
    list.forEach((item) => {
      map[item.product_addon_id] = {
        status: item.status,
        expires_at: item.expires_at,
      }
    })
    return map
  }, [license])

  const currentExpiryText = useMemo(() => {
    if (!license) {
      return "—"
    }
    if (license.subscription_type === "lifetime" || !license.expires_at) {
      return "Lifetime / Tanpa Batas"
    }
    return formatDate(license.expires_at)
  }, [license])

  const calculation = useMemo(() => {
    const items: OrderCalculationItem[] = []

    const basePrice = isAnnual
      ? BASE_PRODUCT_ANNUAL_PRICE
      : BASE_PRODUCT_MONTHLY_PRICE

    if (includeBase) {
      items.push({
        name: `Perpanjangan ${license?.product?.nama || product?.nama || "Paket Pokok"} (${isAnnual ? "1 Tahun" : "1 Bulan"})`,
        type: "base",
        price: basePrice,
        qty: 1,
        subtotal: basePrice,
      })
    }

    selectedAddonIds.forEach((addonId) => {
      const addon = availableAddons.find((a) => a.id === addonId)
      if (addon) {
        const price = isAnnual
          ? addon.harga_tahunan || 0
          : addon.harga_bulanan || 0
        items.push({
          name: `Add-on ${addon.nama} (${isAnnual ? "1 Tahun" : "1 Bulan"})`,
          type: "addon",
          price,
          qty: 1,
          subtotal: price,
        })
      }
    })

    const grandTotal = items.reduce((sum, it) => sum + it.subtotal, 0)

    return { items, grandTotal }
  }, [includeBase, selectedAddonIds, isAnnual, license, product, availableAddons])

  const handleToggleAddon = (addonId: string) => {
    const exists = selectedAddonIds.includes(addonId)
    if (exists) {
      setValue(
        "addon_ids",
        selectedAddonIds.filter((id) => id !== addonId),
        { shouldValidate: true }
      )
    } else {
      setValue("addon_ids", [...selectedAddonIds, addonId], {
        shouldValidate: true,
      })
    }
  }

  const setBillingPeriod = (period: "monthly" | "annual") => {
    setValue("billing_period", period, { shouldValidate: true })
  }

  const setIncludeBase = (val: boolean) => {
    setValue("include_base_product", val, { shouldValidate: true })
  }

  const onSubmit = async (values: LicenseOrderValues) => {
    try {
      const invoice = await createOrderMutation.mutateAsync({
        license_key: values.license_key,
        billing_period: values.billing_period,
        include_base_product: values.include_base_product,
        addon_ids: values.addon_ids,
      })
      onOpenChange(false)
      onSuccessInvoiceCreated?.(invoice)
    } catch {
      // Handled by query mutation toast
    }
  }

  const isSubmitDisabled =
    createOrderMutation.isPending ||
    (!includeBase && selectedAddonIds.length === 0)

  return {
    methods,
    billingPeriod,
    includeBase,
    selectedAddonIds,
    isAnnual,
    product,
    availableAddons,
    currentSubscribedAddonIds,
    subscribedAddonsList,
    isLoadingProduct,
    currentActiveAddonsMap,
    currentExpiryText,
    calculation,
    setBillingPeriod,
    setIncludeBase,
    handleToggleAddon,
    isPending: createOrderMutation.isPending,
    isSubmitDisabled,
    submitForm: handleSubmit(onSubmit),
  }
}
