import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthBg from "../components/ui/AuthBg";
import ThemeToggle from "../components/ui/ThemeToggle";
import Card from "../components/ui/Card";
import Btn from "../components/ui/Btn";
import FormInput from "../components/ui/FormInput.jsx";
import useAuthStore from "../store/authStore.js";
import useToastStore from "../store/toastStore.js";

const GoogleIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
);

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const { login, googleLogin } = useAuthStore();
    const addToast = useToastStore((s) => s.addToast);
    const navigate = useNavigate();

    const validate = () => {
        const errs = {};
        if (!email.includes("@")) errs.email = "Valid email required";
        if (!password) errs.password = "Password is required";
        setErrors(errs);
        return !Object.keys(errs).length;
    };

    async function handleSubmit(e) {
        e?.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            await login(email, password);
            navigate("/");
        } catch (err) {
            const msg = err.message || "Invalid email or password";
            // If unverified, backend sends 403 – redirect to OTP page
            if (msg.toLowerCase().includes("not verified") || msg.toLowerCase().includes("otp")) {
                addToast({ type: "warn", title: "Verify Email", msg });
                navigate("/otp", { state: { email } });
            } else {
                setErrors({ general: msg });
            }
        } finally {
            setLoading(false);
        }
    }

    function handleGoogle() {
        setGoogleLoading(true);
        googleLogin(); // redirects to Google
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden" style={{ background: "var(--bg)" }}>
            <AuthBg />
            <div className="absolute top-4 right-4 z-20"><ThemeToggle /></div>

            <div className="w-full max-w-sm relative z-10 animate-fadeUp">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center gap-3 mb-4">
                        <span className="text-2xl font-bold" style={{ color: "var(--text)" }}>
                            Self<span style={{ color: "var(--cyan)" }}> Deploy</span>
                        </span>
                    </div>
                    <h1 className="text-xl font-bold mb-3" style={{ color: "var(--text)" }}>Welcome back</h1>
                    <p className="text-sm" style={{ color: "var(--text2)" }}>Sign in to your self-hosted platform</p>
                </div>

                <Card className="p-7">
                    {/* Google OAuth */}
                    <Btn
                        variant="ghost"
                        className="w-full py-2.5 text-sm mb-6 gap-2"
                        loading={googleLoading}
                        onClick={handleGoogle}
                    >
                        <GoogleIcon />
                        Continue with Google
                    </Btn>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                        <span className="text-xs" style={{ color: "var(--text3)" }}>or continue with email</span>
                        <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                    </div>

                    <div className="space-y-4">
                        <FormInput
                            label="Email"
                            type="email"
                            value={email}
                            placeholder="you@example.com"
                            error={errors.email}
                            onChange={(e) => { setEmail(e.target.value); setErrors({}); }}
                        />
                        <FormInput
                            label="Password"
                            type="password"
                            value={password}
                            placeholder="••••••••"
                            error={errors.password}
                            onChange={(e) => { setPassword(e.target.value); setErrors({}); }}
                        />

                        {errors.general && (
                            <p className="text-xs px-3 py-2 rounded-xl border"
                               style={{ color: "var(--rose)", background: "rgba(248,113,113,.08)", borderColor: "rgba(248,113,113,.2)" }}>
                                {errors.general}
                            </p>
                        )}

                        <div className="flex items-center justify-between text-xs">
                            <label className="flex items-center gap-1.5 cursor-pointer" style={{ color: "var(--text2)" }}>
                                <input type="checkbox" className="rounded" defaultChecked style={{ accentColor: "var(--cyan)" }} />
                                Remember me
                            </label>
                            <button className="hover:underline font-medium" style={{ color: "var(--cyan)" }}>
                                Forgot password?
                            </button>
                        </div>

                        <Btn variant="primary" className="w-full py-2.5" loading={loading} onClick={handleSubmit}>
                            Sign In →
                        </Btn>
                    </div>
                </Card>

                <p className="text-center text-sm mt-5" style={{ color: "var(--text2)" }}>
                    Don't have an account?{" "}
                    <Link to="/register" className="font-semibold hover:underline" style={{ color: "var(--cyan)" }}>
                        Create account
                    </Link>
                </p>
            </div>
        </div>
    );
}
