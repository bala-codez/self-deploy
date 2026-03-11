import { create } from "zustand"

const useToastStore = create((set) => ({
    toasts: [],

    addToast: (toast) =>
        set((state) => ({
            toasts: [
                ...state.toasts,
                { id: Date.now(), type: "info", ...toast }
            ]
        })),

    removeToast: (id) =>
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id)
        }))
}))

export default useToastStore