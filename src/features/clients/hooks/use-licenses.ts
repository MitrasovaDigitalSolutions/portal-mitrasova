"use client"

import { useMemo, useState } from "react"
import type {
  License,
  LicenseStatus,
  LicenseSubscriptionType,
} from "../@types/license"

export function useLicensesList(licenses: License[]) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<LicenseStatus | "all">("all")
  const [subscriptionFilter, setSubscriptionFilter] = useState<
    LicenseSubscriptionType | "all"
  >("all")

  const filteredLicenses = useMemo(() => {
    return licenses.filter((license) => {
      // Status filter
      if (statusFilter !== "all" && license.status !== statusFilter) {
        return false
      }

      // Subscription filter
      if (
        subscriptionFilter !== "all" &&
        license.subscription_type !== subscriptionFilter
      ) {
        return false
      }

      // Search keyword filter
      if (search.trim() !== "") {
        const query = search.toLowerCase().trim()
        const instanceMatch = license.nama_instance
          ?.toLowerCase()
          .includes(query)
        const domainMatch = license.domain_instance
          ?.toLowerCase()
          .includes(query)
        const keyMatch = license.license_key?.toLowerCase().includes(query)
        const productMatch = license.product?.nama
          ?.toLowerCase()
          .includes(query)

        return instanceMatch || domainMatch || keyMatch || productMatch
      }

      return true
    })
  }, [licenses, search, statusFilter, subscriptionFilter])

  return {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    subscriptionFilter,
    setSubscriptionFilter,
    filteredLicenses,
  }
}
