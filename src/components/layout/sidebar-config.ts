import type { LucideIcon } from "lucide-react"
import {
  Boxes,
  FileText,
  LayoutDashboard,
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
    title: "Products",
    href: ROUTES.PRODUCTS,
    icon: Boxes,
  },
]

export function getNavTitle(pathname: string): string {
  if (pathname.startsWith("/dashboard")) { return "Dashboard" }
  if (pathname.startsWith("/invoices")) { return "Invoices" }
  if (pathname.startsWith("/clients")) { return "Clients" }
  if (pathname.startsWith("/products")) { return "Products" }
  return "Portal Mitrasova"
}
