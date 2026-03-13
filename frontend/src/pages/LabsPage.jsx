import useAppStore from "../store/appStore";
import SectionHeader from "../components/ui/SectionHeader";
import Btn from "../components/ui/Btn";
import LabsTable from "../features/labs/LabsTable";
import { LAB_TYPES } from "../data/labTypes";

export default function LabsPage() {
  const labs = useAppStore((s) => s.labs);
  const setShowNewLab = useAppStore((s) => s.setShowNewLab);
  const running = labs.filter((l) => l.status === "running").length;

  return (
    <div className="space-y-6 animate-fadeUp">
      <SectionHeader
        title="Labs"
        count={`${running} running`}
        description="Managed dev tools: databases, CI/CD, automation, and dev environments"
        action={<Btn variant="primary" onClick={() => setShowNewLab(true)}>⬡ New Lab</Btn>}
      />

      {/* Available lab types */}
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text3)" }}>Available Lab Types</div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
          {LAB_TYPES.map((t) => {
            const count = labs.filter((l) => l.type === t.type).length;
            return (
              <button key={t.type} onClick={() => setShowNewLab(true)}
                className="p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all hover:-translate-y-0.5 hover:shadow-lg text-center group"
                style={{ background: "var(--card)", borderColor: "var(--border)" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.color; e.currentTarget.style.boxShadow = `0 4px 20px ${t.color}20`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = ""; }}>
                <span className="text-2xl">{t.emoji}</span>
                <span className="text-[11px] font-semibold" style={{ color: "var(--text)" }}>{t.name}</span>
                {count > 0 && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full" style={{ background: `${t.color}18`, color: t.color }}>{count} running</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Labs table */}
      <div>
        <SectionHeader title="Your Labs" count={labs.length} />
        <LabsTable labs={labs} />
      </div>
    </div>
  );
}
