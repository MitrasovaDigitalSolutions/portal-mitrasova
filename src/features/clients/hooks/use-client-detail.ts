"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useClient, useDeleteClient } from "../api/client.queries"
import { useLicenses } from "../api/license.queries"
import type { License } from "../@types/license"

export function useClientDetailManagement(clientId: string) {
  const router = useRouter()

  // Fetch client details
  const {
    data: client,
    isLoading: isClientLoading,
    isFetching: isClientFetching,
    refetch: refetchClient,
  } = useClient(clientId)

  // Fetch licenses belonging to this client
  const {
    data: licensesData,
    isLoading: isLicensesLoading,
    isFetching: isLicensesFetching,
    refetch: refetchLicenses,
  } = useLicenses({
    client_id: clientId,
    per_page: 100,
  })

  // Dialog states for Client
  const [isEditClientOpen, setIsEditClientOpen] = useState(false)
  const [isDeleteClientOpen, setIsDeleteClientOpen] = useState(false)

  // Delete mutation
  const deleteClientMutation = useDeleteClient()

  // Resolved licenses list (either from licenses query or client relation)
  const licenses: License[] = useMemo(() => {
    if (licensesData?.data && licensesData.data.length > 0) {
      return licensesData.data
    }
    return client?.licenses ?? []
  }, [licensesData?.data, client?.licenses])

  // Compute license stats for this client
  const licenseStats = useMemo(() => {
    let active = 0
    let trial = 0
    let expired = 0
    let addonsCount = 0

    licenses.forEach((lic) => {
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
      total: licenses.length,
      active,
      trial,
      expired,
      addonsCount,
    }
  }, [licenses])

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
