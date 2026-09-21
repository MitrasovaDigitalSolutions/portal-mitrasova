import { create } from "zustand"

interface ConfirmDialogParams {
  title: string
  description: string
  onConfirm: () => void
  variant?: "default" | "destructive"
}

interface UIState {
  confirmDialog: {
    isOpen: boolean
    title: string
    description: string
    onConfirm: (() => void) | null
    variant: "default" | "destructive"
  }
  openConfirmDialog: (params: ConfirmDialogParams) => void
  closeConfirmDialog: () => void
}

export const useUIStore = create<UIState>()((set) => ({
  confirmDialog: {
    isOpen: false,
    title: "",
    description: "",
    onConfirm: null,
    variant: "default",
  },

  openConfirmDialog: ({
    title,
    description,
    onConfirm,
    variant = "destructive",
  }) =>
    set({
      confirmDialog: {
        isOpen: true,
        title,
        description,
        onConfirm,
        variant,
      },
    }),

  closeConfirmDialog: () =>
    set((state) => ({
      confirmDialog: {
        ...state.confirmDialog,
        isOpen: false,
        onConfirm: null,
      },
    })),
}))
