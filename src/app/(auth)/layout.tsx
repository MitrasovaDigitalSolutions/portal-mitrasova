import type { ReactNode } from "react"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4 text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Techno Grid & Dynamic Ambient Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* SVG Isometric / Cyber Grid Lines */}
        <svg
          className="absolute inset-0 h-full w-full stroke-foreground/[0.05] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="techno-grid-pattern"
              width="48"
              height="48"
              x="50%"
              y="-1"
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 48V.5H48" fill="none" />
              {/* Subtle tech node points */}
              <circle cx="0.5" cy="0.5" r="1" className="fill-foreground/[0.12]" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" strokeWidth="0" fill="url(#techno-grid-pattern)" />
        </svg>

        {/* Ambient Techno Radial Glows */}
        <div className="absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary/20 via-primary/10 to-transparent blur-[120px]" />
        <div className="absolute -bottom-40 left-1/4 h-[400px] w-[500px] rounded-full bg-primary/10 blur-[130px]" />
        <div className="absolute top-1/3 -right-32 h-[350px] w-[400px] rounded-full bg-primary/8 blur-[110px]" />
      </div>

      {/* Main Form Area */}
      <main className="z-10 flex w-full justify-center">{children}</main>

      {/* Subtle Bottom Attribution */}
      <footer className="pointer-events-none absolute right-0 bottom-4 left-0 text-center text-[11px] font-medium text-muted-foreground/60">
        Portal Mitrasova &copy; 2026 &bull; Mitrasova Digital Solutions
      </footer>
    </div>
  )
}
