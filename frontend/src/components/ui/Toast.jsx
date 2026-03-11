const ICONS = { success: "✓", error: "✕", warn: "!", info: "i" };
const COLORS = {
    success: { border: "var(--emerald)", icon: "var(--emerald)", bg: "var(--emerald-dim)" },
    error:   { border: "var(--rose)",    icon: "var(--rose)",    bg: "rgba(248,113,113,.1)" },
    warn:    { border: "var(--amber)",   icon: "var(--amber)",   bg: "rgba(251,191,36,.1)" },
    info:    { border: "var(--cyan)",    icon: "var(--cyan)",    bg: "var(--cyan-dim)" },
};

function ToastItem({ toast, remove }) {
    const c = COLORS[toast.type] || COLORS.info;
    return (
        <div className="animate-toastIn flex items-start gap-3 p-4 rounded-2xl border min-w-72 max-w-sm shadow-2xl backdrop-blur-xl"
             style={{ background: "var(--surface)", borderColor: `${c.border}35`, boxShadow: `0 8px 32px var(--shadow-lg), 0 0 0 1px ${c.border}18` }}>
            <div className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
                 style={{ background: c.bg, color: c.icon }}>{ICONS[toast.type] || ICONS.info}</div>
            <div className="flex-1 min-w-0 pt-0.5">
                <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>{toast.title}</div>
                {toast.msg && <div className="text-xs mt-0.5" style={{ color: "var(--text2)" }}>{toast.msg}</div>}
            </div>
            <button onClick={() => remove(toast.id)} className="shrink-0 w-5 h-5 flex items-center justify-center text-[10px] transition-colors hover:text-[var(--text)] rounded-lg" style={{ color: "var(--text3)" }}>✕</button>
        </div>
    );
}

export default function Toast({ toasts, remove }) {
    if (!toasts?.length) return null;
    return (
        <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5 items-end">
            {toasts.map((t) => <ToastItem key={t.id} toast={t} remove={remove} />)}
        </div>
    );
}
