import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { couponApi } from "./coupon.api"
import type {
  CouponQueryParams,
  CreateCouponPayload,
  UpdateCouponPayload,
} from "../@types/coupon"

export const couponKeys = {
  all: ["coupons"] as const,
  lists: () => [...couponKeys.all, "list"] as const,
  list: (params?: CouponQueryParams) =>
    [...couponKeys.lists(), params] as const,
  details: () => [...couponKeys.all, "detail"] as const,
  detail: (id: string) => [...couponKeys.details(), id] as const,
}

export function useCoupons(params?: CouponQueryParams) {
  return useQuery({
    queryKey: couponKeys.list(params),
    queryFn: () => couponApi.getCoupons(params),
    staleTime: 30_000,
  })
}

export function useCoupon(id: string, enabled = true) {
  return useQuery({
    queryKey: couponKeys.detail(id),
    queryFn: () => couponApi.getCouponById(id),
    enabled: Boolean(id) && enabled,
    staleTime: 30_000,
  })
}

export function useCreateCoupon() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateCouponPayload) =>
      couponApi.createCoupon(payload),
    onSuccess: () => {
      toast.success("Kupon diskon berhasil dibuat")
      void queryClient.invalidateQueries({ queryKey: couponKeys.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal membuat kupon diskon")
    },
  })
}

export function useUpdateCoupon() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateCouponPayload
    }) => couponApi.updateCoupon(id, payload),
    onSuccess: () => {
      toast.success("Kupon diskon berhasil diperbarui")
      void queryClient.invalidateQueries({ queryKey: couponKeys.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal memperbarui kupon diskon")
    },
  })
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => couponApi.deleteCoupon(id),
    onSuccess: () => {
      toast.success("Kupon diskon berhasil dihapus")
      void queryClient.invalidateQueries({ queryKey: couponKeys.all })
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal menghapus kupon diskon")
    },
  })
}
