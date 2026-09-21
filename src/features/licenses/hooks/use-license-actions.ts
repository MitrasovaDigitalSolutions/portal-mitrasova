"use client"

import { useState } from "react"
import {
  useDeleteLicense,
  useRegenerateLicenseSecret,
  useResetLicenseDomain,
} from "../api/license.queries"
import type { License } from "../@types/license"

export function useLicenseActions() {
  // Modal states
  const [isCreateLicenseOpen, setIsCreateLicenseOpen] = useState(false)
  const [selectedLicenseForEdit, setSelectedLicenseForEdit] =
    useState<License | null>(null)
  const [selectedLicenseForDetail, setSelectedLicenseForDetail] =
    useState<License | null>(null)
  const [selectedLicenseForOrder, setSelectedLicenseForOrder] =
    useState<License | null>(null)
  const [selectedLicenseForExtend, setSelectedLicenseForExtend] =
    useState<License | null>(null)
  const [selectedLicenseForAddons, setSelectedLicenseForAddons] =
    useState<License | null>(null)
  const [licenseToDelete, setLicenseToDelete] = useState<License | null>(null)
  const [licenseToResetDomain, setLicenseToResetDomain] =
    useState<License | null>(null)
  const [licenseToRegenerateSecret, setLicenseToRegenerateSecret] =
    useState<License | null>(null)

  // Mutations
  const deleteMutation = useDeleteLicense()
  const resetDomainMutation = useResetLicenseDomain()
  const regenerateSecretMutation = useRegenerateLicenseSecret()

  const handleDeleteLicenseConfirm = async () => {
    if (!licenseToDelete) {
      return
    }
    await deleteMutation.mutateAsync(licenseToDelete.id)
    setLicenseToDelete(null)
  }

  const handleResetDomainConfirm = async () => {
    if (!licenseToResetDomain) {
      return
    }
    await resetDomainMutation.mutateAsync(licenseToResetDomain.id)
    setLicenseToResetDomain(null)
  }

  const handleRegenerateSecretConfirm = async () => {
    if (!licenseToRegenerateSecret) {
      return
    }
    await regenerateSecretMutation.mutateAsync(licenseToRegenerateSecret.id)
    setLicenseToRegenerateSecret(null)
  }

  return {
    isCreateLicenseOpen,
    setIsCreateLicenseOpen,
    selectedLicenseForEdit,
    setSelectedLicenseForEdit,
    selectedLicenseForDetail,
    setSelectedLicenseForDetail,
    selectedLicenseForOrder,
    setSelectedLicenseForOrder,
    selectedLicenseForExtend,
    setSelectedLicenseForExtend,
    selectedLicenseForAddons,
    setSelectedLicenseForAddons,
    licenseToDelete,
    setLicenseToDelete,
    licenseToResetDomain,
    setLicenseToResetDomain,
    licenseToRegenerateSecret,
    setLicenseToRegenerateSecret,
    isDeletingLicense: deleteMutation.isPending,
    isResettingDomain: resetDomainMutation.isPending,
    isRegeneratingSecret: regenerateSecretMutation.isPending,
    handleDeleteLicenseConfirm,
    handleResetDomainConfirm,
    handleRegenerateSecretConfirm,
  }
}
