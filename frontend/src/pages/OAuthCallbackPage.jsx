import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuthStore from "../store/authStore.js";
import useToastStore from "../store/toastStore.js";
import Spinner from "../components/ui/Spinner.jsx";

export default function OAuthCallbackPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setTokensFromOAuth } = useAuthStore();
    const addToast = useToastStore((s) => s.addToast);
    const handled = useRef(false);

    useEffect(() => {
        if (handled.current) return;
        handled.current = true;

        const accessToken = searchParams.get("access_token");
        const refreshToken = searchParams.get("refresh_token");
        const error = searchParams.get("error");

        if (error) {
            addToast({ type: "error", title: "Google Sign-In Failed", msg: decodeURIComponent(error) });
            navigate("/login", { replace: true });
            return;
        }

        if (!accessToken) {
            addToast({ type: "error", title: "Authentication Error", msg: "No token received from Google." });
            navigate("/login", { replace: true });
            return;
        }

        setTokensFromOAuth(accessToken, refreshToken);
        addToast({ type: "success", title: "Signed in with Google!", msg: "Welcome to SelfDeploy." });
        navigate("/", { replace: true });
    }, []);

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center gap-4"
            style={{ background: "var(--bg)", color: "var(--text)" }}
        >
            <Spinner size={32} />
            <p className="text-sm" style={{ color: "var(--text2)" }}>Completing sign-in…</p>
        </div>
    );
}
