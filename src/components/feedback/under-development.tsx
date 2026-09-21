"use client"

import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Settings, ArrowLeft } from "lucide-react"

export interface UnderDevelopmentProps {
  title: string
  description: string
  icon?: ReactNode
  backUrl?: string
  backLabel?: string
}

export function UnderDevelopment({
  title,
  description,
  icon,
  backUrl,
  backLabel = "Kembali",
}: UnderDevelopmentProps) {
  const router = useRouter()

  return (
    <div className="relative flex min-h-[85vh] flex-1 flex-col items-center justify-center overflow-hidden p-4 md:p-8">
      {/* Ambient Background Glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -30, 40, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-primary/5 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -35, 35, 0],
            y: [0, 45, -35, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-primary/5 blur-3xl"
        />
      </div>

      {/* Container Motion Wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="z-10 w-full max-w-md"
      >
        <Card className="overflow-hidden rounded-3xl border border-border bg-card/80 shadow-lg backdrop-blur-xl">
          <CardContent className="flex flex-col items-center p-8 text-center">
            {/* Animated Icon Beacon */}
            <div className="relative mb-6 flex h-20 w-20 items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20"
              />
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-2.5 rounded-full bg-primary/10"
              />
              <div className="relative z-10">
                {icon ? (
                  <div className="text-primary">{icon}</div>
                ) : (
                  <Settings className="h-8 w-8 animate-[spin_6s_linear_infinite] text-primary" />
                )}
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-1.5 right-1.5 h-3 w-3 rounded-full border-2 border-background bg-primary shadow-xs"
              />
            </div>

            {/* Title and Tag */}
            <span className="mb-3 block rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[9px] font-extrabold tracking-widest text-primary uppercase shadow-xs">
              Segera Hadir
            </span>

            <h2 className="text-xl font-bold tracking-tight text-foreground">
              {title}
            </h2>

            <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
              {description}
            </p>

            {/* Interactive Buttons */}
            <div className="mt-8 flex w-full justify-center">
              <button
                type="button"
                onClick={() => {
                  if (backUrl) {
                    router.push(backUrl)
                  } else {
                    router.back()
                  }
                }}
                className="group flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-background text-xs font-bold text-foreground shadow-xs transition-all duration-200 hover:bg-muted active:scale-95 sm:w-48"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                {backLabel}
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
