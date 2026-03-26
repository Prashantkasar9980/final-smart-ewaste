import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { resetPasswordWithTempApi, resetPasswordWithTokenApi } from "../api";
import { AuthContext } from "../context/AuthContext";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import resetImage from "../assets/reset-ewaste-pro.jpg";

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { refreshAuth } = useContext(AuthContext);

    const [form, setForm] = useState({
        username: "",
        tempPassword: "",
        newPassword: "",
        token: "",
        email: "",
    });

    const [isTokenFlow, setIsTokenFlow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get("token");
        const email = queryParams.get("email");

        if (token && email) {
            setIsTokenFlow(true);
            setForm((f) => ({ ...f, token, email, username: email }));
        } else {
            const saved = sessionStorage.getItem("resetUsername");
            if (!saved) {
                navigate("/login");
                return;
            }
            setForm((f) => ({ ...f, username: saved }));
        }
    }, [navigate, location]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!form.newPassword || (!isTokenFlow && !form.tempPassword)) {
            setError("All fields are required.");
            return;
        }

        setLoading(true);
        try {
            if (isTokenFlow) {
                await resetPasswordWithTokenApi({
                    email: form.email,
                    token: form.token,
                    newPassword: form.newPassword,
                });
            } else {
                await resetPasswordWithTempApi({
                    username: form.username,
                    tempPassword: form.tempPassword,
                    newPassword: form.newPassword,
                });
            }

            setSuccess("Password updated! Redirecting to home...");
            sessionStorage.removeItem("resetUsername");
            localStorage.setItem("authMustReset", "false");
            
            // 🔥 REFRESH AUTH STATE TO ALLOW ACCESS TO DASHBOARD
            refreshAuth();

            // ⭐ REDIRECT TO HOME PAGE AS REQUESTED
            setTimeout(() => navigate("/"), 1500);
        } catch (err) {
            setError(err.message || "Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 pb-10"
            style={{
                background: `
      radial-gradient(circle at 10% 10%, rgba(16,185,129,0.15) 0%, transparent 55%),
      radial-gradient(circle at 90% 90%, rgba(16,185,129,0.15) 0%, transparent 55%),
      #ffffff
    `
            }}
        >

            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-2">

                {/* LEFT PANEL */}
                <div className="bg-emerald-50 p-10 flex flex-col items-center justify-center text-center">

                    <h2 className="text-3xl font-bold text-slate-900 mb-3">
                        Reset Password
                    </h2>

                    <p className="text-slate-600 mb-6 max-w-sm text-base">
                        {isTokenFlow 
                            ? "Create a new secure password for your account." 
                            : "Enter your temporary password and create a new secure one."}
                    </p>

                    <img
                        src={resetImage}
                        alt="Smart e‑waste factory reset flow"
                        className="w-80 rounded-2xl shadow-xl object-cover"
                    />

                    <p className="mt-6 text-emerald-700 font-semibold tracking-wide">
                        E-WASTE SOLUTIONS
                    </p>
                    <p className="text-sm text-slate-500 mb-4">
                        RECYCLE · SECURE · SUSTAIN
                    </p>
                </div>

                {/* RIGHT PANEL (FORM) */}
                <div className="flex items-center justify-center p-10">
                    <div className="w-full max-w-sm">
                        <h2 className="text-3xl font-bold text-center mb-2">Secure Your Account</h2>
                        <p className="text-center text-slate-500 mb-6">Set a strong password to protect your e-waste data.</p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <Input
                                label="Username or Email"
                                name="username"
                                value={form.username}
                                readOnly
                                disabled
                            />

                            {!isTokenFlow && (
                                <Input
                                    label="Temporary Password"
                                    type="password"
                                    name="tempPassword"
                                    value={form.tempPassword}
                                    onChange={handleChange}
                                    placeholder="Enter the password from your email"
                                    required
                                />
                            )}

                            <Input
                                label="New Password"
                                type="password"
                                name="newPassword"
                                value={form.newPassword}
                                onChange={handleChange}
                                placeholder="Min 8 characters recommended"
                                required
                            />

                            {error && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-sm font-medium">
                                    {success}
                                </div>
                            )}

                            <Button 
                                type="submit" 
                                disabled={loading}
                                className="w-full py-3 text-base"
                            >
                                {loading ? "Updating..." : "Update Password →"}
                            </Button>

                            <div className="text-center mt-6">
                                <button
                                    type="button"
                                    onClick={() => navigate("/login")}
                                    className="text-sm text-slate-500 hover:text-emerald-600 font-medium transition"
                                >
                                    Back to Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
