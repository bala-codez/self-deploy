import { useState } from "react";
import useAppStore from "../store/appStore";
import Toggle from "../components/ui/Toggle";
import Btn from "../components/ui/Btn";
import Card from "../components/ui/Card";
import FormInput from "../components/ui/FormInput";

const SECTIONS = [
  { id: "general",  icon: "⚙", label: "General" },
  { id: "network",  icon: "🌐", label: "Network & SSL" },
  { id: "security", icon: "🔒", label: "Security" },
  { id: "resources",icon: "⚡", label: "Resources" },
  { id: "integrations", icon: "🔌", label: "Integrations" },
];

export default function SettingsPage() {
  const toast = useAppStore((s) => s.toast);
  const [active, setActive] = useState("general");
  const [settings, setSettings] = useState({
    autoSsl: true, httpsRedirect: true, rateLimit: true,
    autoRestart: false, rootContainers: false,
    backups: true, webhooks: false, webhookUrl: "",
    appMem: "512", labMem: "1024",
    serverName: "My DevDock", domain: "devdock.myapp.dev",
  });
  const upd = (k) => (v) => setSettings((s) => ({ ...s, [k]: v }));

  const Row = ({ label, sub, children }) => (
    <div className="flex items-center gap-4 px-5 py-4 border-b last:border-0 transition-colors"
      style={{ borderColor: "var(--border)" }}
      onMouseEnter={(e) => e.currentTarget.style.background = "var(--hover)"}
      onMouseLeave={(e) => e.currentTarget.style.background = ""}>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>{label}</div>
        {sub && <div className="text-xs mt-0.5" style={{ color: "var(--text2)" }}>{sub}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );

  return (
    <div className="animate-fadeUp flex gap-6 flex-col md:flex-row">
      {/* Sidebar nav */}
      <div className="md:w-44 shrink-0">
        <div className="space-y-0.5">
          {SECTIONS.map((s) => (
            <button key={s.id} onClick={() => setActive(s.id)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all border"
              style={{
                background: active === s.id ? "var(--cyan-dim)" : "transparent",
                borderColor: active === s.id ? "var(--border2)" : "transparent",
                color: active === s.id ? "var(--cyan)" : "var(--text2)",
              }}>
              <span>{s.icon}</span> {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-5 min-w-0 max-w-xl">
        {active === "general" && (
          <Card className="overflow-hidden">
            <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)", background: "var(--panel)" }}>
              <h3 className="text-sm font-bold" style={{ color: "var(--text)" }}>General Settings</h3>
            </div>
            <div className="p-5 space-y-4">
              <FormInput label="Server Name" value={settings.serverName}
                onChange={(e) => upd("serverName")(e.target.value)} />
              <FormInput label="Base Domain" value={settings.domain}
                onChange={(e) => upd("domain")(e.target.value)} hint="New apps get a subdomain under this" />
            </div>
          </Card>
        )}

        {active === "network" && (
          <Card className="overflow-hidden">
            <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)", background: "var(--panel)" }}>
              <h3 className="text-sm font-bold" style={{ color: "var(--text)" }}>Network & SSL</h3>
            </div>
            <Row label="Auto SSL (Let's Encrypt)" sub="Auto-provision certs for all custom domains"><Toggle on={settings.autoSsl} onChange={upd("autoSsl")} /></Row>
            <Row label="HTTP → HTTPS Redirect" sub="Force HTTPS via Traefik middleware"><Toggle on={settings.httpsRedirect} onChange={upd("httpsRedirect")} /></Row>
            <Row label="Rate Limiting" sub="100 req/min per IP via Traefik middleware"><Toggle on={settings.rateLimit} onChange={upd("rateLimit")} /></Row>
          </Card>
        )}

        {active === "security" && (
          <Card className="overflow-hidden">
            <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)", background: "var(--panel)" }}>
              <h3 className="text-sm font-bold" style={{ color: "var(--text)" }}>Security</h3>
            </div>
            <Row label="Container Auto-Restart" sub="Restart containers automatically on failure"><Toggle on={settings.autoRestart} onChange={upd("autoRestart")} /></Row>
            <Row label="Allow Root Containers" sub={<span style={{ color: "var(--amber)" }}>⚠ Security risk — not recommended</span>}>
              <Toggle on={settings.rootContainers} onChange={upd("rootContainers")} />
            </Row>
          </Card>
        )}

        {active === "resources" && (
          <Card className="overflow-hidden">
            <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)", background: "var(--panel)" }}>
              <h3 className="text-sm font-bold" style={{ color: "var(--text)" }}>Default Resource Limits</h3>
            </div>
            <Row label="App Memory Limit" sub="Default per application container">
              <select value={settings.appMem} onChange={(e) => upd("appMem")(e.target.value)} className="text-sm rounded-xl px-3 py-1.5 border outline-none" style={{ background: "var(--panel)", borderColor: "var(--border2)", color: "var(--text)" }}>
                {["256", "512", "1024", "2048"].map((v) => <option key={v} value={v}>{+v >= 1024 ? v / 1024 + " GB" : v + " MB"}</option>)}
              </select>
            </Row>
            <Row label="Lab Memory Limit" sub="Default per lab container">
              <select value={settings.labMem} onChange={(e) => upd("labMem")(e.target.value)} className="text-sm rounded-xl px-3 py-1.5 border outline-none" style={{ background: "var(--panel)", borderColor: "var(--border2)", color: "var(--text)" }}>
                {["512", "1024", "2048", "4096"].map((v) => <option key={v} value={v}>{+v >= 1024 ? v / 1024 + " GB" : v + " MB"}</option>)}
              </select>
            </Row>
          </Card>
        )}

        {active === "integrations" && (
          <Card className="overflow-hidden">
            <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)", background: "var(--panel)" }}>
              <h3 className="text-sm font-bold" style={{ color: "var(--text)" }}>Integrations</h3>
            </div>
            <Row label="Automated Backups" sub="Daily volume snapshots to storage"><Toggle on={settings.backups} onChange={upd("backups")} /></Row>
            <Row label="Webhook Notifications" sub="HTTP POST on container lifecycle events"><Toggle on={settings.webhooks} onChange={upd("webhooks")} /></Row>
            {settings.webhooks && (
              <div className="px-5 pb-4">
                <FormInput label="Webhook URL" value={settings.webhookUrl} onChange={(e) => upd("webhookUrl")(e.target.value)} placeholder="https://hooks.slack.com/..." />
              </div>
            )}
          </Card>
        )}

        <div className="flex gap-3">
          <Btn variant="primary" onClick={() => toast("Saved", "Settings updated successfully.")}>Save Changes</Btn>
          <Btn variant="ghost" onClick={() => toast("Reset", "Settings reset to defaults.", "warn")}>Reset Defaults</Btn>
        </div>
      </div>
    </div>
  );
}
