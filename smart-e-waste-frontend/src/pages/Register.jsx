import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { registerUserApi } from "../api";
import registerImage from "../assets/register-illustration.png";

const Register = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        try {
            setLoading(true);
            await registerUserApi(form);

            setSuccess(true);
            setMessage(
                "Registration successful! Please wait for admin approval."
            );

            setTimeout(() => navigate("/"), 2500);

        } catch (err) {
            setError(err.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4"
            style={{
                background: `
      radial-gradient(circle at 10% 10%, rgba(16,185,129,0.10) 0%, transparent 55%),
      radial-gradient(circle at 90% 90%, rgba(16,185,129,0.12) 0%, transparent 55%),
      #ffffff
    `
            }}
        >

            <div className="w-full max-w-6xl bg-white rounded-3xl
                      shadow-[0_30px_80px_rgba(16,185,129,0.15)] overflow-hidden">

                <div className="grid grid-cols-1 md:grid-cols-2 min-h-[560px]">

                    {/* LEFT PANEL */}
                    <div
                        className="hidden md:flex flex-col justify-center items-center p-12 text-center"
                        style={{
                            background: `
      radial-gradient(circle at 0% 0%, rgba(16,185,129,0.18) 0%, transparent 55%),
      radial-gradient(circle at 100% 0%, rgba(16,185,129,0.18) 0%, transparent 55%),
      radial-gradient(circle at 0% 100%, rgba(16,185,129,0.18) 0%, transparent 55%),
      radial-gradient(circle at 100% 100%, rgba(16,185,129,0.18) 0%, transparent 55%),
      #ffffff
    `
                        }}
                    >

                        <h2 className="text-3xl font-bold text-slate-900 mb-3">
                            Welcome!
                        </h2>

                        <p className="text-slate-600 mb-6 max-w-sm">
                            Join Smart E-Waste Management and make a green impact 🌱
                        </p>

                        <img
                            src={registerImage}
                            alt="User registration for smart e‑waste"
                            className="w-80 rounded-2xl shadow-xl object-cover"
                        />
                    </div>

                    {/* RIGHT PANEL */}
                    <div className="flex items-center justify-center p-12 bg-white">
                        <div className="w-full max-w-sm">

                            <h1 className="text-3xl font-bold text-slate-900 mb-2">
                                Create Account
                            </h1>

                            <p className="text-sm text-slate-500 mb-6">
                                Register to start your e-waste journey
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-5">

                                <Input
                                    label="Full Name"
                                    name="fullName"
                                    value={form.fullName}
                                    onChange={(e) =>
                                        setForm({ ...form, fullName: e.target.value })
                                    }
                                    required
                                    disabled={success}
                                />

                                <Input
                                    label="Email"
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm({ ...form, email: e.target.value })
                                    }
                                    required
                                    disabled={success}
                                />

                                <Input
                                    label="Phone Number"
                                    name="phone"
                                    value={form.phone}
                                    onChange={(e) =>
                                        setForm({ ...form, phone: e.target.value })
                                    }
                                    required
                                    disabled={success}
                                />

                                {error && (
                                    <p className="text-red-600 text-sm">{error}</p>
                                )}

                                {message && (
                                    <p className="text-emerald-600 text-sm font-medium">
                                        {message}
                                    </p>
                                )}

                                {!success && (
                                    <Button
                                        size="lg"
                                        className="w-full"
                                        disabled={loading}
                                    >
                                        {loading ? "Registering..." : "Register →"}
                                    </Button>
                                )}

                            </form>

                            {!success && (
                                <p className="text-sm text-center mt-6">
                                    Already registered?{" "}
                                    <span
                                        onClick={() => navigate("/login")}
                                        className="text-emerald-600 font-semibold cursor-pointer hover:underline"
                                    >
                    Login
                  </span>
                                </p>
                            )}

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Register;