import type { CommandOption } from "@/components/ui/command-select"
import type {
  CashLedgerMutationType,
  CashLedgerRefType,
  CashLedgerType,
} from "../@types/cash-ledger"

export const CASH_LEDGER_MUTATION_LABELS: Record<
  CashLedgerMutationType,
  string
> = {
  credit: "Kas Masuk (+)",
  debit: "Kas Keluar (-)",
}

export const CASH_LEDGER_TYPE_LABELS: Record<CashLedgerType, string> = {
  inflow: "Pelunasan Invoice",
  outflow: "Pengeluaran Beban",
  transfer_in: "Transfer Masuk",
  transfer_out: "Transfer Keluar",
  adjustment_in: "Kredit Saldo (Masuk)",
  adjustment_out: "Debit Saldo (Keluar)",
}

export const CASH_LEDGER_REF_LABELS: Record<CashLedgerRefType, string> = {
  invoice: "Invoice",
  expense: "Pengeluaran Kas",
  cash_transfer: "Transfer Rekening",
  cash_transfer_admin_fee: "Biaya Admin Transfer",
  manual_adjustment: "Penyesuaian Manual",
  opening_balance: "Saldo Awal Akun",
  expense_cancellation: "Pembatalan Pengeluaran",
}

export const CASH_LEDGER_TYPE_OPTIONS: CommandOption[] = [
  { value: "", label: "Semua Tipe Transaksi" },
  { value: "inflow", label: "Pelunasan Invoice" },
  { value: "outflow", label: "Pengeluaran Beban" },
  { value: "transfer_in", label: "Transfer Masuk" },
  { value: "transfer_out", label: "Transfer Keluar" },
  { value: "adjustment_in", label: "Kredit Saldo (Masuk)" },
  { value: "adjustment_out", label: "Debit Saldo (Keluar)" },
]

export const CASH_LEDGER_MUTATION_OPTIONS: CommandOption[] = [
  { value: "", label: "Semua Mutasi (+/-)" },
  { value: "credit", label: "Kas Masuk (+ Kredit)" },
  { value: "debit", label: "Kas Keluar (- Debit)" },
]
