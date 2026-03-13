import { useState } from "react";
import Modal from "../../components/ui/Modal";
import FormInput from "../../components/ui/FormInput";
import FormSelect from "../../components/ui/FormSelect";
import Btn from "../../components/ui/Btn";
import { LAB_TYPES } from "../../data/labTypes";

export default function CreateLabModal({ open, onClose, onCreate, toast }) {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", mem: "1024", vol: "10" });
  const [errors, setErrors] = useState({});
  const upd = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setErrors((er) => ({ ...er, [k]: "" })); };

  const validate = () => {
    const errs = {};
    if (!selected) { toast("Select a lab type", "Choose one from the list.", "warn"); return false; }
    if (!form.name.trim()) errs.name = "Lab name required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    setLoading(true);
    const type = LAB_TYPES.find((t) => t.type === selected);
    setTimeout(() => {
      setLoading(false);
      onCreate({
        name: form.name,
        type: selected,
        image: type?.version || selected,
        conn: selected === "ubuntu" ? "ssh://lab.devdock.io" : `${form.name}:${selected === "mysql" ? "3306" : selected === "redis" ? "6379" : selected === "mongodb" ? "27017" : "8080"}`,
        vol: "0 GB",
        volMax: form.vol + " GB",
        cpu: 0, mem: 0,
        memMax: +form.mem,
        uptime: "—",
        status: "running",
        created: new Date().toISOString().slice(0, 10),
      });
      onClose();
      setForm({ name: "", mem: "1024", vol: "10" });
      setSelected(null);
      setErrors({});
    }, 1000);
  };

  const reset = () => { onClose(); setSelected(null); setForm({ name: "", mem: "1024", vol: "10" }); setErrors({}); };

  return (
    <Modal open={open} onClose={reset} title="Deploy a Lab" subtitle="Managed dev tool with automatic connectivity"
      footer={
        <>
          <Btn variant="ghost" onClick={reset}>Cancel</Btn>
          <Btn variant="primary" loading={loading} onClick={submit}>🔬 Launch Lab</Btn>
        </>
      }>
      <div className="space-y-5">
        {/* Lab type picker */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2.5" style={{ color: "var(--text3)" }}>Lab Type</label>
          <div className="grid grid-cols-3 gap-2">
            {LAB_TYPES.map((t) => (
              <button key={t.type} onClick={() => setSelected(t.type)}
                className="p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all hover:-translate-y-0.5"
                style={{
                  background: selected === t.type ? `${t.color}14` : "var(--panel)",
                  borderColor: selected === t.type ? t.color : "var(--border)",
                  boxShadow: selected === t.type ? `0 4px 20px ${t.color}25` : "none",
                }}>
                <span className="text-2xl">{t.emoji}</span>
                <span className="text-[11px] font-semibold" style={{ color: selected === t.type ? t.color : "var(--text2)" }}>{t.name}</span>
                <span className="text-[9px] font-mono" style={{ color: "var(--text3)" }}>{t.version}</span>
              </button>
            ))}
          </div>
        </div>

        <FormInput label="Lab Name *" value={form.name} onChange={upd("name")} placeholder={`my-${selected || "lab"}`} error={errors.name} />

        <div className="grid grid-cols-2 gap-3">
          <FormSelect label="Memory" value={form.mem} onChange={upd("mem")}>
            <option value="512">512 MB</option>
            <option value="1024">1 GB</option>
            <option value="2048">2 GB</option>
            <option value="4096">4 GB</option>
          </FormSelect>
          <FormSelect label="Volume Size" value={form.vol} onChange={upd("vol")}>
            <option value="5">5 GB</option>
            <option value="10">10 GB</option>
            <option value="20">20 GB</option>
            <option value="50">50 GB</option>
          </FormSelect>
        </div>

        {selected && (
          <div className="rounded-xl border p-4" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">{LAB_TYPES.find((t) => t.type === selected)?.emoji}</span>
              <span className="text-xs font-semibold" style={{ color: "var(--text)" }}>{LAB_TYPES.find((t) => t.type === selected)?.name} Configuration</span>
            </div>
            <p className="text-xs" style={{ color: "var(--text2)" }}>
              {selected === "mysql" && "MySQL 8 with random root password. Connection string auto-configured."}
              {selected === "mongodb" && "MongoDB 7 with authentication disabled for dev use."}
              {selected === "redis" && "Redis 7 with AOF persistence enabled."}
              {selected === "jenkins" && "Jenkins LTS with recommended plugins pre-installed."}
              {selected === "n8n" && "n8n workflow automation with SQLite backend."}
              {selected === "ubuntu" && "Ubuntu 22.04 with SSH access via DevDock tunnel."}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
