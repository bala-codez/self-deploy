import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import VerifyOtpPage from "../pages/VerifyOtpPage.jsx";
import OAuthCallbackPage from "../pages/OAuthCallbackPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/otp" element={<VerifyOtpPage />} />
            <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<HomePage />} />
            </Route>
        </Routes>
    );
}
