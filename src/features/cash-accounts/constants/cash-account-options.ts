import type { CommandOption } from "@/components/ui/command-select"
import type {
  CashAccountStatusFilter,
  CashAccountType,
} from "../@types/cash-account"

export const CASH_ACCOUNT_TYPE_LABELS: Record<CashAccountType, string> = {
  bank: "Rekening Bank",
  cash: "Kas Tunai",
  payment_gateway: "Payment Gateway",
  other: "Lainnya",
}

export const CASH_ACCOUNT_TYPE_OPTIONS: CommandOption[] = (
  Object.keys(CASH_ACCOUNT_TYPE_LABELS) as CashAccountType[]
).map((type) => ({ value: type, label: CASH_ACCOUNT_TYPE_LABELS[type] }))

export const CASH_ACCOUNT_STATUS_TABS: {
  value: CashAccountStatusFilter
  label: string
}[] = [
  { value: "all", label: "Semua" },
  { value: "active", label: "Aktif" },
  { value: "inactive", label: "Non-Aktif" },
]

export const DEFAULT_CASH_ACCOUNT_TYPE: CashAccountType = "bank"
