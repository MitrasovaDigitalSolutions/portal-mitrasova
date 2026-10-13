import type { LucideIcon } from "lucide-react"
import {
  Boxes,
  FileText,
  FolderTree,
  KeyRound,
  Landmark,
  LayoutDashboard,
  Receipt,
  Server,
  Tag,
  Users,
} from "lucide-react"
import { ROUTES } from "@/constants/routes"

export interface NavSubItem {
  title: string
  href: string
  icon?: LucideIcon
  badge?: string
}

export interface NavItem {
  title: string
  href?: string
  icon: LucideIcon
  badge?: string
  children?: NavSubItem[]
}

export interface SidebarSectionConfig {
  title: string
  items: NavItem[]
}

export const SIDEBAR_SECTIONS: SidebarSectionConfig[] = [
  // ─── 1. Menu Utama ──────────────────────────────────────────────
  {
    title: "Menu Utama",
    items: [
      {
        title: "Dashboard",
        href: ROUTES.DASHBOARD,
        icon: LayoutDashboard,
      },
    ],
  },

  // ─── 2. Layanan & Mitra ─────────────────────────────────────────
  {
    title: "Layanan & Klien",
    items: [
      {
        title: "Mitra Klien",
        href: ROUTES.CLIENTS,
        icon: Users,
      },
      {
        title: "Lisensi Instance",
        href: ROUTES.LICENSES,
        icon: KeyRound,
      },
      {
        title: "Invoices Tagihan",
        href: ROUTES.INVOICES,
        icon: FileText,
      },
    ],
  },

  // ─── 3. Keuangan & Kas ──────────────────────────────────────────
  {
    title: "Keuangan & Kas",
    items: [
      {
        title: "Kas & Bank",
        href: ROUTES.CASH_ACCOUNTS,
        icon: Landmark,
      },
      {
        title: "Pengeluaran",
        icon: Receipt,
        children: [
          {
            title: "Catatan Pengeluaran",
            href: ROUTES.EXPENSES,
            icon: Receipt,
          },
          {
            title: "Kategori Pengeluaran",
            href: ROUTES.EXPENSE_CATEGORIES,
            icon: FolderTree,
          },
        ],
      },
    ],
  },

  // ─── 4. Katalog & Paket ─────────────────────────────────────────
  {
    title: "Katalog & Produk",
    items: [
      {
        title: "Katalog & Master",
        icon: Boxes,
        children: [
          {
            title: "SKU Produk & Addon",
            href: ROUTES.PRODUCTS,
            icon: Boxes,
          },
          {
            title: "Paket Server Hosting",
            href: ROUTES.SERVER_PACKAGES,
            icon: Server,
          },
          {
            title: "Kupon Diskon",
            href: ROUTES.COUPONS,
            icon: Tag,
          },
        ],
      },
    ],
  },
]

/** Helper untuk mengecek apakah sebuah NavItem atau anaknya sedang aktif */
export function isNavItemActive(item: NavItem, pathname: string): boolean {
  if (item.href) {
    return item.href === ROUTES.DASHBOARD
      ? pathname === ROUTES.DASHBOARD
      : pathname.startsWith(item.href)
  }
  if (item.children && item.children.length > 0) {
    return item.children.some((child) => pathname.startsWith(child.href))
  }
  return false
}

export function hasActiveChild(item: NavItem, pathname: string): boolean {
  return Boolean(
    item.children &&
    item.children.some((child) => pathname.startsWith(child.href))
  )
}

export function getNavTitle(pathname: string): string {
  if (pathname.startsWith("/dashboard")) {
    return "Dashboard"
  }
  if (pathname.startsWith("/invoices")) {
    return "Invoices"
  }
  if (pathname.startsWith("/cash-accounts")) {
    return "Kelola Kas & Bank"
  }
  if (pathname.startsWith("/cash-ledgers")) {
    return "Buku Kas & Mutasi"
  }
  if (pathname.startsWith("/cashflow")) {
    return "Arus Kas (Cashflow)"
  }
  if (pathname.startsWith("/expenses")) {
    return "Pengeluaran Kas"
  }
  if (pathname.startsWith("/expense-categories")) {
    return "Kategori Pengeluaran"
  }
  if (pathname.startsWith("/clients")) {
    return "Mitra Klien"
  }
  if (pathname.startsWith("/licenses")) {
    return "Lisensi Instance"
  }
  if (pathname.startsWith("/products")) {
    return "SKU Produk & Addon"
  }
  if (pathname.startsWith("/server-packages")) {
    return "Paket Server Hosting"
  }
  if (pathname.startsWith("/coupons")) {
    return "Kupon Diskon"
  }
  return "Portal Mitrasova"
}
