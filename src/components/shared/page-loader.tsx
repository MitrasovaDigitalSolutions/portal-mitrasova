"use client"

import { usePageLoadingStore } from "@/stores/page-loading-store"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function PageLoader() {
  const isLoading = usePageLoadingStore((state) => state.isLoading)
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)

  let loadingHint = "Memulai..."
  if (progress < 25) {
    loadingHint = "Menghubungkan ke server..."
  } else if (progress < 55) {
    loadingHint = "Memuat data..."
  } else if (progress < 75) {
    loadingHint = "Menyiapkan antarmuka..."
  } else if (progress < 95) {
    loadingHint = "Menyinkronkan status..."
  } else {
    loadingHint = "Hampir selesai..."
  }

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isLoading) {
      const startTimer = setTimeout(() => {
        setVisible(true)
        setProgress(0)
      }, 0)

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval)
            return 95
          }
          const remaining = 95 - prev
          const increment = Math.max(0.8, remaining * 0.1)
          const next = prev + increment
          return next >= 95 ? 95 : next
        })
      }, 100)

      return () => {
        clearTimeout(startTimer)
        clearInterval(interval)
      }
    } else {
      const finishTimer = setTimeout(() => {
        setProgress(100)
      }, 0)

      timer = setTimeout(() => {
        setVisible(false)
        setProgress(0)
      }, 300)

      return () => {
        clearTimeout(finishTimer)
        clearTimeout(timer)
      }
    }
  }, [isLoading])

  if (!visible && !isLoading) {
    return null
  }

  const progressInt = Math.round(progress)

  return (
    <AnimatePresence>
      {visible && (
        <div className="pointer-events-auto fixed inset-0 z-[9999]">
          {/* Top Progress Bar Line */}
          <div className="fixed top-0 right-0 left-0 z-[10000] h-1 overflow-hidden bg-muted">
            <div
              className="h-full bg-primary shadow-xs transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Lightweight Screen Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]"
          >
            {/* Center Loader Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex w-[240px] flex-col items-center justify-center rounded-2xl border border-border bg-card p-6 text-center shadow-xl"
            >
              {/* Hardware-Accelerated Dual-Ring Spinner */}
              <div className="relative my-1 flex h-16 w-16 items-center justify-center">
                {/* Outer Ring */}
                <div className="absolute inset-0 rounded-full border-2 border-primary/15" />
                <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary border-r-primary" />

                {/* Inner Ring (Reverse spin) */}
                <div className="absolute inset-2 rounded-full border-2 border-primary/10" />
                <div className="absolute inset-2 animate-[spin_1.5s_linear_infinite_reverse] rounded-full border-2 border-transparent border-b-primary/60" />

                {/* Center Progress Percentage */}
                <span className="font-mono text-xs font-bold tracking-tight text-primary select-none">
                  {progressInt}%
                </span>
              </div>

              {/* Label & Status Hint */}
              <div className="mt-3 space-y-0.5">
                <h4 className="text-[11px] font-bold tracking-wider text-foreground uppercase">
                  Memuat Halaman
                </h4>
                <p className="min-h-[14px] text-[10px] font-medium tracking-wide text-muted-foreground transition-all duration-200">
                  {loadingHint}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
