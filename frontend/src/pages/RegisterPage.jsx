import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthBg from "../components/ui/AuthBg";
import ThemeToggle from "../components/ui/ThemeToggle";
import Card from "../components/ui/Card";
import FormInput from "../components/ui/FormInput";
import Btn from "../components/ui/Btn";
import useAuthStore from "../store/authStore.js";

export default function RegisterPage() {
    const [form, setForm] = useState({ name: "", email: "", pass: "", confirm: "" });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const { register } = useAuthStore();
    const navigate = useNavigate();

    const upd = (k) => (e) => {
        setForm((f) => ({ ...f, [k]: e.target.value }));
        setErrors((er) => ({ ...er, [k]: "", general: "" }));
    };

    const validate = () => {
        const errs = {};
        if (!form.name.trim() || form.name.trim().length < 2) errs.name = "Name must be at least 2 characters";
        if (!form.email.includes("@")) errs.email = "Valid email required";
        if (form.pass.length < 8) errs.pass = "Min 8 characters";
        if (form.pass !== form.confirm) errs.confirm = "Passwords don't match";
        setErrors(errs);
        return !Object.keys(errs).length;
    };

    async function handleSubmit(e) {
        e?.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const result = await register(form.name.trim(), form.email, form.pass);
            navigate("/otp", { state: { email: result.email } });
        } catch (err) {
            setErrors({ general: err.message || "Registration failed. Please try again." });
        } finally {
            setLoading(false);
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
                    <h1 className="text-xl font-bold mb-3" style={{ color: "var(--text)" }}>Create account</h1>
                    <p className="text-sm" style={{ color: "var(--text2)" }}>Deploy your first app in minutes</p>
                </div>

                <Card className="p-7">
                    <div className="space-y-4">
                        <FormInput label="Full Name" value={form.name} onChange={upd("name")} placeholder="Your Name" error={errors.name} />
                        <FormInput label="Email" type="email" value={form.email} onChange={upd("email")} placeholder="you@example.com" error={errors.email} />
                        <FormInput label="Password" type="password" value={form.pass} onChange={upd("pass")} placeholder="Min 8 characters" error={errors.pass} />
                        <FormInput label="Confirm Password" type="password" value={form.confirm} onChange={upd("confirm")} placeholder="Repeat password" error={errors.confirm} />

                        {errors.general && (
                            <p className="text-xs px-3 py-2 rounded-xl border"
                               style={{ color: "var(--rose)", background: "rgba(248,113,113,.08)", borderColor: "rgba(248,113,113,.2)" }}>
                                {errors.general}
                            </p>
                        )}

                        <label className="flex items-start gap-2 text-xs cursor-pointer" style={{ color: "var(--text2)" }}>
                            <input type="checkbox" defaultChecked className="mt-0.5 rounded" style={{ accentColor: "var(--cyan)" }} />
                            I agree to the{" "}
                            <span className="font-semibold" style={{ color: "var(--cyan)" }}>Terms</span>
                            {" "}and{" "}
                            <span className="font-semibold" style={{ color: "var(--cyan)" }}>Privacy Policy</span>
                        </label>

                        <Btn variant="primary" className="w-full py-2.5" loading={loading} onClick={handleSubmit}>
                            Create Account →
                        </Btn>
                    </div>
                </Card>

                <p className="text-center text-sm mt-5" style={{ color: "var(--text2)" }}>
                    Already have an account?{" "}
                    <Link to="/login" className="font-semibold hover:underline" style={{ color: "var(--cyan)" }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
}
