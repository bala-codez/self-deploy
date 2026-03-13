import { useState } from "react";
import useAppStore from "../store/appStore";
import SectionHeader from "../components/ui/SectionHeader";
import Btn from "../components/ui/Btn";
import Card from "../components/ui/Card";
import StatusBadge from "../components/ui/StatusBadge";
import Modal from "../components/ui/Modal";
import FormInput from "../components/ui/FormInput";
import FormSelect from "../components/ui/FormSelect";

export default function DomainsPage() {
  const domains = useAppStore((s) => s.domains);
  const apps = useAppStore((s) => s.apps);
  const labs = useAppStore((s) => s.labs);
  const addDomain = useAppStore((s) => s.addDomain);
  const deleteDomain = useAppStore((s) => s.deleteDomain);
  const toast = useAppStore((s) => s.toast);

  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ host: "", target: "", ssl: "true" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const upd = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setErrors((er) => ({ ...er, [k]: "" })); };

  const targets = [
    ...apps.map((a) => ({ label: a.name, value: a.name })),
    ...labs.map((l) => ({ label: l.name, value: l.name })),
  ];

  const validate = () => {
    const errs = {};
    if (!form.host.trim()) errs.host = "Domain is required";
    if (!form.host.includes(".")) errs.host = "Enter a valid domain";
    if (!form.target) errs.target = "Select a target";
    setErrors(errs);
    return !Object.keys(errs).length;
  };

  const submit = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addDomain({ host: form.host, target: form.target, ssl: form.ssl === "true", status: "pending" });
      toast("Domain added!", `${form.host} → DNS propagating.`);
      setAdding(false);
      setForm({ host: "", target: "", ssl: "true" });
    }, 900);
  };

  const sslCount = domains.filter((d) => d.ssl).length;
  const activeCount = domains.filter((d) => d.status === "active").length;

  return (
    <div className="space-y-6 animate-fadeUp">
      <SectionHeader
        title="Domains"
        count={`${domains.length} total`}
        description="Manage routing rules with Traefik reverse proxy and Let's Encrypt SSL"
        action={<Btn variant="primary" onClick={() => setAdding(true)}>+ Add Domain</Btn>}
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          ["Active", activeCount, "var(--emerald)", "var(--emerald-dim)"],
          ["SSL Active", sslCount, "var(--cyan)", "var(--cyan-dim)"],
          ["Pending", domains.length - activeCount, "var(--amber)", "rgba(251,191,36,.1)"],
        ].map(([label, val, col, bg]) => (
          <Card key={label} className="p-4 text-center">
            <div className="text-2xl font-bold mb-0.5" style={{ color: col }}>{val}</div>
            <div className="text-xs" style={{ color: "var(--text2)" }}>{label}</div>
          </Card>
        ))}
      </div>

      {/* Domains table */}
      <Card className="overflow-hidden">
        <div className="hidden md:grid grid-cols-[2fr_1.5fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b text-[10px] font-bold uppercase tracking-widest"
          style={{ background: "var(--panel)", borderColor: "var(--border)", color: "var(--text3)" }}>
          <span>Domain</span><span>Target</span><span>SSL</span><span>Status</span><span></span>
        </div>

        {domains.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-3xl mb-3 opacity-10">◉</div>
            <p className="text-sm" style={{ color: "var(--text2)" }}>No domains configured</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {domains.map((d) => (
              <div key={d.id}
                className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1fr_1fr_auto] gap-3 md:gap-4 px-5 py-4 items-center transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.background = "var(--hover)"}
                onMouseLeave={(e) => e.currentTarget.style.background = ""}>
                <div>
                  <div className="text-sm font-mono font-semibold" style={{ color: "var(--cyan)" }}>{d.host}</div>
                  <div className="text-[10px] mt-0.5 flex items-center gap-1.5" style={{ color: "var(--text3)" }}>
                    <span>A</span>
                    <span className="w-3 h-px" style={{ background: "var(--border2)" }} />
                    <span>198.51.100.1</span>
                  </div>
                </div>
                <div className="text-sm" style={{ color: "var(--text2)" }}>→ {d.target}</div>
                <div>
                  {d.ssl
                    ? <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border" style={{ color: "var(--emerald)", borderColor: "var(--emerald)/25", background: "var(--emerald-dim)" }}>🔒 Active</span>
                    : <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border" style={{ color: "var(--text3)", borderColor: "var(--border2)" }}>None</span>
                  }
                </div>
                <StatusBadge status={d.status} />
                <div className="flex gap-1.5">
                  {!d.ssl && <Btn variant="ghost" size="xs" onClick={() => toast("Issuing cert", `SSL cert being issued for ${d.host}.`, "info")}>🔒</Btn>}
                  <Btn variant="danger" size="xs" onClick={() => { deleteDomain(d.id); toast("Removed", `${d.host} removed.`, "warn"); }}>✕</Btn>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* DNS Guide */}
      <Card className="p-5">
        <div className="text-xs font-bold mb-3" style={{ color: "var(--text)" }}>🌐 DNS Configuration Guide</div>
        <p className="text-xs mb-3" style={{ color: "var(--text2)" }}>
          Point your domain's A record to your server IP. SSL certificates are auto-issued via Let's Encrypt within ~2 minutes after DNS propagation.
        </p>
        <div className="font-mono text-xs p-3 rounded-xl border" style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--cyan)" }}>
          your-domain.com  A  →  YOUR.SERVER.IP
        </div>
      </Card>

      {/* Add Domain Modal */}
      <Modal open={adding} onClose={() => setAdding(false)} title="Add Domain" subtitle="Route a custom domain to an app or lab via Traefik"
        footer={<><Btn variant="ghost" onClick={() => setAdding(false)}>Cancel</Btn><Btn variant="primary" loading={loading} onClick={submit}>Add Domain</Btn></>}>
        <div className="space-y-4">
          <FormInput label="Domain *" value={form.host} onChange={upd("host")} placeholder="api.myapp.com" error={errors.host} hint="Must be pointed to your server's IP" />
          <FormSelect label="Route to *" value={form.target} onChange={upd("target")} className={errors.target ? "ring-1 ring-rose-500" : ""}>
            <option value="">— Select target —</option>
            {targets.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </FormSelect>
          {errors.target && <p className="text-[11px]" style={{ color: "var(--rose)" }}>{errors.target}</p>}
          <FormSelect label="SSL / HTTPS" value={form.ssl} onChange={upd("ssl")}>
            <option value="true">Enabled — Auto Let's Encrypt (recommended)</option>
            <option value="false">Disabled — HTTP only</option>
          </FormSelect>
        </div>
      </Modal>
    </div>
  );
}
