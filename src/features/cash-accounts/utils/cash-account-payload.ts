import type {
  CreateCashAccountPayload,
  UpdateCashAccountPayload,
} from "../@types/cash-account"
import type { CashAccountFormValues } from "../validations/cash-account.schema"

function normalizeAccountNumber(value?: string | null): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

export function toCreateCashAccountPayload(
  values: CashAccountFormValues
): CreateCashAccountPayload {
  return {
    name: values.name.trim(),
    type: values.type,
    account_number: normalizeAccountNumber(values.account_number),
    opening_balance: values.opening_balance,
    is_default: values.is_default,
    is_active: values.is_active,
  }
}

/** Saldo awal sengaja tidak disertakan karena tidak dapat diubah. */
export function toUpdateCashAccountPayload(
  values: CashAccountFormValues
): UpdateCashAccountPayload {
  return {
    name: values.name.trim(),
    type: values.type,
    account_number: normalizeAccountNumber(values.account_number),
    is_default: values.is_default,
    is_active: values.is_active,
  }
}
