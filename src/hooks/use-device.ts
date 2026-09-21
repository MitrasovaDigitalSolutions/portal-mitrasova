"use client"

import { useEffect } from "react"
import { useDeviceStore } from "@/stores/device-store"

/**
 * Custom hook to access device responsive state.
 */
export function useDevice() {
  const isMobile = useDeviceStore((state) => state.isMobile)
  const isTablet = useDeviceStore((state) => state.isTablet)
  const isDesktop = useDeviceStore((state) => state.isDesktop)
  const deviceType = useDeviceStore((state) => state.deviceType)
  const screenWidth = useDeviceStore((state) => state.screenWidth)
  const screenHeight = useDeviceStore((state) => state.screenHeight)
  const isInitialized = useDeviceStore((state) => state.isInitialized)
  const setDimensions = useDeviceStore((state) => state.setDimensions)

  useEffect(() => {
    const handleResize = () => {
      setDimensions(window.innerWidth, window.innerHeight)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [setDimensions])

  return {
    isMobile,
    isTablet,
    isDesktop,
    deviceType,
    screenWidth,
    screenHeight,
    isInitialized,
  }
}

/**
 * Helper hook to check viewport categories.
 */
export function useDeviceResponsive() {
  const { isMobile, isTablet, isDesktop } = useDevice()
  return { isMobile, isTablet, isDesktop }
}
