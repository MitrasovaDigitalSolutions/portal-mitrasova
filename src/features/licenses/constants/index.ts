import type { LicenseStatus } from "../@types/license"

export const SUBSCRIPTION_TYPES: Record<
  string,
  { label: string; badgeVariant: "default" | "secondary" | "outline"; description?: string }
> = {
  monthly: {
    label: "Bulanan (Monthly)",
    badgeVariant: "secondary",
    description: "Langganan periode 1 bulan",
  },
  yearly: {
    label: "Tahunan (Yearly)",
    badgeVariant: "default",
    description: "Langganan periode 1 tahun",
  },
  lifetime: {
    label: "Seumur Hidup (Lifetime)",
    badgeVariant: "default",
    description: "Akses lisensi permanen",
  },
  trial: {
    label: "Uji Coba (Trial)",
    badgeVariant: "outline",
    description: "Masa evaluasi dan uji coba fitur",
  },
  multi_store: {
    label: "Multi-Store",
    badgeVariant: "default",
    description: "Lisensi paket Multi-Cabang / Multi-Outlet",
  },
  single_store: {
    label: "Single-Store",
    badgeVariant: "secondary",
    description: "Lisensi paket Single Store (1 Outlet)",
  },
  enterprise: {
    label: "Enterprise",
    badgeVariant: "default",
    description: "Lisensi skala korporasi / kustom",
  },
}

export const SERVER_TYPES: Record<
  string,
  { label: string; description?: string }
> = {
  cloud: {
    label: "Cloud Server",
    description: "Infrastruktur cloud standar terkelola",
  },
  cloud_dedicated: {
    label: "Cloud Dedicated",
    description: "Dedicated cloud instance untuk performa & isolasi tinggi",
  },
  cloud_shared: {
    label: "Cloud Shared",
    description: "Shared cloud hosting terisolasi multi-tenant",
  },
  self_hosted: {
    label: "Self-Hosted / On-Premise",
    description: "Server mandiri milik klien",
  },
  dedicated: {
    label: "Dedicated Server",
    description: "Server fisik bare-metal khusus",
  },
  vps: {
    label: "VPS",
    description: "Virtual Private Server",
  },
  shared: {
    label: "Shared Hosting",
    description: "Layanan web hosting bersama",
  },
  on_premise: {
    label: "On-Premise",
    description: "Infrastruktur lokal di lokasi fisik klien",
  },
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

/**
 * Registry master modul addon produk ekosistem Mitrasova.
 */
export const KNOWN_PRODUCT_ADDONS: Record<
  string,
  { code: string; nama: string; description?: string; category?: string }
> = {
  purchasing: {
    code: "purchasing",
    nama: "Pembelian & Supplier",
    description: "Purchase Order (PO), Penerimaan Barang, Selisih Harga, Retur.",
    category: "inventory",
  },
  debts: {
    code: "debts",
    nama: "Hutang & Piutang",
    description: "Hutang Usaha Supplier, Penjualan Tempo/Kredit, Riwayat Cicilan.",
    category: "finance",
  },
  expenses: {
    code: "expenses",
    nama: "Pengeluaran (Expenses)",
    description: "Biaya Operasional Toko, Kategori Beban, Akun Kas Sourcing.",
    category: "finance",
  },
  members: {
    code: "members",
    nama: "Member & CRM",
    description: "Direktori Member Pelanggan, Level/Tier, Poin Loyalitas.",
    category: "crm",
  },
  stock_opname: {
    code: "stock_opname",
    nama: "Stock Opname Scanner & Excel",
    description: "Audit Stok Fisik via Barcode Scanner Handheld, Import/Export Excel.",
    category: "inventory",
  },
  reports: {
    code: "reports",
    nama: "Laporan & Analisis Bisnis",
    description: "Laporan Laba Bersih/Kotor, Valuasi Nilai Stok, Tren Penjualan.",
    category: "analytics",
  },
  accounting: {
    code: "accounting",
    nama: "Akuntansi Lengkap (ERP)",
    description: "Chart of Accounts (COA), Jurnal Umum Double-Entry, Neraca, Laba Rugi.",
    category: "finance",
  },
  consignment: {
    code: "consignment",
    nama: "Konsinyasi (Barang Titipan)",
    description: "Penerimaan Off-Book, Auto FIFO HPP, Settlement Retur.",
    category: "inventory",
  },
  production: {
    code: "production",
    nama: "Produksi & Manufaktur (BOM)",
    description: "Bill of Materials (BOM/Resep), SPK Order Produksi, Penguraian Bahan Baku.",
    category: "manufacturing",
  },
  assets: {
    code: "assets",
    nama: "Manajemen Aset & Depresiasi",
    description: "Inventarisasi Aset Tetap, Jadwal Penyusutan Berkala.",
    category: "finance",
  },
  multi_store: {
    code: "multi_store",
    nama: "Multi-Store & Cabang",
    description: "Sinkronisasi antar cabang toko, transfer stok antar gudang & outlet.",
    category: "operations",
  },
}

/**
 * Format string snake_case atau kebab-case menjadi Title Case yang rapi.
 * Contoh: "cloud_dedicated" -> "Cloud Dedicated", "multi_store" -> "Multi Store"
 */
export function formatCodeToTitle(code?: string | null): string {
  if (!code) {
    return "-"
  }
  return code
    .split(/[_-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

/**
 * Mengambil label tipe langganan dengan fallback ke Title Case jika tidak terdaftar.
 */
export function getSubscriptionTypeLabel(type?: string | null): string {
  if (!type) {
    return "-"
  }
  return SUBSCRIPTION_TYPES[type]?.label ?? formatCodeToTitle(type)
}

/**
 * Mengambil label server hosting dengan fallback ke Title Case jika tidak terdaftar.
 */
export function getServerTypeLabel(type?: string | null): string {
  if (!type) {
    return "-"
  }
  return SERVER_TYPES[type]?.label ?? formatCodeToTitle(type)
}

/**
 * Mengambil varian badge tipe langganan.
 */
export function getSubscriptionBadgeVariant(
  type?: string | null
): "default" | "secondary" | "outline" {
  if (!type) {
    return "secondary"
  }
  return SUBSCRIPTION_TYPES[type]?.badgeVariant ?? "secondary"
}
