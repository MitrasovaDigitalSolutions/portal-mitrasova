import type {
  LicenseSubscriptionType,
  LicenseServerType,
  LicenseStatus,
} from "../@types/license"

export const SUBSCRIPTION_TYPES: Record<
  LicenseSubscriptionType,
  { label: string; badgeVariant: "default" | "secondary" | "outline" }
> = {
  monthly: { label: "Bulanan (Monthly)", badgeVariant: "secondary" },
  yearly: { label: "Tahunan (Yearly)", badgeVariant: "default" },
  lifetime: { label: "Seumur Hidup (Lifetime)", badgeVariant: "default" },
  trial: { label: "Uji Coba (Trial)", badgeVariant: "outline" },
}

export const SERVER_TYPES: Record<LicenseServerType, { label: string }> = {
  cloud: { label: "Cloud Server" },
  self_hosted: { label: "Self-Hosted / On-Premise" },
  dedicated: { label: "Dedicated Server" },
  vps: { label: "VPS" },
  shared: { label: "Shared Hosting" },
}

export const LICENSE_STATUSES: Record<
  LicenseStatus,
  {
    label: string
    variant: "success" | "warning" | "danger" | "secondary" | "neutral"
  }
> = {
  active: { label: "Aktif", variant: "success" },
  trial: { label: "Uji Coba", variant: "warning" },
  suspended: { label: "Ditangguhkan", variant: "danger" },
  expired: { label: "Kedaluwarsa", variant: "neutral" },
}

export const QUICK_EXTEND_OPTIONS = [
  { label: "+30 Hari", days: 30 },
  { label: "+90 Hari (3 Bulan)", days: 90 },
  { label: "+180 Hari (6 Bulan)", days: 180 },
  { label: "+365 Hari (1 Tahun)", days: 365 },
] as const

export const DEFAULT_GRACE_PERIOD_DAYS = 7
