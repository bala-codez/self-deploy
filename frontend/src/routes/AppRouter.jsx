import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import VerifyOtpPage from "../pages/VerifyOtpPage.jsx";
import OAuthCallbackPage from "../pages/OAuthCallbackPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Layout from "../components/layouts/Layout.jsx";
import DomainsPage from "../pages/DomainsPage.jsx";
import DashboardPage from "../pages/DashboradPage.jsx";
import AppsPage from "../pages/AppsPage.jsx";
import LabsPage from "../pages/LabsPage.jsx";
import MonitoringPage from "../pages/MonitoringPage.jsx";
import SettingsPage from "../pages/SettingsPage.jsx";
import ProfilePage from "../pages/ProfilePage.jsx";



export default function AppRouter() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>
            <Route path="/otp" element={<VerifyOtpPage/>}/>
            <Route path="/oauth/callback" element={<OAuthCallbackPage/>}/>
            <Route element={<ProtectedRoute/>}>
                <Route path="/home" element={<HomePage/>}/>
                <Route element={<Layout/>}>
                    <Route path="/" element={<DashboardPage/>}/>
                    <Route path="/apps" element={<AppsPage/>}/>
                    <Route path="/labs" element={<LabsPage/>}/>
                    <Route path="/domains" element={<DomainsPage/>}/>
                    <Route path="/monitoring" element={<MonitoringPage/>}/>
                    <Route path="/settings" element={<SettingsPage/>}/>
                    <Route path="/profile" element={<ProfilePage/>}/>
                </Route>
            </Route>
        </Routes>
    );
}
