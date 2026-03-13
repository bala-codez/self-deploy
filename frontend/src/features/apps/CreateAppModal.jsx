import { useState } from "react";
import Modal from "../../components/ui/Modal";
import FormInput from "../../components/ui/FormInput";
import FormSelect from "../../components/ui/FormSelect";
import Btn from "../../components/ui/Btn";

const TEMPLATES = [
  { id: "nextjs",  icon: "▲", name: "Next.js",   image: "node:20-alpine", port: "3000", mem: "512" },
  { id: "fastapi", icon: "⚡", name: "FastAPI",   image: "python:3.11",   port: "8000", mem: "256" },
  { id: "nginx",   icon: "🌐", name: "Nginx",    image: "nginx:stable",  port: "80",   mem: "128" },
  { id: "postgres",icon: "🐘", name: "Postgres", image: "postgres:16",   port: "5432", mem: "512" },
  { id: "redis",   icon: "🔴", name: "Redis",    image: "redis:7-alpine",port: "6379", mem: "128" },
  { id: "custom",  icon: "📦", name: "Custom",   image: "",              port: "3000", mem: "512" },
];

const ENV_EXAMPLE = "NODE_ENV=production\nPORT=3000";

export default function CreateAppModal({ open, onClose, onCreate, toast }) {
  const [tab, setTab] = useState("docker");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [envText, setEnvText] = useState("");
  const [form, setForm] = useState({ name: "", image: "", gitUrl: "", branch: "main", port: "3000", mem: "512", domain: "", restartPolicy: "unless-stopped" });
  const [errors, setErrors] = useState({});
  const upd = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setErrors((er) => ({ ...er, [k]: "" })); };

  const applyTemplate = (t) => {
    setSelectedTemplate(t.id);
    if (t.image) setForm((f) => ({ ...f, image: t.image, port: t.port, mem: t.mem }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "App name is required";
    if (!form.name.match(/^[a-z0-9-]+$/i)) errs.name = "Only alphanumeric and hyphens";
    if (tab === "docker" && !form.image.trim()) errs.image = "Docker image is required";
    if (tab === "git" && !form.gitUrl.trim()) errs.gitUrl = "Git URL is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const slug = form.name.toLowerCase().replace(/\s+/g, "-");
      onCreate({
        name: form.name, image: form.image || "custom",
        url: form.domain || `${slug}.myapp.dev`,
        port: +form.port || 3000, status: "building",
        cpu: 0, mem: 0, memLimit: +form.mem || 512,
        uptime: "—", ssl: !!form.domain,
        created: new Date().toISOString().slice(0, 10),
      });
      onClose();
      setForm({ name: "", image: "", gitUrl: "", branch: "main", port: "3000", mem: "512", domain: "", restartPolicy: "unless-stopped" });
      setStep(1); setSelectedTemplate(null); setEnvText(""); setErrors({});
    }, 1200);
  };

  const reset = () => { onClose(); setStep(1); setErrors({}); setSelectedTemplate(null); };

  return (
    <Modal open={open} onClose={reset} title="Deploy New App" subtitle="Git repository or Docker image with auto SSL & routing"
      footer={
        <div className="flex items-center gap-3 w-full">
          {step === 2 && <Btn variant="ghost" size="sm" onClick={() => setStep(1)}>← Back</Btn>}
          <div className="flex-1" />
          <Btn variant="ghost" onClick={reset}>Cancel</Btn>
          {step === 1
            ? <Btn variant="primary" onClick={() => validate() && setStep(2)}>Continue →</Btn>
            : <Btn variant="primary" loading={loading} onClick={submit}>🚀 Deploy</Btn>
          }
        </div>
      }>

      {step === 1 && (
        <div className="space-y-5">
          {/* Source tabs */}
          <div className="flex gap-1 p-1 rounded-xl border" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
            {[["docker", "📦 Docker Image"], ["git", "⎇ Git Repository"]].map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)}
                className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
                style={{ background: tab === id ? "var(--card)" : "transparent", color: tab === id ? "var(--text)" : "var(--text2)", boxShadow: tab === id ? "0 1px 4px var(--shadow)" : "none" }}>
                {label}
              </button>
            ))}
          </div>

          {/* Templates (only for docker) */}
          {tab === "docker" && (
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--text3)" }}>Quick Templates</label>
              <div className="grid grid-cols-3 gap-2">
                {TEMPLATES.map((t) => (
                  <button key={t.id} onClick={() => applyTemplate(t)}
                    className="flex flex-col items-center p-2.5 rounded-xl border text-center transition-all"
                    style={{
                      background: selectedTemplate === t.id ? "var(--cyan-dim)" : "var(--panel)",
                      borderColor: selectedTemplate === t.id ? "var(--cyan)" : "var(--border)",
                      color: selectedTemplate === t.id ? "var(--cyan)" : "var(--text2)",
                    }}>
                    <span className="text-lg mb-0.5">{t.icon}</span>
                    <span className="text-[10px] font-semibold">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <FormInput label="App Name *" value={form.name} onChange={upd("name")} placeholder="my-api" error={errors.name}
            hint="Lowercase, alphanumeric and hyphens only" />

          {tab === "docker"
            ? <FormInput label="Docker Image *" value={form.image} onChange={upd("image")} placeholder="nginx:stable or ghcr.io/user/repo:latest" error={errors.image} />
            : (
              <div className="space-y-4">
                <FormInput label="Git Repository URL *" value={form.gitUrl} onChange={upd("gitUrl")} placeholder="https://github.com/user/repo" error={errors.gitUrl} />
                <div className="grid grid-cols-2 gap-3">
                  <FormInput label="Branch" value={form.branch} onChange={upd("branch")} placeholder="main" />
                  <FormInput label="Dockerfile Path" placeholder="./Dockerfile" onChange={() => {}} />
                </div>
              </div>
            )
          }

          <div className="grid grid-cols-2 gap-3">
            <FormInput label="Container Port" value={form.port} onChange={upd("port")} placeholder="3000" />
            <FormSelect label="Memory Limit" value={form.mem} onChange={upd("mem")}>
              <option value="128">128 MB</option>
              <option value="256">256 MB</option>
              <option value="512">512 MB</option>
              <option value="1024">1 GB</option>
              <option value="2048">2 GB</option>
            </FormSelect>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          {/* Summary */}
          <div className="rounded-xl border p-4" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
            <div className="text-xs font-semibold mb-3" style={{ color: "var(--text2)" }}>Deployment Summary</div>
            <div className="space-y-2">
              {[
                ["App", form.name],
                [tab === "docker" ? "Image" : "Repo", tab === "docker" ? form.image : form.gitUrl],
                ["Port", form.port],
                ["Memory", form.mem + " MB"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between text-xs">
                  <span style={{ color: "var(--text3)" }}>{k}</span>
                  <span className="font-mono font-medium" style={{ color: "var(--text)" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          <FormInput label="Custom Domain (optional)" value={form.domain} onChange={upd("domain")} placeholder="api.myapp.com" hint="Leave blank for auto-generated subdomain" />

          <FormSelect label="Restart Policy" value={form.restartPolicy} onChange={upd("restartPolicy")}>
            <option value="no">No — manual restart only</option>
            <option value="always">Always — restart on any exit</option>
            <option value="unless-stopped">Unless Stopped (recommended)</option>
            <option value="on-failure">On Failure — restart on non-zero exit</option>
          </FormSelect>

          {/* Environment variables */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--text3)" }}>
              Environment Variables
            </label>
            <textarea
              value={envText} onChange={(e) => setEnvText(e.target.value)}
              placeholder={ENV_EXAMPLE} rows={4}
              className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl outline-none resize-none transition-all border"
              style={{ background: "var(--input-bg)", borderColor: "var(--border2)", color: "var(--text)" }}
              onFocus={(e) => { e.target.style.borderColor = "var(--cyan)"; e.target.style.boxShadow = "0 0 0 3px var(--cyan-dim)"; }}
              onBlur={(e) => { e.target.style.borderColor = "var(--border2)"; e.target.style.boxShadow = "none"; }}
            />
            <p className="text-[10px]" style={{ color: "var(--text3)" }}>One KEY=VALUE per line</p>
          </div>
        </div>
      )}
    </Modal>
  );
}
