// src/App.jsx
import React, { useContext } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import Layout from "./components/layout/Layout";
import UserLayout from "./components/layout/UserLayout";
import AdminLayout from "./components/layout/AdminLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import UserDashboard from "./pages/UserDashboard";
import TrackEwaste from "./pages/TrackEwaste";
import MyRequestsPage from "./pages/MyRequestsPage";
import GuidelinesPage from "./pages/GuidelinesPage";
import EwasteForm from "./pages/EwasteForm";

import UserProfile from "./pages/UserProfile";
import EditProfile from "./pages/EditProfile";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPersonnel from "./pages/admin/AdminPersonnel";
import AdminRequests from "./pages/admin/AdminRequests";
import StaffPortalDashboard from "./pages/staff/StaffPortalDashboard";

import { AuthProvider, AuthContext } from "./context/AuthContext";

function AppRoutes() {
    const { auth } = useContext(AuthContext);
    const mustReset = auth?.mustResetPassword === true;
    const isStaff = auth?.role === "ROLE_STAFF";

    return (
        <Routes>

            {/* ================= PUBLIC ROUTES ================= */}
            <Route
                path="/"
                element={
                    <Layout>
                        <Home />
                    </Layout>
                }
            />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route
                path="/reset-password"
                element={<ResetPassword />}
            />

            {/* ================= STAFF PORTAL ================= */}
            <Route
                path="/staff"
                element={
                    isStaff 
                        ? <StaffPortalDashboard /> 
                        : <Navigate to="/login" replace />
                }
            />

            {/* ================= USER ROUTES (all under one layout + sidebar) ================= */}
            <Route
                path="/user"
                element={
                    mustReset
                        ? <Navigate to="/reset-password" replace />
                        : <UserLayout />
                }
            >
                <Route index element={<UserDashboard />} />
                <Route path="submit" element={<EwasteForm />} />
                <Route path="requests" element={<MyRequestsPage />} />
                <Route path="track" element={<TrackEwaste />} />
                <Route path="guidelines" element={<GuidelinesPage />} />
                <Route path="profile" element={<UserProfile />} />
                <Route path="edit-profile" element={<EditProfile />} />
            </Route>

            {/* Redirect old URLs to new user paths */}
            <Route path="/my-requests" element={<Navigate to="/user/requests" replace />} />
            <Route path="/guidelines" element={<Navigate to="/user/guidelines" replace />} />
            <Route path="/ewaste/submit" element={<Navigate to="/user/submit" replace />} />
            <Route path="/ewaste/track" element={<Navigate to="/user/track" replace />} />

            {/* ================= ADMIN ROUTES ================= */}
            <Route
                path="/admin"
                element={
                    mustReset
                        ? <Navigate to="/reset-password" replace />
                        : <AdminLayout />
                }
            >
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="requests" element={<AdminRequests />} />
                <Route path="personnel" element={<AdminPersonnel />} />
                
                {/* REDIRECT OLD ADMIN PATHS */}
                <Route path="pending" element={<Navigate to="/admin/users" replace />} />
                <Route path="verified" element={<Navigate to="/admin/users" replace />} />
                <Route path="profile" element={<Navigate to="/admin/dashboard" replace />} />
            </Route>

            {/* OLD LINK REDIRECT */}
            <Route path="/ewasteform" element={<Navigate to="/user/submit" replace />} />

            {/* FALLBACK */}
            <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Router>
    );
}

export default App;