// src/pages/admin/AdminUsers.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchAdminUsersApi, approveUserApi, getAuthFromStorage, updateUserRoleApi } from "../../api";
import { Search, Check, X, Users as UsersIcon, Clock, CheckCircle2, ShieldCheck, UserX, Briefcase, Mail, Phone, MapPin, Calendar, Loader2 } from "lucide-react";

const Notification = ({ message, type, onClose }) => (
    <motion.div
        initial={{ opacity: 0, y: -20, x: "-50%" }}
        animate={{ opacity: 1, y: 0, x: "-50%" }}
        exit={{ opacity: 0, y: -20, x: "-50%" }}
        className={`fixed top-6 left-1/2 z-[100] px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 border ${
            type === "success" 
                ? "bg-emerald-500/90 text-white border-emerald-400" 
                : "bg-rose-500/90 text-white border-rose-400"
        }`}
    >
        {type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
        <span className="text-sm font-bold tracking-wide">{message}</span>
        <button onClick={onClose} className="ml-2 hover:opacity-70 transition-opacity">
            <X size={14} />
        </button>
    </motion.div>
);

const AlertCircle = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

const StatusBadge = ({ status, roles }) => {
    const isStaff = roles?.includes("ROLE_STAFF");
    const isAdmin = roles?.includes("ROLE_ADMIN");

    const config = {
        VERIFIED: "bg-emerald-100 text-emerald-700 border-emerald-200",
        PENDING: "bg-amber-100 text-amber-700 border-amber-200",
        REJECTED: "bg-red-100 text-red-700 border-red-200",
    };
    
    return (
        <div className="flex flex-col gap-1">
            <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border w-fit ${config[status] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                {status || "PENDING"}
            </span>
            {isStaff && (
                <span className="px-2.5 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-wider border border-purple-200 bg-purple-50 text-purple-600 w-fit">
                    STAFF
                </span>
            )}
            {isAdmin && (
                <span className="px-2.5 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-wider border border-rose-200 bg-rose-50 text-rose-600 w-fit">
                    ADMIN
                </span>
            )}
        </div>
    );
};

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("pending"); 
    const [searchTerm, setSearchTerm] = useState("");
    const [notification, setNotification] = useState(null);
    const token = getAuthFromStorage()?.token || localStorage.getItem("authToken");

    useEffect(() => {
        loadUsers();
    }, []);

    const showNotify = (message, type = "success") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await fetchAdminUsersApi(token);
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to load users:", err);
            showNotify("Failed to fetch users", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await approveUserApi(id, true, token);
            showNotify("User approved successfully! Credentials sent to email.");
            setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: "VERIFIED" } : u)));
        } catch (err) {
            showNotify(err.message || "Approval failed", "error");
        }
    };

    const handleReject = async (id) => {
        try {
            await approveUserApi(id, false, token);
            showNotify("User application rejected", "success");
            setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: "REJECTED" } : u)));
        } catch (err) {
            showNotify(err.message || "Rejection failed", "error");
        }
    };

    const handleMakeStaff = async (id) => {
        try {
            const res = await updateUserRoleApi(id, "ROLE_STAFF", token);
            showNotify(res.message || "Account upgraded to STAFF role successfully!");
            setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, roles: [...(u.roles || []), "ROLE_STAFF"] } : u)));
        } catch (err) {
            console.error("Failed to update role:", err);
            showNotify(err.message || "Failed to update role. Please check backend logs.", "error");
        }
    };

    const filteredUsers = useMemo(() => {
        return users.filter(u => {
            const matchesTab = activeTab === "all" || u.status === activeTab.toUpperCase();
            const matchesSearch = 
                u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.phone?.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesTab && matchesSearch;
        });
    }, [users, activeTab, searchTerm]);

    const counts = useMemo(() => ({
        pending: users.filter(u => u.status === "PENDING").length,
        verified: users.filter(u => u.status === "VERIFIED").length
    }), [users]);

    return (
        <div className="space-y-6 pb-20">
            <AnimatePresence>
                {notification && (
                    <Notification 
                        message={notification.message} 
                        type={notification.type} 
                        onClose={() => setNotification(null)} 
                    />
                )}
            </AnimatePresence>

            {/* Header & Tabs */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight">User Management</h2>
                        <p className="text-sm text-slate-500 font-bold mt-1 uppercase tracking-widest">Control panel for system access</p>
                    </div>

                    <div className="flex bg-slate-100/80 p-1.5 rounded-2xl w-fit backdrop-blur-sm">
                        <TabButton 
                            active={activeTab === "pending"} 
                            onClick={() => setActiveTab("pending")}
                            label="Pending"
                            count={counts.pending}
                            icon={<Clock size={16} />}
                        />
                        <TabButton 
                            active={activeTab === "verified"} 
                            onClick={() => setActiveTab("verified")}
                            label="Verified"
                            count={counts.verified}
                            icon={<ShieldCheck size={16} />}
                        />
                    </div>
                </div>

                <div className="mt-8 relative group">
                    <div className="absolute inset-0 bg-indigo-500/5 rounded-2xl blur-xl group-hover:bg-indigo-500/10 transition-all duration-500" />
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                    <input 
                        type="text"
                        placeholder="Search by name, email or phone number..."
                        className="relative w-full pl-14 pr-6 py-4 bg-slate-50/50 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <Loader2 className="h-12 w-12 text-indigo-500 animate-spin" />
                    <p className="mt-4 text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Scanning Database...</p>
                </div>
            ) : (
                <>
                    {/* PENDING USERS - DIV FORMAT */}
                    {activeTab === "pending" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence mode="popLayout">
                                {filteredUsers.map(user => (
                                    <motion.div 
                                        key={user.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all group relative overflow-hidden"
                                    >
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 font-black text-xl border-2 border-emerald-100/50 shadow-inner">
                                                    {user.fullName?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-black text-slate-800 tracking-tight">{user.fullName}</h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <StatusBadge status={user.status} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3 mb-8">
                                            <div className="flex items-center gap-3 text-slate-500">
                                                <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                                    <Mail size={14} />
                                                </div>
                                                <span className="text-xs font-bold truncate">{user.email}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-slate-500">
                                                <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                                    <Phone size={14} />
                                                </div>
                                                <span className="text-xs font-bold">{user.phone || "No phone provided"}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <button 
                                                onClick={() => handleApprove(user.id)}
                                                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200 active:scale-95"
                                            >
                                                <Check size={14} /> Approve
                                            </button>
                                            <button 
                                                onClick={() => handleReject(user.id)}
                                                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-rose-50 text-rose-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all active:scale-95 border border-rose-100"
                                            >
                                                <X size={14} /> Reject
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {filteredUsers.length === 0 && <EmptyState message="No pending applications found" />}
                        </div>
                    ) : (
                        /* DIRECTORY & VERIFIED - TABLE FORMAT */
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50 border-b border-slate-100">
                                        <th className="px-8 py-5">User Profile</th>
                                        <th className="px-8 py-5">Communication</th>
                                        <th className="px-8 py-5">Status & Role</th>
                                        <th className="px-8 py-5 text-right">Administrative Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    <AnimatePresence mode="popLayout">
                                        {filteredUsers.map(user => (
                                            <motion.tr 
                                                key={user.id} 
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="hover:bg-slate-50/50 transition-colors group"
                                            >
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm border-2 ${
                                                            user.status === 'PENDING' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-indigo-50 text-indigo-500 border-indigo-100'
                                                        }`}>
                                                            {user.fullName?.charAt(0) || 'U'}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-black text-slate-800 tracking-tight">{user.fullName}</div>
                                                            <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase mt-0.5">
                                                                <Calendar size={10} /> Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="space-y-1">
                                                        <div className="text-xs font-bold text-slate-600 flex items-center gap-2">
                                                            <Mail size={12} className="text-slate-300" /> {user.email}
                                                        </div>
                                                        <div className="text-xs font-bold text-slate-400 flex items-center gap-2">
                                                            <Phone size={12} className="text-slate-300" /> {user.phone || "N/A"}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <StatusBadge status={user.status} roles={user.roles} />
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {user.status === 'PENDING' ? (
                                                            <>
                                                                <button 
                                                                    onClick={() => handleApprove(user.id)} 
                                                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white hover:bg-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-100 active:scale-95"
                                                                >
                                                                    <Check size={14} /> Approve
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleReject(user.id)} 
                                                                    className="flex items-center gap-2 px-4 py-2 bg-white text-rose-500 hover:bg-rose-50 border border-rose-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                                                                >
                                                                    <X size={14} /> Reject
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                {user.status === 'VERIFIED' && !user.roles?.includes("ROLE_STAFF") && !user.roles?.includes("ROLE_ADMIN") && (
                                                                    <button 
                                                                        onClick={() => handleMakeStaff(user.id)} 
                                                                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-100 active:scale-95"
                                                                    >
                                                                        <Briefcase size={14} /> Upgrade to Staff
                                                                    </button>
                                                                )}
                                                                {user.roles?.includes("ROLE_STAFF") && (
                                                                    <span className="px-4 py-2 bg-purple-50 text-purple-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-purple-100">
                                                                        Field Personnel
                                                                    </span>
                                                                )}
                                                                {user.roles?.includes("ROLE_ADMIN") && (
                                                                    <span className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-rose-100">
                                                                        Super Admin
                                                                    </span>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                            {filteredUsers.length === 0 && <EmptyState message="No users found in this category" />}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

const TabButton = ({ active, onClick, label, count, icon }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
            active 
                ? "bg-white text-indigo-600 shadow-md scale-105" 
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
        }`}
    >
        {React.cloneElement(icon, { size: 14, className: active ? "text-indigo-500" : "text-slate-400" })}
        {label}
        {count > 0 && (
            <span className={`ml-1 px-2 py-0.5 rounded-lg text-[9px] ${
                active ? "bg-indigo-100 text-indigo-600" : "bg-slate-200 text-slate-500"
            }`}>
                {count}
            </span>
        )}
    </button>
);

const EmptyState = ({ message }) => (
    <div className="col-span-full py-32 flex flex-col items-center justify-center text-slate-400 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="h-24 w-24 rounded-full bg-slate-50 flex items-center justify-center mb-6 border-2 border-slate-100 shadow-inner">
            <Search size={40} className="text-slate-200" />
        </div>
        <p className="font-black text-xs uppercase tracking-widest">{message}</p>
    </div>
);

export default AdminUsers;
