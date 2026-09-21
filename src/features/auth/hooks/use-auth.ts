import { useCallback } from "react"
import { useSession } from "next-auth/react"
import { usePageLoadingStore } from "@/stores/page-loading-store"
import { useLogoutMutation, useMeQuery } from "../api/auth.queries"

export function useAuth() {
  const { data: session, status } = useSession()
  const { data: meData, isLoading: isMeLoading } = useMeQuery()
  const logoutMutation = useLogoutMutation()

  const user = meData?.user ?? session?.user
  const isAuthenticated = status === "authenticated"
  const isLoading = status === "loading" || (isAuthenticated && isMeLoading)

  const logout = useCallback(async () => {
    usePageLoadingStore.getState().startLoading()
    await logoutMutation.mutateAsync()
  }, [logoutMutation])

  return {
    session,
    user,
    status,
    isAuthenticated,
    isLoading,
    isLoggingOut: logoutMutation.isPending,
    logout,
  }
}
