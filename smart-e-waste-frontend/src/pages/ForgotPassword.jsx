import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPasswordApi } from "../api";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import forgotImage from "../assets/change password.png"; // Using the new specialized image

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        if (!email) {
            setMessage({ type: "error", text: "Please enter your email address." });
            return;
        }

        setLoading(true);
        try {
            await forgotPasswordApi(email);
            setMessage({ 
                type: "success", 
                text: "Reset link sent! Please check your email inbox (and spam folder)." 
            });
        } catch (err) {
            setMessage({ 
                type: "error", 
                text: err.message || "Failed to send reset link. Please try again." 
            });
        } finally {
            setLoading(false);
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
        >
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="flex">
                    
                    {/* IMAGE SECTION */}
                    <div className="hidden md:flex w-1/2 bg-emerald-50 flex-col items-center justify-center p-10 text-center">
                        <h2 className="text-3xl font-bold text-slate-900 mb-3">Forgot Password?</h2>
                        <p className="text-slate-600 mb-6 max-w-sm">
                            Don't worry! Enter your email and we'll send you a secure link to reset it.
                        </p>
                        <img
                            src={forgotImage}
                            alt="Secure password recovery"
                            className="w-80 rounded-2xl shadow-xl object-cover"
                        />
                        <p className="mt-6 text-emerald-700 font-semibold tracking-wide">E-WASTE SOLUTIONS</p>
                        <p className="text-sm text-slate-500">RECYCLE · SECURE · SUSTAIN</p>
                    </div>

                    {/* FORM SECTION */}
                    <div className="w-full md:w-1/2 flex items-center justify-center p-10">
                        <div className="w-full max-w-sm">
                            <h2 className="text-3xl font-bold text-center mb-2">Secure Recovery</h2>
                            <p className="text-center text-slate-500 mb-6">
                                Enter your details to recover your account
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <Input
                                    label="Email Address"
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your registered email"
                                    required
                                />

                                {message.text && (
                                    <div className={`p-4 rounded-xl text-sm font-medium ${
                                        message.type === "success" 
                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                                        : "bg-red-50 text-red-600 border border-red-100"
                                    }`}>
                                        {message.text}
                                    </div>
                                )}

                                <Button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full py-3 text-base"
                                >
                                    {loading ? "Processing..." : "Send Reset Link →"}
                                </Button>
                            </form>

                            <p className="text-center text-sm mt-6">
                                Remembered your password?{" "}
                                <Link to="/login" className="text-emerald-600 font-semibold hover:underline">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;