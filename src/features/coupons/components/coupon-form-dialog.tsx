"use client"

import { useEffect, useMemo, type JSX } from "react"
import { useForm, FormProvider, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { BaseDialog } from "@/components/ui/base-dialog"
import { Button } from "@/components/ui/button"
import {
  FormDatePicker,
  FormInput,
  FormNominalInput,
  FormNumberInput,
  FormSelect,
  FormSwitch,
  FormTextarea,
} from "@/components/forms"
import { useCreateCoupon, useUpdateCoupon } from "../api/coupon.queries"
import {
  couponSchema,
  type CouponFormValues,
} from "../validations/coupon.schema"
import type { Coupon } from "../@types/coupon"

export interface CouponFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  coupon: Coupon | null
}

const defaultValues: CouponFormValues = {
  code: "",
  name: "",
  description: "",
  discount_type: "percentage",
  discount_value: 10,
  max_discount_amount: undefined,
  min_order_amount: undefined,
  applicable_period: "all",
  max_uses: undefined,
  max_uses_per_client: 1,
  starts_at: undefined,
  expires_at: undefined,
  is_active: true,
}

export function CouponFormDialog({
  open,
  onOpenChange,
  coupon,
}: CouponFormDialogProps): JSX.Element {
  const isEdit = Boolean(coupon)
  const createMutation = useCreateCoupon()
  const updateMutation = useUpdateCoupon()
  const isPending = createMutation.isPending || updateMutation.isPending

  const methods = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues,
  })

  const { handleSubmit, reset, control } = methods

  const watchedDiscountType = useWatch({
    control,
    name: "discount_type",
  })
  const isPercentage = watchedDiscountType === "percentage"

  useEffect(() => {
    if (open) {
      if (coupon) {
        reset({
          code: coupon.code,
          name: coupon.name,
          description: coupon.description ?? "",
          discount_type: coupon.discount_type,
          discount_value: Number(coupon.discount_value) || 0,
          max_discount_amount: coupon.max_discount_amount
            ? Number(coupon.max_discount_amount)
            : undefined,
          min_order_amount: coupon.min_order_amount
            ? Number(coupon.min_order_amount)
            : undefined,
          applicable_period: coupon.applicable_period ?? "all",
          max_uses: coupon.max_uses ?? undefined,
          max_uses_per_client: coupon.max_uses_per_client ?? 1,
          starts_at: coupon.starts_at ?? undefined,
          expires_at: coupon.expires_at ?? undefined,
          is_active: coupon.is_active,
        })
      } else {
        reset(defaultValues)
      }
    }
  }, [open, coupon, reset])

  const discountTypeOptions = useMemo(
    () => [
      { value: "percentage", label: "Persentase (%)" },
      { value: "fixed", label: "Potongan Tetap (Rp Nominal)" },
    ],
    []
  )

  const periodOptions = useMemo(
    () => [
      { value: "all", label: "Semua Periode (Bulanan & Tahunan)" },
      { value: "monthly", label: "Hanya Periode Bulanan" },
      { value: "annual", label: "Hanya Periode Tahunan" },
    ],
    []
  )

  const onSubmit = async (values: CouponFormValues) => {
    try {
      if (isEdit && coupon) {
        await updateMutation.mutateAsync({
          id: coupon.id,
          payload: values,
        })
      } else {
        await createMutation.mutateAsync(values)
      }
      onOpenChange(false)
    } catch {
      // Handled by query toast
    }
  }

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title={
        <div>
          <div className="text-sm font-bold text-foreground">
            {isEdit ? "Edit Kupon Promo" : "Buat Kupon Promo Baru"}
          </div>
          <p className="text-[11px] font-normal text-muted-foreground">
            {isEdit
              ? "Perbarui ketentuan diskon dan masa berlaku kupon."
              : "Definisikan kode kupon promo untuk potongan harga invoice lisensi."}
          </p>
        </div>
      }
      className="sm:max-w-xl"
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FormInput
              name="code"
              label="Kode Kupon Promo"
              placeholder="Contoh: MERDEKA2026, HEMAT20"
              required
              disabled={isEdit}
            />
            <FormInput
              name="name"
              label="Nama Promo"
              placeholder="Contoh: Diskon Pelanggan Baru 20%"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FormSelect
              name="discount_type"
              label="Tipe Diskon"
              options={discountTypeOptions}
            />

            {isPercentage ? (
              <FormNumberInput
                name="discount_value"
                label="Persentase Diskon (%)"
                placeholder="Contoh: 15"
                min={1}
                max={100}
                required
              />
            ) : (
              <FormNominalInput
                name="discount_value"
                label="Nominal Diskon (Rp)"
                placeholder="Contoh: 50.000"
                required
              />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {isPercentage ? (
              <FormNominalInput
                name="max_discount_amount"
                label="Maksimal Potongan Diskon"
                placeholder="Opsional, contoh: 200.000"
              />
            ) : (
              <div />
            )}
            <FormNominalInput
              name="min_order_amount"
              label="Minimal Belanja Order"
              placeholder="Opsional, contoh: 500.000"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FormSelect
              name="applicable_period"
              label="Berlaku Untuk Periode"
              options={periodOptions}
            />
            <FormNumberInput
              name="max_uses_per_client"
              label="Batas Pakai Per Klien"
              placeholder="1"
              min={1}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FormNumberInput
              name="max_uses"
              label="Total Kuota Kupon (Global)"
              placeholder="Kosongkan jika tanpa batas"
              min={1}
            />
            <div />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FormDatePicker
              name="starts_at"
              label="Mulai Berlaku"
              placeholder="Pilih tanggal mulai..."
            />
            <FormDatePicker
              name="expires_at"
              label="Berakhir Pada"
              placeholder="Pilih tanggal berakhir..."
            />
          </div>

          <FormTextarea
            name="description"
            label="Keterangan / Catatan Promo"
            placeholder="Keterangan syarat dan ketentuan..."
            rows={2}
          />

          <div className="rounded-xl border border-border bg-muted/20 p-3">
            <FormSwitch
              name="is_active"
              label="Status Kupon Aktif"
              description="Kupon yang aktif dapat digunakan oleh klien atau admin saat menerbitkan lisensi."
            />
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="h-9 px-4 text-xs font-semibold cursor-pointer rounded-xl"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="h-9 px-4 gap-2 text-xs font-semibold cursor-pointer rounded-xl shadow-xs"
            >
              {isPending && <Loader2 size={14} className="animate-spin" />}
              <span>{isEdit ? "Simpan Perubahan" : "Terbitkan Kupon"}</span>
            </Button>
          </div>
        </form>
      </FormProvider>
    </BaseDialog>
  )
}
