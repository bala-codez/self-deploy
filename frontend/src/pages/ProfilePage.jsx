import { useState } from "react";
import useAppStore from "../store/appStore";
import useAuthStore from "../store/authStore";
import Card from "../components/ui/Card";
import FormInput from "../components/ui/FormInput";
import Btn from "../components/ui/Btn";

const TABS = [["general","👤 General"], ["security","🔑 Security"], ["api","⚡ API Keys"], ["billing","💳 Billing"], ["danger","⚠️ Danger"]];

export default function ProfilePage() {
  const toast = useAppStore((s) => s.toast);
  const apps = useAppStore((s) => s.apps);
  const labs = useAppStore((s) => s.labs);
  const user = useAuthStore((s) => s.user);
  const [tab, setTab] = useState("general");
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", bio: "Self-hosting enthusiast.", website: "" });
  const [pass, setPass] = useState({ current: "", next: "", confirm: "" });
  const upd = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const apiKeys = [
    { id: 1, name: "CI/CD Pipeline",   key: "dk_live_•••abc123", created: "Jan 10, 2025", last: "2m ago" },
    { id: 2, name: "Monitoring Script", key: "dk_live_•••xyz789", created: "Jan 20, 2025", last: "1h ago" },
  ];

  return (
    <div className="animate-fadeUp max-w-3xl space-y-5">
      {/* Profile header */}
      <Card className="p-6">
        <div className="flex items-center gap-5 flex-wrap">
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--cyan)] to-[var(--violet)] flex items-center justify-center text-2xl font-black text-black shadow-lg">
              {user?.avatar || "?"}
            </div>
            <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg flex items-center justify-center text-xs border transition-all hover:scale-110"
              style={{ background: "var(--panel)", borderColor: "var(--border)" }}>✏</button>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>{user?.name ?? "Guest"}</h2>
            <div className="text-sm" style={{ color: "var(--text2)" }}>{user?.email ?? ""}</div>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border" style={{ color: "var(--cyan)", borderColor: "var(--cyan)/25", background: "var(--cyan-dim)" }}>{user?.plan ?? "Free"} Plan</span>
              <span className="text-[10px] font-mono" style={{ color: "var(--text3)" }}>Member since Jan 2025</span>
            </div>
          </div>
          <div className="flex gap-6">
            {[[apps.length, "Apps"], [labs.length, "Labs"]].map(([v, l]) => (
              <div key={l} className="text-center">
                <div className="text-2xl font-bold" style={{ color: "var(--text)" }}>{v}</div>
                <div className="text-xs" style={{ color: "var(--text2)" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Tab nav */}
      <div className="flex gap-1 p-1 rounded-xl border overflow-x-auto" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
        {TABS.map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className="flex-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap"
            style={{ background: tab === id ? "var(--card)" : "transparent", color: tab === id ? "var(--text)" : "var(--text2)", boxShadow: tab === id ? "0 1px 4px var(--shadow)" : "none" }}>
            {label}
          </button>
        ))}
      </div>

      {/* General */}
      {tab === "general" && (
        <Card className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput label="Full Name" value={form.name} onChange={upd("name")} />
            <FormInput label="Email" type="email" value={form.email} onChange={upd("email")} />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--text3)" }}>Bio</label>
            <textarea value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} rows={3}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl outline-none resize-none border"
              style={{ background: "var(--input-bg)", borderColor: "var(--border2)", color: "var(--text)" }}
              onFocus={(e) => { e.target.style.borderColor = "var(--cyan)"; }}
              onBlur={(e) => { e.target.style.borderColor = "var(--border2)"; }} />
          </div>
          <FormInput label="Website" value={form.website} onChange={upd("website")} placeholder="https://mysite.dev" />
          <div className="flex gap-3 pt-1">
            <Btn variant="primary" onClick={() => toast("Saved", "Profile updated.")}>Save Changes</Btn>
          </div>
        </Card>
      )}

      {/* Security */}
      {tab === "security" && (
        <div className="space-y-4">
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-sm" style={{ color: "var(--text)" }}>Change Password</h3>
            <FormInput label="Current Password" type="password" value={pass.current} onChange={(e) => setPass((p) => ({ ...p, current: e.target.value }))} placeholder="••••••••" />
            <FormInput label="New Password" type="password" value={pass.next} onChange={(e) => setPass((p) => ({ ...p, next: e.target.value }))} placeholder="Min 8 characters" />
            <FormInput label="Confirm Password" type="password" value={pass.confirm} onChange={(e) => setPass((p) => ({ ...p, confirm: e.target.value }))} placeholder="Repeat" />
            <Btn variant="primary" size="sm" onClick={() => {
              if (pass.next !== pass.confirm) { toast("Mismatch", "Passwords don't match.", "error"); return; }
              if (pass.next.length < 8) { toast("Too short", "Min 8 characters.", "error"); return; }
              toast("Updated", "Password changed successfully.");
              setPass({ current: "", next: "", confirm: "" });
            }}>Update Password</Btn>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-sm mb-1" style={{ color: "var(--text)" }}>Two-Factor Auth</h3>
            <p className="text-sm mb-4" style={{ color: "var(--text2)" }}>Add an extra layer of account security with TOTP</p>
            <Btn variant="success" size="sm">Enable 2FA</Btn>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-sm mb-4" style={{ color: "var(--text)" }}>Active Sessions</h3>
            {[["Chrome · macOS", "Salem, Tamil Nadu", "Current", true], ["Firefox · Linux", "Chennai", "2d ago", false]].map(([b, l, t, cur]) => (
              <div key={b} className="flex items-center gap-3 py-3 border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center border text-sm" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>💻</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium" style={{ color: "var(--text)" }}>{b}</div>
                  <div className="text-[11px]" style={{ color: "var(--text2)" }}>{l} · {t}</div>
                </div>
                {cur
                  ? <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border" style={{ color: "var(--emerald)", borderColor: "var(--emerald)/25", background: "var(--emerald-dim)" }}>Current</span>
                  : <Btn variant="danger" size="xs" onClick={() => toast("Revoked", "Session ended.", "warn")}>Revoke</Btn>
                }
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* API Keys */}
      {tab === "api" && (
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--border)", background: "var(--panel)" }}>
            <h3 className="text-sm font-bold" style={{ color: "var(--text)" }}>API Keys</h3>
            <Btn variant="primary" size="sm" onClick={() => toast("Key created!", "Copy it now — it won't show again.")}>+ Generate Key</Btn>
          </div>
          {apiKeys.map((k) => (
            <div key={k.id} className="px-5 py-4 border-b last:border-0 space-y-2" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>{k.name}</div>
                  <div className="text-[10px] font-mono mt-0.5" style={{ color: "var(--text3)" }}>Created {k.created} · Last used {k.last}</div>
                </div>
                <div className="flex gap-1.5">
                  <Btn variant="ghost" size="xs" onClick={() => toast("Copied", "API key copied.")}>📋</Btn>
                  <Btn variant="danger" size="xs" onClick={() => toast("Revoked", k.name + " key revoked.", "warn")}>Revoke</Btn>
                </div>
              </div>
              <div className="font-mono text-xs px-2.5 py-1.5 rounded-lg border" style={{ color: "var(--cyan)", borderColor: "var(--cyan)/20", background: "var(--cyan-dim)" }}>{k.key}</div>
            </div>
          ))}
        </Card>
      )}

      {/* Billing */}
      {tab === "billing" && (
        <div className="space-y-4">
          <Card className="p-6" style={{ background: "linear-gradient(135deg, var(--panel), var(--panel2))", borderColor: "var(--border2)" }}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="text-[10px] font-mono mb-1" style={{ color: "var(--cyan)" }}>CURRENT PLAN</div>
                <div className="text-2xl font-bold" style={{ color: "var(--text)" }}>{user?.plan ?? "Free"} Plan</div>
                <div className="text-sm mt-1" style={{ color: "var(--text2)" }}>Free tier — self-hosted</div>
              </div>
              <Btn variant="primary">Upgrade Plan →</Btn>
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="font-bold text-sm mb-4" style={{ color: "var(--text)" }}>Usage This Month</h3>
            {[["Apps", apps.length, 10], ["Labs", labs.length, 5], ["Storage", 3.5, 10]].map(([n, u, m]) => (
              <div key={n} className="mb-4 last:mb-0">
                <div className="flex justify-between text-sm mb-1.5">
                  <span style={{ color: "var(--text2)" }}>{n}</span>
                  <span className="font-mono" style={{ color: "var(--text)" }}>{u} / {m}</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--panel2)" }}>
                  <div className="h-full rounded-full" style={{ width: (u / m) * 100 + "%", background: "linear-gradient(90deg, var(--cyan), var(--violet))" }} />
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* Danger zone */}
      {tab === "danger" && (
        <Card className="p-6" style={{ borderColor: "rgba(248,113,113,.3)" }}>
          <h3 className="font-bold text-sm mb-1" style={{ color: "var(--rose)" }}>⚠ Danger Zone</h3>
          <p className="text-sm mb-5" style={{ color: "var(--text2)" }}>These actions are irreversible. Proceed with caution.</p>
          {[
            ["Export All Data", "Download all your configs, credentials and metadata as a ZIP", "ghost", "Export"],
            ["Delete All Containers", "Permanently remove all running apps and lab containers", "danger", "Delete All"],
            ["Delete Account", "Remove your account and all data from the platform", "danger", "Delete Account"],
          ].map(([t, d, v, b]) => (
            <div key={t} className="flex items-center justify-between gap-4 py-4 border-b last:border-0 flex-wrap" style={{ borderColor: "var(--border)" }}>
              <div>
                <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>{t}</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--text2)" }}>{d}</div>
              </div>
              <Btn variant={v} size="sm" onClick={() => toast("Confirm required", "Check email to confirm.", "warn")}>{b}</Btn>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
