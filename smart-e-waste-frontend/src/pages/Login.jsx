import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import loginImage from "../assets/e-waste-solutions.jpg";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [swap, setSwap] = useState(false);

    // Back Button Handling
    useEffect(() => {
        const handleBack = () => navigate("/");
        window.onpopstate = handleBack;
        return () => (window.onpopstate = null);
    }, [navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const data = await login(form.username, form.password);

            // Redirect is handled inside AuthContext.login based on mustResetPassword
        } catch (err) {
            setError(err.message || "Login failed");
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4"
            style={{
                background: `
      radial-gradient(circle at 10% 10%, rgba(16,185,129,0.15) 0%, transparent 55%),
      radial-gradient(circle at 90% 90%, rgba(16,185,129,0.15) 0%, transparent 55%),
      #ffffff
    `
            }}
        > <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className={`flex transition-all duration-500 ${swap ? "flex-row-reverse" : ""}`}>

                    {/* IMAGE SECTION */}
                    <div className="hidden md:flex w-1/2 bg-emerald-50 flex-col items-center justify-center p-10 text-center">
                        <h2 className="text-3xl font-bold text-slate-900 mb-3">Welcome Back!</h2>
                        <p className="text-slate-600 mb-6 max-w-sm">
                            Track your e-waste impact and earn rewards for a cleaner planet.
                        </p>
                        <img
                            src={loginImage}
                            alt="E‑waste solutions secure login"
                            className="w-80 rounded-2xl shadow-xl object-cover"
                        />
                        <p className="mt-6 text-emerald-700 font-semibold tracking-wide">E-WASTE SOLUTIONS</p>
                        <p className="text-sm text-slate-500">RECYCLE · SECURE · SUSTAIN</p>
                    </div>

                    {/* FORM SECTION */}
                    <div className="w-full md:w-1/2 flex items-center justify-center p-10">
                        <div className="w-full max-w-sm">
                            <h2 className="text-3xl font-bold text-center mb-2">Sign In</h2>
                            <p className="text-center text-slate-500 mb-6">
                                Enter your details to access your account
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <Input
                                    label="Username or Email"
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                    required
                                />

                                <Input
                                    label="Password"
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                />

                                {error && <p className="text-red-600 text-sm">{error}</p>}

                                <div className="text-right text-sm">
                                    <Link to="/forgot-password" className="text-emerald-600 hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>

                                <Button className="w-full py-3 text-base">Sign In →</Button>
                            </form>

                            <p className="text-center text-sm mt-6">
                                Don't have an account?{" "}
                                <Link to="/register" className="text-emerald-600 font-semibold hover:underline">
                                    Sign up
                                </Link>
                            </p>

                            <div className="text-center mt-6">
                                <button
                                    type="button"
                                    onClick={() => setSwap(!swap)}
                                    className="text-sm text-slate-500 hover:text-emerald-600 transition"
                                >
                                    Swap layout ⇄
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
