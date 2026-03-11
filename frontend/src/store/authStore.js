import { create } from "zustand";
import api from "../api/axios.js";
import useToastStore from "./toastStore.js";

const toast = () => useToastStore.getState();

const useAuthStore = create((set, get) => ({
    user: null,
    accessToken: localStorage.getItem("access_token") || null,
    isAuthenticated: !!localStorage.getItem("access_token"),

    // ── Register ────────────────────────────────────────────────────────────
    register: async (name, email, password) => {
        const response = await api.post("/auth/register", { name, email, password });
        toast().addToast({
            type: "success",
            title: "Almost there!",
            msg: response.data.message || "Check your email for the OTP.",
        });
        return { email, success: true };
    },

    // ── Login ────────────────────────────────────────────────────────────────
    login: async (email, password) => {
        const response = await api.post("/auth/login", { email, password });
        const { access_token, refresh_token, user } = response.data.data;

        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);

        set({ accessToken: access_token, user, isAuthenticated: true });

        toast().addToast({
            type: "success",
            title: "Welcome back!",
            msg: `Signed in as ${user.name}`,
        });

        return { success: true };
    },

    // ── Verify OTP ───────────────────────────────────────────────────────────
    verifyOtp: async (email, otp) => {
        const response = await api.post("/auth/email/verify-otp", { email, otp });
        const { access_token, refresh_token, user } = response.data.data;

        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);

        set({ accessToken: access_token, user, isAuthenticated: true });

        toast().addToast({
            type: "success",
            title: "Email verified!",
            msg: "Your account is now active.",
        });

        return { success: true };
    },

    // ── Resend OTP ───────────────────────────────────────────────────────────
    resendOtp: async (email) => {
        const response = await api.post("/auth/email/resend-otp", { email });
        toast().addToast({
            type: "info",
            title: "OTP Sent",
            msg: response.data.message || "A new OTP has been sent to your email.",
        });
        return { success: true };
    },

    // ── Google OAuth ─────────────────────────────────────────────────────────
    googleLogin: () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/oauth/google`;
    },

    // Called from OAuthCallbackPage after redirect
    setTokensFromOAuth: (accessToken, refreshToken) => {
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", refreshToken);
        // Decode basic info from token or fetch /me (simplified: set minimal state)
        set({ accessToken, isAuthenticated: true });
    },

    // ── Logout ───────────────────────────────────────────────────────────────
    logout: () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        set({ accessToken: null, user: null, isAuthenticated: false });
        toast().addToast({ type: "info", title: "Signed out", msg: "See you soon!" });
    },
}));

export default useAuthStore;
