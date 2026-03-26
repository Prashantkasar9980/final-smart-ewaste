import React, { useState, useEffect } from "react";
import { getAuthFromStorage, saveAuthToStorage } from "../api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiPhone, FiMapPin, FiMap, FiArrowLeft, FiSave, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

const inputClass = "w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 pl-12 pr-4 py-4 text-slate-800 font-bold placeholder-slate-400 transition-all duration-300 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10";
const labelClass = "text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 block";

const EditProfile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [message, setMessage] = useState({ type: "", text: "" });
    const auth = getAuthFromStorage();

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        city: "",
        address: "",
    });

    useEffect(() => {
        if (!auth || !auth.token) {
            setFetching(false);
            return;
        }

        // Use data from storage to avoid GET /api/user/profile issues
        setForm({
            fullName: auth.fullName || "",
            email: auth.email || "",
            phone: auth.phone || "",
            city: auth.city || "",
            address: auth.address || "",
        });
        setFetching(false);
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const token = auth.token;

            const formData = new FormData();
            formData.append("data", new Blob([JSON.stringify(form)], { type: "application/json" }));

            const res = await fetch("http://localhost:8080/api/user/profile", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!res.ok) throw new Error("Update failed");

            setMessage({ type: "success", text: "Profile updated successfully!" });
            
            saveAuthToStorage({
                ...auth,
                fullName: form.fullName,
                email: form.email,
            });

            setTimeout(() => navigate("/user/profile"), 1500);

        } catch (err) {
            console.error(err);
            setMessage({ type: "error", text: "Error updating profile. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="h-12 w-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto pb-10"
        >
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate("/user/profile")}
                    className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-500 hover:text-emerald-600 hover:border-emerald-100 hover:bg-emerald-50 transition-all shadow-sm group"
                >
                    <FiArrowLeft className="group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-slate-800">Edit Profile</h1>
                    <p className="text-sm text-slate-500 font-medium">Update your account information.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Full Name */}
                        <div className="relative">
                            <label className={labelClass}>Full Name</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <FiUser size={20} />
                                </div>
                                <input
                                    name="fullName"
                                    value={form.fullName}
                                    onChange={handleChange}
                                    className={inputClass}
                                    placeholder="Enter full name"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="relative">
                            <label className={labelClass}>Email Address</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <FiMail size={20} />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className={inputClass}
                                    placeholder="Enter email"
                                    required
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="relative">
                            <label className={labelClass}>Phone Number</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <FiPhone size={20} />
                                </div>
                                <input
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    className={inputClass}
                                    placeholder="Enter phone number"
                                />
                            </div>
                        </div>

                        {/* City */}
                        <div className="relative">
                            <label className={labelClass}>City</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <FiMapPin size={20} />
                                </div>
                                <input
                                    name="city"
                                    value={form.city}
                                    onChange={handleChange}
                                    className={inputClass}
                                    placeholder="Enter city"
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div className="md:col-span-2 relative">
                            <label className={labelClass}>Full Address</label>
                            <div className="relative">
                                <div className="absolute left-4 top-4 text-slate-400">
                                    <FiMap size={20} />
                                </div>
                                <textarea
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    rows={4}
                                    className={`${inputClass} pl-12 py-4 resize-none`}
                                    placeholder="Enter full street address"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 bg-emerald-600 text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-700 hover:-translate-y-1 transition-all shadow-lg shadow-emerald-200 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <FiSave size={18} />
                            )}
                            Save Changes
                        </button>
                        
                        {message.text && (
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`flex items-center gap-2 text-sm font-bold ${message.type === 'success' ? 'text-emerald-600' : 'text-red-500'}`}
                            >
                                {message.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
                                {message.text}
                            </motion.div>
                        )}
                    </div>
                </div>
            </form>
        </motion.div>
    );
};

export default EditProfile;
