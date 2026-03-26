import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUploadCloud, FiCheck, FiCalendar, FiMapPin, FiCpu, FiZap, FiShield, FiBox } from "react-icons/fi";
import { submitEwasteRequestApi, getAuthFromStorage } from "../api";
import { motion } from "framer-motion";

const DEVICE_TYPES = ["Laptop", "Mobile", "Tablet", "TV", "Monitor", "Printer", "Other"];
const CONDITIONS = ["Working", "Damaged", "Dead"];

const inputClass =
    "w-full rounded-2xl border-2 border-slate-100 bg-slate-50/30 px-5 py-3.5 text-slate-800 font-bold placeholder-slate-400 transition-all duration-500 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 hover:border-slate-200 hover:bg-white/80 backdrop-blur-sm";

const EwasteForm = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        deviceType: "Laptop",
        brand: "",
        model: "",
        condition: "Working",
        quantity: 1,
        pickupAddress: "",
        remarks: "",
        pickupDateTime: "",
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        if (!file) {
            setPreview(null);
            return;
        }
        const url = URL.createObjectURL(file);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "quantity" ? Math.max(1, parseInt(value, 10) || 1) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });
        if (!form.brand?.trim() || !form.model?.trim() || !form.pickupAddress?.trim()) {
            setMessage({ type: "error", text: "Please fill Brand, Model and Pickup address." });
            return;
        }
        const rawDate = form.pickupDateTime;
        if (!rawDate) {
            setMessage({ type: "error", text: "Pickup date & time is required." });
            return;
        }
        const pickupDateTime = new Date(rawDate).toISOString().slice(0, 19);
        if (Number.isNaN(new Date(rawDate).getTime())) {
            setMessage({ type: "error", text: "Invalid pickup date/time." });
            return;
        }

        setLoading(true);
        try {
            const { token } = getAuthFromStorage();
            if (!token) throw new Error("You are not logged in.");
            const dto = {
                deviceType: form.deviceType,
                brand: form.brand.trim(),
                model: form.model.trim(),
                condition: form.condition,
                quantity: form.quantity,
                pickupAddress: form.pickupAddress.trim(),
                remarks: form.remarks?.trim() || null,
                pickupDateTime,
            };
            await submitEwasteRequestApi(token, dto, file);
            setMessage({ type: "success", text: "E-waste request submitted successfully." });
            setForm({
                deviceType: "Laptop",
                brand: "",
                model: "",
                condition: "Working",
                quantity: 1,
                pickupAddress: "",
                remarks: "",
                pickupDateTime: "",
            });
            setFile(null);
        } catch (err) {
            setMessage({ type: "error", text: err?.message || "Submission failed." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10 pb-10 relative"
        >
            {/* AI Tech Graphics - Background */}
            <div className="absolute top-0 right-0 -z-10 opacity-5 pointer-events-none overflow-hidden w-full h-full">
                <svg width="100%" height="100%" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                        </pattern>
                        <radialGradient id="grad" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
                            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    <circle cx="400" cy="400" r="300" fill="url(#grad)" className="animate-pulse" />
                </svg>
            </div>

            <div className="flex flex-col gap-2 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm shadow-emerald-100">
                        <FiCpu size={20} className="animate-spin-slow" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight">Schedule Pickup</h1>
                </div>
                <p className="text-sm text-slate-500 font-bold max-w-lg ml-12">
                    AI-powered logistics for a greener planet. Enter your device details below.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-6xl space-y-8 relative z-10">
                <div className="rounded-[3rem] border border-white/50 bg-white/70 backdrop-blur-xl p-8 sm:p-12 shadow-2xl shadow-slate-200/50 relative overflow-hidden group">
                    {/* Decorative high-tech elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] group-hover:bg-emerald-500/10 transition-colors duration-1000" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-[80px] group-hover:bg-blue-500/10 transition-colors duration-1000" />
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* LEFT: DEVICE INFO */}
                        <div className="space-y-10">
                            <div className="flex items-center gap-4 text-xs font-black text-slate-800 uppercase tracking-[0.25em]">
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-200">
                                    <FiBox size={18} />
                                </span>
                                01. Device Information
                            </div>

                            <div className="grid gap-8 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <div className="h-1 w-1 rounded-full bg-emerald-500" />
                                        Device Type
                                    </label>
                                    <select
                                        name="deviceType"
                                        value={form.deviceType}
                                        onChange={handleChange}
                                        className={inputClass}
                                    >
                                        {DEVICE_TYPES.map((d) => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <div className="h-1 w-1 rounded-full bg-blue-500" />
                                        Condition
                                    </label>
                                    <select
                                        name="condition"
                                        value={form.condition}
                                        onChange={handleChange}
                                        className={inputClass}
                                    >
                                        {CONDITIONS.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid gap-8 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <div className="h-1 w-1 rounded-full bg-emerald-500" />
                                        Brand
                                    </label>
                                    <input
                                        name="brand"
                                        placeholder="e.g. Samsung"
                                        value={form.brand}
                                        onChange={handleChange}
                                        className={inputClass}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <div className="h-1 w-1 rounded-full bg-blue-500" />
                                        Model
                                    </label>
                                    <input
                                        name="model"
                                        placeholder="e.g. Galaxy S10"
                                        value={form.model}
                                        onChange={handleChange}
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-8 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <div className="h-1 w-1 rounded-full bg-emerald-500" />
                                        Quantity
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        name="quantity"
                                        value={form.quantity}
                                        onChange={handleChange}
                                        className={inputClass}
                                    />
                                </div>

                                <div className="space-y-2 sm:col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <div className="h-1 w-1 rounded-full bg-blue-500" />
                                        Remarks (Optional)
                                    </label>
                                    <textarea
                                        name="remarks"
                                        rows={2}
                                        placeholder="Any extra information about the items..."
                                        value={form.remarks}
                                        onChange={handleChange}
                                        className={`${inputClass} resize-none`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: PICKUP DETAILS */}
                        <div className="space-y-10">
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-4 text-xs font-black text-slate-800 uppercase tracking-[0.25em]">
                                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                                        <FiZap size={18} />
                                    </span>
                                    02. Logistics
                                </div>
                                <div className="hidden sm:flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                                    <FiShield className="text-blue-500" />
                                    Secure & Fast
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <div className="h-1 w-1 rounded-full bg-emerald-500" />
                                    Preferred Date & Time
                                </label>
                                <div className="relative group/input">
                                    <FiCalendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-emerald-500 transition-colors" />
                                    <input
                                        type="datetime-local"
                                        name="pickupDateTime"
                                        value={form.pickupDateTime}
                                        onChange={handleChange}
                                        className={`${inputClass} pl-14`}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <div className="h-1 w-1 rounded-full bg-blue-500" />
                                    Pickup Location
                                </label>
                                <div className="relative group/input">
                                    <FiMapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-blue-500 transition-colors" />
                                    <input
                                        name="pickupAddress"
                                        placeholder="Enter full pickup location..."
                                        value={form.pickupAddress}
                                        onChange={handleChange}
                                        className={`${inputClass} pl-14`}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 pt-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <div className="h-1 w-1 rounded-full bg-emerald-500" />
                                    AI Vision Preview
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                                    <label className="group/upload flex flex-col items-center justify-center gap-4 rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50/20 px-4 py-10 text-center transition-all duration-500 hover:bg-emerald-50/50 hover:border-emerald-300 cursor-pointer backdrop-blur-sm overflow-hidden relative">
                                        <div className="absolute inset-0 bg-emerald-500/0 group-hover/upload:bg-emerald-500/5 transition-colors duration-500" />
                                        <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center text-slate-400 group-hover/upload:text-emerald-600 shadow-xl transition-all duration-500 group-hover/upload:scale-110 group-hover/upload:-rotate-3 relative z-10">
                                            <FiUploadCloud size={28} />
                                        </div>
                                        <div className="relative z-10">
                                            <p className="text-xs font-black text-slate-700 uppercase tracking-wider group-hover/upload:text-emerald-700 transition-colors">{file ? "Update Image" : "Upload Image"}</p>
                                            <p className="text-[9px] text-slate-400 font-black mt-1 uppercase tracking-widest">Vision Module</p>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        />
                                    </label>
                                    <div className="rounded-[2rem] border-2 border-slate-100 bg-white/50 p-4 shadow-xl backdrop-blur-sm group/preview relative overflow-hidden h-[160px] flex items-center justify-center">
                                        {preview ? (
                                            <motion.img
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                src={preview}
                                                alt="Preview"
                                                className="h-full w-full rounded-2xl object-cover shadow-lg group-hover/preview:scale-105 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 opacity-30 grayscale group-hover/preview:grayscale-0 group-hover/preview:opacity-50 transition-all duration-500">
                                                <FiCpu size={40} className="text-slate-400" />
                                                <span className="text-[8px] font-black uppercase tracking-[0.3em]">Waiting for data</span>
                                            </div>
                                        )}
                                        {/* Scanning line animation */}
                                        {preview && <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-scan z-20 pointer-events-none" />}
                                    </div>
                                </div>
                            </div>

                            {/* SUBMIT BUTTON */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-6">
                                <div className="flex gap-6">
                                    <button
                                        type="button"
                                        onClick={() => navigate("/user/requests")}
                                        className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-emerald-600 transition-all hover:tracking-[0.25em]"
                                    >
                                        Requests
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => navigate("/user/track")}
                                        className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-all hover:tracking-[0.25em]"
                                    >
                                        Track
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full sm:w-auto min-w-[280px] rounded-[1.5rem] bg-slate-900 px-10 py-5 text-[11px] font-black uppercase tracking-[0.3em] text-white shadow-2xl shadow-slate-400/20 transition-all duration-500 hover:bg-emerald-600 hover:shadow-emerald-200 hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:pointer-events-none group/btn overflow-hidden relative"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                        {loading ? (
                                            <>
                                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Initializing...
                                            </>
                                        ) : (
                                            <>
                                                Initialize Pickup
                                                <FiZap className="animate-pulse" />
                                            </>
                                        )}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {message.text && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mt-10 rounded-[2rem] border-2 p-6 text-sm font-black uppercase tracking-widest flex items-center justify-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500 ${
                            message.type === "success" 
                            ? "bg-emerald-50 border-emerald-100 text-emerald-700 shadow-xl shadow-emerald-100/50" 
                            : "bg-rose-50 border-rose-100 text-rose-700 shadow-xl shadow-rose-100/50"
                        }`}
                    >
                        {message.type === "success" ? <FiCheck size={20} /> : <div className="h-2 w-2 rounded-full bg-rose-500" />}
                        {message.text}
                    </motion.div>
                )}
            </form>

        </motion.div>
    );
};

export default EwasteForm;
