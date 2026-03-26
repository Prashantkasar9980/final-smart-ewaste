// src/context/AuthContext.jsx
import React, { createContext, useState } from "react";
import {
    loginApi,
    saveAuthToStorage,
    getAuthFromStorage,
    clearAuthFromStorage,
} from "../api";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [auth, setAuth] = useState(getAuthFromStorage());

    const login = async (username, password) => {
        try {
            const data = await loginApi(username, password);

            console.log("[DEBUG] login response:", data);

            if (!data || data.success !== true) {
                throw new Error(data?.message || "Login failed");
            }

            // 🔥 USE BACKEND VALUE DIRECTLY
            const mustReset = Boolean(data.mustResetPassword);

            // Save to storage (optional string conversion is fine)
            saveAuthToStorage({
                token: data.token,
                role: data.role,
                mustResetPassword: mustReset,
                loginId: username,
                userId: data.userId,
                fullName: data.fullName,
                email: data.email,
                phone: data.phone,
                city: data.city,
                address: data.address,
            });

            setAuth(getAuthFromStorage());

            // ✅ REDIRECT BASED ON BACKEND RESPONSE
            if (mustReset) {
                sessionStorage.setItem("resetUsername", username);
                navigate("/reset-password");
                return;
            }

            // ⭐ ALWAYS GO TO HOME PAGE AFTER LOGIN AS REQUESTED
            // Staff go to their dashboard
            if (data.role === "ROLE_STAFF") {
                navigate("/staff", { replace: true });
                return;
            }

            // Users can then click "User Dashboard" or "Admin Dashboard" in Navbar
            navigate("/", { replace: true });

        } catch (error) {
            console.error("[LOGIN ERROR]", error);
            throw error;
        }
    };

    const logout = () => {
        clearAuthFromStorage();
        setAuth(null);
        navigate("/login");
    };

    const refreshAuth = () => {
        setAuth(getAuthFromStorage());
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout, refreshAuth }}>
            {children}
        </AuthContext.Provider>
    );
};
