"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useDebounce } from "@/hooks"
import { useClient, useDeleteClient } from "../api/client.queries"
import { useLicenses } from "../api/license.queries"
import type {
  License,
  LicenseStatus,
  LicenseSubscriptionType,
} from "../@types/license"

export function useClientDetailManagement(clientId: string) {
  const router = useRouter()

  const [licenseSearch, setLicenseSearch] = useState("")
  const [licenseStatusFilter, setLicenseStatusFilter] = useState<
    LicenseStatus | "all"
  >("all")
  const [licenseSubscriptionFilter, setLicenseSubscriptionFilter] = useState<
    LicenseSubscriptionType | "all"
  >("all")

  const debouncedLicenseSearch = useDebounce(licenseSearch, 400)

  // Fetch client details
  const {
    data: client,
    isLoading: isClientLoading,
    isFetching: isClientFetching,
    refetch: refetchClient,
  } = useClient(clientId)

  // Fetch licenses belonging to this client with BE filtering
  const {
    data: licensesData,
    isLoading: isLicensesLoading,
    isFetching: isLicensesFetching,
    refetch: refetchLicenses,
  } = useLicenses({
    client_id: clientId,
    search: debouncedLicenseSearch.trim() || undefined,
    status: licenseStatusFilter === "all" ? undefined : licenseStatusFilter,
    subscription_type:
      licenseSubscriptionFilter === "all"
        ? undefined
        : licenseSubscriptionFilter,
    per_page: 100,
  })

  // Dialog states for Client
  const [isEditClientOpen, setIsEditClientOpen] = useState(false)
  const [isDeleteClientOpen, setIsDeleteClientOpen] = useState(false)

  // Delete mutation
  const deleteClientMutation = useDeleteClient()

  // Resolved licenses list from BE query
  const licenses: License[] = useMemo(() => {
    if (licensesData?.data) {
      return licensesData.data
    }
    // Fallback to client.licenses only if no search/filter was applied
    if (
      !debouncedLicenseSearch &&
      licenseStatusFilter === "all" &&
      licenseSubscriptionFilter === "all"
    ) {
      return client?.licenses ?? []
    }
    return []
  }, [
    licensesData?.data,
    client?.licenses,
    debouncedLicenseSearch,
    licenseStatusFilter,
    licenseSubscriptionFilter,
  ])

  // Compute license stats for this client
  const licenseStats = useMemo(() => {
    let active = 0
    let trial = 0
    let expired = 0
    let addonsCount = 0

    const sourceLicenses = client?.licenses ?? licenses

    sourceLicenses.forEach((lic) => {
      if (lic.status === "active") {
        active += 1
      } else if (lic.status === "trial") {
        trial += 1
      } else if (lic.status === "expired") {
        expired += 1
      }

      const addons = lic.licenseAddons ?? lic.license_addons ?? []
      addonsCount += addons.length
    })

    return {
      total: sourceLicenses.length,
      active,
      trial,
      expired,
      addonsCount,
    }
  }, [client?.licenses, licenses])

  const handleDeleteClientConfirm = async () => {
    await deleteClientMutation.mutateAsync(clientId)
    setIsDeleteClientOpen(false)
    router.push("/clients")
  }

  const handleRefreshAll = () => {
    void refetchClient()
    void refetchLicenses()
  }

  const isLoading = isClientLoading || isLicensesLoading
  const isFetching = isClientFetching || isLicensesFetching

  return {
    client,
    licenses,
    licenseStats,
    licenseSearch,
    setLicenseSearch,
    licenseStatusFilter,
    setLicenseStatusFilter,
    licenseSubscriptionFilter,
    setLicenseSubscriptionFilter,
    isLoading,
    isFetching,
    isEditClientOpen,
    setIsEditClientOpen,
    isDeleteClientOpen,
    setIsDeleteClientOpen,
    isDeletingClient: deleteClientMutation.isPending,
    handleDeleteClientConfirm,
    handleRefreshAll,
  }
}
