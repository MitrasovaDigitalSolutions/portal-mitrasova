import { auth } from "@/lib/auth"
import { ROUTES } from "@/constants/routes"

export const proxy = auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  // Halaman root "/": default ke dashboard jika sudah login, atau login jika belum
  if (pathname === "/") {
    if (isLoggedIn) {
      return Response.redirect(new URL(ROUTES.DASHBOARD, req.nextUrl))
    }
    return Response.redirect(new URL(ROUTES.LOGIN, req.nextUrl))
  }

  const isAuthPage = pathname.startsWith(ROUTES.LOGIN)
  const isProtectedPage =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/invoices") ||
    pathname.startsWith("/clients") ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/users") ||
    pathname.startsWith("/profile")

  if (isProtectedPage && !isLoggedIn) {
    const callbackUrl = encodeURIComponent(pathname)
    return Response.redirect(
      new URL(`${ROUTES.LOGIN}?callbackUrl=${callbackUrl}`, req.nextUrl)
    )
  }

  if (isAuthPage && isLoggedIn) {
    return Response.redirect(new URL(ROUTES.DASHBOARD, req.nextUrl))
  }

  return
})

export default proxy

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
