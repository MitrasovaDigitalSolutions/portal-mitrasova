import type { LucideIcon } from "lucide-react"
import {
  Boxes,
  FileText,
  KeyRound,
  LayoutDashboard,
  Server,
  Tag,
  Users,
} from "lucide-react"
import { ROUTES } from "@/constants/routes"

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  badge?: string
}

export const SIDEBAR_NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    href: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    title: "Invoices",
    href: ROUTES.INVOICES,
    icon: FileText,
  },
  {
    title: "Clients",
    href: ROUTES.CLIENTS,
    icon: Users,
  },
  {
    title: "Licenses",
    href: ROUTES.LICENSES,
    icon: KeyRound,
  },
  {
    title: "Products",
    href: ROUTES.PRODUCTS,
    icon: Boxes,
  },
  {
    title: "Server Hosting",
    href: ROUTES.SERVER_PACKAGES,
    icon: Server,
  },
  {
    title: "Kupon Diskon",
    href: ROUTES.COUPONS,
    icon: Tag,
  },
]

export function getNavTitle(pathname: string): string {
  if (pathname.startsWith("/dashboard")) { return "Dashboard" }
  if (pathname.startsWith("/invoices")) { return "Invoices" }
  if (pathname.startsWith("/clients")) { return "Clients" }
  if (pathname.startsWith("/licenses")) { return "Lisensi Instance" }
  if (pathname.startsWith("/products")) { return "Products" }
  if (pathname.startsWith("/server-packages")) { return "Paket Server" }
  if (pathname.startsWith("/coupons")) { return "Kupon Diskon" }
  return "Portal Mitrasova"
}
