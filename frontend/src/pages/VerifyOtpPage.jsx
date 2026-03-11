import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthBg from "../components/ui/AuthBg";
import ThemeToggle from "../components/ui/ThemeToggle";
import Card from "../components/ui/Card";
import Btn from "../components/ui/Btn";
import useAuthStore from "../store/authStore.js";
import useToastStore from "../store/toastStore.js";

const RESEND_COOLDOWN = 60; // seconds

export default function VerifyOtpPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const emailFromState = location.state?.email || "";

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [email, setEmail] = useState(emailFromState);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [error, setError] = useState("");
    const [countdown, setCountdown] = useState(RESEND_COOLDOWN);

    const inputsRef = useRef([]);
    const { verifyOtp, resendOtp } = useAuthStore();
    const addToast = useToastStore((s) => s.addToast);

    // Countdown timer for resend button
    useEffect(() => {
        if (countdown <= 0) return;
        const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(id);
    }, [countdown]);

    // Auto-focus first box
    useEffect(() => { inputsRef.current[0]?.focus(); }, []);

    const otpString = otp.join("");

    function handleChange(idx, val) {
        if (!/^\d?$/.test(val)) return;
        const next = [...otp];
        next[idx] = val;
        setOtp(next);
        setError("");
        if (val && idx < 5) inputsRef.current[idx + 1]?.focus();
    }

    function handleKeyDown(idx, e) {
        if (e.key === "Backspace" && !otp[idx] && idx > 0) {
            inputsRef.current[idx - 1]?.focus();
        }
    }

    function handlePaste(e) {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (!pasted) return;
        const next = [...otp];
        pasted.split("").forEach((ch, i) => { next[i] = ch; });
        setOtp(next);
        inputsRef.current[Math.min(pasted.length, 5)]?.focus();
    }

    async function handleSubmit() {
        if (otpString.length !== 6) {
            setError("Enter a valid 6-digit OTP");
            return;
        }
        if (!email) {
            setError("Email address is required");
            return;
        }
        setLoading(true);
        try {
            await verifyOtp(email, otpString);
            navigate("/");
        } catch (err) {
            setError(err.message || "Invalid or expired OTP");
        } finally {
            setLoading(false);
        }
    }

    async function handleResend() {
        if (countdown > 0 || !email) return;
        setResendLoading(true);
        try {
            await resendOtp(email);
            setCountdown(RESEND_COOLDOWN);
            setOtp(["", "", "", "", "", ""]);
            inputsRef.current[0]?.focus();
        } catch (err) {
            addToast({ type: "error", title: "Failed", msg: err.message || "Could not resend OTP" });
        } finally {
            setResendLoading(false);
        }
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
                    <h1 className="text-xl font-bold mb-3" style={{ color: "var(--text)" }}>Verify your email</h1>
                    <p className="text-sm" style={{ color: "var(--text2)" }}>
                        Enter the 6-digit code sent to{" "}
                        {email
                            ? <strong style={{ color: "var(--text)" }}>{email}</strong>
                            : "your email"
                        }
                    </p>
                </div>

                <Card className="p-7">
                    <div className="space-y-5">
                        {/* Email field – shown only if not pre-filled */}
                        {!emailFromState && (
                            <div className="space-y-1.5">
                                <label className="block text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--text3)" }}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                                    placeholder="you@example.com"
                                    className="w-full px-3.5 py-2.5 text-sm rounded-xl outline-none transition-all"
                                    style={{ background: "var(--input-bg)", border: "1px solid var(--border2)", color: "var(--text)" }}
                                />
                            </div>
                        )}

                        {/* 6-box OTP input */}
                        <div>
                            <label className="block text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text3)" }}>
                                Verification Code
                            </label>
                            <div className="flex gap-2 justify-between" onPaste={handlePaste}>
                                {otp.map((digit, idx) => (
                                    <input
                                        key={idx}
                                        ref={(el) => (inputsRef.current[idx] = el)}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(idx, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(idx, e)}
                                        className="w-11 h-12 text-center text-lg font-bold rounded-xl outline-none transition-all"
                                        style={{
                                            background: "var(--input-bg)",
                                            border: `1px solid ${error ? "var(--rose)" : digit ? "var(--cyan)" : "var(--border2)"}`,
                                            color: "var(--text)",
                                            boxShadow: digit ? "0 0 0 3px var(--cyan-dim)" : "none",
                                        }}
                                    />
                                ))}
                            </div>
                            {error && (
                                <p className="text-[11px] mt-2" style={{ color: "var(--rose)" }}>{error}</p>
                            )}
                        </div>

                        <Btn variant="primary" className="w-full py-2.5" loading={loading} onClick={handleSubmit}>
                            Verify Email →
                        </Btn>

                        <p className="text-xs text-center" style={{ color: "var(--text2)" }}>
                            Didn't receive the code?{" "}
                            {countdown > 0 ? (
                                <span style={{ color: "var(--text3)" }}>Resend in {countdown}s</span>
                            ) : (
                                <button
                                    className="font-semibold hover:underline"
                                    style={{ color: resendLoading ? "var(--text3)" : "var(--cyan)" }}
                                    onClick={handleResend}
                                    disabled={resendLoading}
                                >
                                    {resendLoading ? "Sending…" : "Resend OTP"}
                                </button>
                            )}
                        </p>
                    </div>
                </Card>

                <p className="text-center text-sm mt-5" style={{ color: "var(--text2)" }}>
                    Back to{" "}
                    <Link to="/login" className="font-semibold hover:underline" style={{ color: "var(--cyan)" }}>
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
