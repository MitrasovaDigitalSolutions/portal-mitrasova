import { create } from "zustand"

interface SidebarState {
  isOpen: boolean
  isCollapsed: boolean
  isMobileOpen: boolean
  toggle: () => void
  toggleMobile: () => void
  setOpen: (open: boolean) => void
  setCollapsed: (collapsed: boolean) => void
  setMobileOpen: (open: boolean) => void
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: true,
  isCollapsed: false,
  isMobileOpen: false,
  toggle: () =>
    set((state) => ({
      isOpen: !state.isOpen,
      isCollapsed: state.isOpen,
    })),
  toggleMobile: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),
  setOpen: (isOpen) => set({ isOpen, isCollapsed: !isOpen }),
  setCollapsed: (isCollapsed) => set({ isCollapsed, isOpen: !isCollapsed }),
  setMobileOpen: (isMobileOpen) => set({ isMobileOpen }),
}))
