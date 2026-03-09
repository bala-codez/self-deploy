import {useState} from "react";
import { Link } from "react-router-dom";
import AuthBg from "../components/ui/AuthBg";
import ThemeToggle from "../components/ui/ThemeToggle";
import Card from "../components/ui/Card";
import Btn from "../components/ui/Btn";
import FormInput from "../components/ui/FormInput.jsx";

export default function LoginPage() {

    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    return (
        <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden" style={{ background: "var(--bg)" }}>
            <AuthBg />
            <div className="absolute top-4 right-4 z-20"><ThemeToggle /></div>

            <div className="w-full max-w-sm relative z-10 animate-fadeUp">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center gap-3 mb-4">
                        <span className="text-2xl font-bold" style={{ color: "var(--text)" }}>Self<span style={{ color: "var(--cyan)" }}> Deploy</span></span>
                    </div>
                    <h1 className="text-xl font-bold mb-3" style={{ color: "var(--text)" }}>Welcome back</h1>
                    <p className="text-sm" style={{ color: "var(--text2)" }}>Sign in to your self-hosted platform</p>
                </div>

                <Card className="p-7">
                    {/* Social sign-in */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <Btn  variant="ghost" className="w-full py-2.5 text-xs"
                              onClick={()=>{}}>
                            Google
                        </Btn>
                        <Btn  variant="ghost" className="w-full py-2.5 text-xs"
                              onClick={() =>{}}>
                            Github
                        </Btn>
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                        <span className="text-xs" style={{ color: "var(--text3)" }}>or continue with email</span>
                        <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                    </div>

                    <div className="space-y-4">
                        <FormInput label="Email" type="email" value={email} placeholder="you@example.com" onChange={(e) => { setEmail(e.target.value); setError(""); }}/>

                        <div className="space-y-1.5">
                            <label className="block text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--text3)" }}>Password</label>
                            <div className="relative">
                                <input type="password" value={pass}
                                       onChange={(e) => { setPass(e.target.value); setError(""); }}
                                       placeholder="••••••••"
                                       className="w-full px-3.5 py-2.5 pr-10 text-sm rounded-xl outline-none border transition-all"
                                       style={{ background: "var(--input-bg)", borderColor: error ? "var(--rose)" : "var(--border2)", color: "var(--text)" }}
                                       onFocus={(e) => e.target.style.borderColor = "var(--cyan)"}
                                       onBlur={(e) => e.target.style.borderColor = error ? "var(--rose)" : "var(--border2)"}
                                />
                            </div>
                        </div>

                        {error && <p className="text-xs px-3 py-2 rounded-xl border" style={{ color: "var(--rose)", background: "rgba(248,113,113,.08)", borderColor: "rgba(248,113,113,.2)" }}>{error}</p>}

                        <div className="flex items-center justify-between text-xs">
                            <label className="flex items-center gap-1.5 cursor-pointer" style={{ color: "var(--text2)" }}>
                                <input type="checkbox" className="rounded" defaultChecked style={{ accentColor: "var(--cyan)" }} /> Remember me
                            </label>
                            <button className="hover:underline font-medium" style={{ color: "var(--cyan)" }}>Forgot password?</button>
                        </div>

                        <Btn variant="primary" className="w-full py-2.5" loading={loading}>
                            Sign In →
                        </Btn>
                    </div>
                </Card>

                <p className="text-center text-sm mt-5" style={{ color: "var(--text2)" }}>
                    Don't have an account?{" "}
                    <Link to="/register" className="font-semibold hover:underline" style={{ color: "var(--cyan)" }}>Create account</Link>
                </p>
            </div>
        </div>
    );
}
