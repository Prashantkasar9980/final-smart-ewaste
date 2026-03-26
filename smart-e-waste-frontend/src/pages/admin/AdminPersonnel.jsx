// src/pages/admin/AdminPersonnel.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Trash2, PlusCircle, X, Check, Phone, Mail, Shield, Camera, Loader2 } from "lucide-react";
import { fetchAdminUsersApi, getAuthFromStorage, updateUserRoleApi } from "../../api";

const AdminPersonnel = () => {
    const [personnel, setPersonnel] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newPerson, setNewPerson] = useState({ name: "", role: "PICKER", phone: "", email: "" });
    const fileInputRef = useRef(null);
    const [editingAvatarId, setEditingAvatarId] = useState(null);
    const token = getAuthFromStorage()?.token || localStorage.getItem("authToken");

    useEffect(() => {
        loadStaff();
    }, []);

    const loadStaff = async () => {
        setLoading(true);
        try {
            const data = await fetchAdminUsersApi(token);
            // Filter only users who have ROLE_STAFF
            const staff = data.filter(u => u.roles?.includes("ROLE_STAFF"));
            setPersonnel(staff.map(s => ({
                id: s.id,
                name: s.fullName,
                role: "FIELD_STAFF", // Default display role
                phone: s.phone || "N/A",
                email: s.email,
                avatar: s.avatarUrl || null
            })));
        } catch (err) {
            console.error("Failed to load staff:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = (e) => {
        e.preventDefault();
        // Since we don't have a direct "Create Staff" API, 
        // we'll advise the user to use the User Management tab 
        // to convert existing users to staff.
        alert("To add new staff, please register a user and then use the 'Make Staff' button in User Management.");
        setShowAddModal(false);
    };

    const handleRemove = async (id) => {
        if (!window.confirm("Are you sure you want to remove this staff member's staff privileges?")) return;
        
        try {
            // Revert to ROLE_USER
            await updateUserRoleApi(id, "ROLE_USER", token);
            setPersonnel(personnel.filter(p => p.id !== id));
        } catch (err) {
            console.error("Failed to remove staff role:", err);
        }
    };

    const handleAvatarClick = (id) => {
        setEditingAvatarId(id);
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && editingAvatarId) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPersonnel(prev => prev.map(p => 
                    p.id === editingAvatarId ? { ...p, avatar: reader.result } : p
                ));
            };
            reader.readAsDataURL(file);
        }
        setEditingAvatarId(null);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 pb-10"
        >
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Personnel Management</h2>
                    <p className="text-sm text-slate-500 font-bold mt-1 uppercase tracking-widest">Digital Workforce Directory</p>
                </div>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 hover:-translate-y-1 active:scale-95"
                >
                    <PlusCircle size={18} />
                    Add Personnel
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="h-12 w-12 text-emerald-500 animate-spin" />
                    <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Personnel...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {personnel.map(p => (
                            <motion.div 
                                key={p.id} 
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 hover:shadow-xl transition-all group relative overflow-hidden"
                            >
                                {/* Decorative background */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-emerald-500/10 transition-colors duration-500" />
                                
                                <div className="flex items-center justify-between mb-8 relative z-10">
                                    <div className="relative group/avatar">
                                        <div className="h-20 w-20 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-400 font-black text-2xl border-2 border-slate-100 overflow-hidden shadow-sm">
                                            {p.avatar ? (
                                                <img src={p.avatar} alt={p.name} className="h-full w-full object-cover" />
                                            ) : (
                                                p.name.charAt(0)
                                            )}
                                        </div>
                                        <button 
                                            onClick={() => handleAvatarClick(p.id)}
                                            className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover/avatar:opacity-100 rounded-3xl transition-opacity duration-300"
                                        >
                                            <Camera size={20} />
                                        </button>
                                    </div>
                                    <button 
                                        onClick={() => handleRemove(p.id)}
                                        className="h-10 w-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all active:scale-90"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="relative z-10">
                                    <h4 className="text-xl font-black text-slate-800 tracking-tight group-hover:text-emerald-600 transition-colors">{p.name}</h4>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-[0.15em]">
                                            {p.role}
                                        </span>
                                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                            <Shield size={10} className="text-emerald-500" />
                                            Active
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-8 pt-8 border-t border-slate-50 space-y-4 relative z-10">
                                    <div className="flex items-center gap-4 text-slate-600">
                                        <div className="h-9 w-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                                            <Phone size={14} />
                                        </div>
                                        <span className="text-xs font-black tracking-wider">{p.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-slate-600">
                                        <div className="h-9 w-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                                            <Mail size={14} />
                                        </div>
                                        <span className="text-xs font-bold text-slate-500 truncate">{p.email}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Add Personnel Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAddModal(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 relative z-10 shadow-2xl overflow-hidden"
                        >
                            {/* Decorative element */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                            
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm shadow-emerald-100">
                                        <PlusCircle size={22} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">Add Personnel</h3>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Register new team member</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setShowAddModal(false)}
                                    className="h-10 w-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 hover:text-slate-600 transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleAdd} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <input 
                                        required
                                        type="text"
                                        placeholder="Enter name"
                                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-emerald-500 focus:bg-white transition-all text-sm font-bold outline-none"
                                        value={newPerson.name}
                                        onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Role</label>
                                        <select 
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-emerald-500 focus:bg-white transition-all text-sm font-bold outline-none appearance-none"
                                            value={newPerson.role}
                                            onChange={(e) => setNewPerson({ ...newPerson, role: e.target.value })}
                                        >
                                            <option value="PICKER">PICKER</option>
                                            <option value="DRIVER">DRIVER</option>
                                            <option value="PICKERPERSON">PICKERPERSON</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone</label>
                                        <input 
                                            required
                                            type="tel"
                                            placeholder="Phone number"
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-emerald-500 focus:bg-white transition-all text-sm font-bold outline-none"
                                            value={newPerson.phone}
                                            onChange={(e) => setNewPerson({ ...newPerson, phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <input 
                                        required
                                        type="email"
                                        placeholder="Email address"
                                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-emerald-500 focus:bg-white transition-all text-sm font-bold outline-none"
                                        value={newPerson.email}
                                        onChange={(e) => setNewPerson({ ...newPerson, email: e.target.value })}
                                    />
                                </div>

                                <button 
                                    type="submit"
                                    className="w-full mt-4 py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 active:scale-[0.98] flex items-center justify-center gap-3"
                                >
                                    <Check size={18} />
                                    Confirm Addition
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default AdminPersonnel;
