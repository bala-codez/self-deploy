import { create } from "zustand";
import { MOCK_APPS } from "../data/mockApps";
import { MOCK_LABS } from "../data/mockLabs";
import { MOCK_DOMAINS } from "../data/mockDomains";

const useAppStore = create((set, get) => ({
  apps: MOCK_APPS,
  labs: MOCK_LABS,
  domains: MOCK_DOMAINS,

  showNewApp: false,
  showNewLab: false,
  setShowNewApp: (v) => set({ showNewApp: v }),
  setShowNewLab: (v) => set({ showNewLab: v }),

  addApp: (a) =>
    set((s) => ({ apps: [{ ...a, id: Date.now() }, ...s.apps] })),
  deleteApp: (id) =>
    set((s) => ({ apps: s.apps.filter((x) => x.id !== id) })),
  updateApp: (id, patch) =>
    set((s) => ({
      apps: s.apps.map((x) => (x.id === id ? { ...x, ...patch } : x)),
    })),

  addLab: (l) =>
    set((s) => ({ labs: [{ ...l, id: Date.now() }, ...s.labs] })),
  deleteLab: (id) =>
    set((s) => ({ labs: s.labs.filter((x) => x.id !== id) })),

  addDomain: (d) =>
    set((s) => ({ domains: [{ ...d, id: Date.now() }, ...s.domains] })),
  deleteDomain: (id) =>
    set((s) => ({ domains: s.domains.filter((x) => x.id !== id) })),

  toast: (title, msg = "", type = "success") => {
    const { addToast } = get();
    addToast({ title, msg, type });
  },

  toasts: [],
  addToast: (toast) =>
    set((s) => {
      const id = Date.now() + Math.random();
      const newToast = { id, type: "info", ...toast };
      // Auto-remove after 4500ms
      setTimeout(
        () => set((st) => ({ toasts: st.toasts.filter((t) => t.id !== id) })),
        4500
      );
      return { toasts: [...s.toasts, newToast] };
    }),
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export default useAppStore;
