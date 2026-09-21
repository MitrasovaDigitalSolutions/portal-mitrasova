import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { signOut, useSession } from "next-auth/react"
import { ROUTES } from "@/constants/routes"
import { authApi } from "./auth.api"

export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
}

export function useMeQuery() {
  const { data: session, status } = useSession()
  const isAuthenticated = status === "authenticated" && !!session?.accessToken

  return useQuery({
    queryKey: authKeys.me(),
    queryFn: () => authApi.getMe(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useLogoutMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: async () => {
      queryClient.clear()
      await signOut({
        redirect: true,
        callbackUrl: ROUTES.LOGIN,
      })
    },
  })
}
