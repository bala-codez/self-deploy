import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore.js";

export default function HomePage() {
    const { user, logout } = useAuthStore();
    const [apiStatus, setApiStatus] = useState("checking…");

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/`)
            .then((r) => r.json())
            .then((d) => setApiStatus(d.status ?? "ok"))
            .catch(() => setApiStatus("unreachable"));
    }, []);

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center gap-6 p-8"
            style={{ background: "var(--bg)", color: "var(--text)" }}
        >
            <h1 className="text-3xl font-bold">
                Self <span style={{ color: "var(--cyan)" }}>Deploy</span>
            </h1>

            {user && (
                <p className="text-sm" style={{ color: "var(--text2)" }}>
                    Welcome, <strong style={{ color: "var(--text)" }}>{user.name}</strong> — {user.email}
                </p>
            )}

            <p className="text-xs" style={{ color: "var(--text3)" }}>
                API status: <span style={{ color: "var(--emerald)" }}>{apiStatus}</span>
            </p>

            <button
                onClick={logout}
                className="px-4 py-2 text-sm rounded-xl border transition-all hover:opacity-80"
                style={{ borderColor: "var(--border2)", color: "var(--text2)" }}
            >
                Sign out
            </button>
        </div>
    );
}
