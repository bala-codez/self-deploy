import { useEffect } from "react";
import Btn from "./Btn";

export default function Modal({ open, onClose, title, subtitle, children, footer, size = "md" }) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;
  const widths = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-3xl" };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fadeIn" onClick={onClose} />
      <div className={`relative w-full ${widths[size]} animate-scaleIn rounded-t-2xl sm:rounded-2xl border overflow-hidden max-h-[90vh] flex flex-col`}
        style={{ background: "var(--surface)", borderColor: "var(--border2)", boxShadow: "0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px var(--border)" }}>
        {/* Accent line */}
        <div className="h-0.5 w-full" style={{ background: "linear-gradient(90deg, var(--cyan), var(--violet))" }} />
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b shrink-0" style={{ borderColor: "var(--border)" }}>
          <div>
            <h2 className="text-base font-bold" style={{ color: "var(--text)" }}>{title}</h2>
            {subtitle && <p className="text-sm mt-0.5" style={{ color: "var(--text2)" }}>{subtitle}</p>}
          </div>
          <button onClick={onClose} className="ml-4 w-8 h-8 flex items-center justify-center rounded-xl transition-all hover:bg-[var(--hover)] text-sm shrink-0" style={{ color: "var(--text3)" }}>✕</button>
        </div>
        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto flex-1">{children}</div>
        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t shrink-0 flex items-center justify-end gap-3" style={{ borderColor: "var(--border)", background: "var(--panel)" }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
