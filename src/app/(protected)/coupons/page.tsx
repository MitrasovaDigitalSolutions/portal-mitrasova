import type { Metadata } from "next"
import { CouponsView } from "@/features/coupons"

export const metadata: Metadata = {
  title: "Kupon Diskon | Portal Mitrasova",
  description: "Kelola kupon promo, voucher diskon, dan ketentuan potongan harga lisensi.",
}

export default function CouponsPage() {
  return <CouponsView />
}
