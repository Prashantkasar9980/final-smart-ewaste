import React, { useEffect, useMemo, useState } from "react";
import {
    assignAdminEwastePersonnelApi,
    fetchAdminEwasteRequestsApi,
    getAuthFromStorage,
    scheduleAdminEwastePickupApi,
    updateAdminEwasteStatusApi,
    fetchAdminUsersApi,
} from "../../api";
import { FiFilter, FiCalendar, FiUser, FiCheck, FiRefreshCw, FiX, FiClock } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const STATUS = ["PENDING", "APPROVED", "REJECTED", "SCHEDULED", "IN_PROGRESS", "COMPLETED"];

const AdminRequests = () => {
    const token = getAuthFromStorage()?.token || localStorage.getItem("authToken");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [status, setStatus] = useState("ALL");
    const [items, setItems] = useState([]);
    const [pageInfo, setPageInfo] = useState({ page: 0, size: 10, total: 0 });
    const [staffMembers, setStaffMembers] = useState([]);

    // Modal state
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [scheduleForm, setScheduleForm] = useState({
        date: "",
        time: "",
        personnel: ""
    });
    const [modalLoading, setModalLoading] = useState(false);

    const load = async (next = pageInfo) => {
        setLoading(true);
        setError("");
        try {
            const raw = await fetchAdminEwasteRequestsApi({
                token,
                page: next.page,
                size: next.size,
                status: status === "ALL" ? undefined : status,
            });
            const page = raw?.data ?? raw;
            const content = Array.isArray(page?.content) ? page.content : Array.isArray(page) ? page : [];
            setItems(content);
            setPageInfo({
                page: Number(page?.number ?? next.page ?? 0),
                size: Number(page?.size ?? next.size ?? 10),
                total: Number(page?.totalElements ?? content.length ?? 0),
            });
        } catch (e) {
            setError(e?.message || "Failed to load requests.");
        } finally {
            setLoading(false);
        }
    };

    const loadStaff = async () => {
        try {
            const data = await fetchAdminUsersApi(token);
            // Only show users who have ROLE_STAFF
            const staff = data
                .filter(u => u.roles?.includes("ROLE_STAFF") || u.status === "VERIFIED") // Added verified fallback if needed, but primary is ROLE_STAFF
                .filter(u => u.roles?.includes("ROLE_STAFF")) // Strict check for ROLE_STAFF as requested
                .map(u => u.fullName);
            setStaffMembers(staff);
        } catch (err) {
            console.error("Failed to load staff:", err);
        }
    };

    useEffect(() => {
        load({ page: 0, size: pageInfo.size, total: 0 });
        loadStaff();
    }, [status]);

    const totalPages = useMemo(() => {
        const t = pageInfo.total || 0;
        return Math.max(1, Math.ceil(t / pageInfo.size));
    }, [pageInfo.total, pageInfo.size]);

    const onUpdateStatus = async (id, nextStatus) => {
        try {
            await updateAdminEwasteStatusApi({ token, id, status: nextStatus });
            await load(pageInfo);
        } catch (e) {
            setError(e?.message || "Failed to update status.");
        }
    };

    const onAssign = async (id) => {
        const personnelName = window.prompt("Assign personnel name:");
        if (!personnelName) return;
        try {
            await assignAdminEwastePersonnelApi({ token, id, personnelName });
            await load(pageInfo);
        } catch (e) {
            setError(e?.message || "Failed to assign personnel.");
        }
    };

    const onOpenScheduleModal = (item) => {
        setSelectedItem(item);
        setScheduleForm({
            date: item.scheduledAt ? item.scheduledAt.split('T')[0] : "",
            time: item.scheduledAt ? item.scheduledAt.split('T')[1]?.substring(0, 5) : "",
            personnel: item.assignedPersonnel || ""
        });
        setShowScheduleModal(true);
    };

    const handleConfirmSchedule = async (e) => {
        e.preventDefault();
        if (!scheduleForm.date || !scheduleForm.time || !scheduleForm.personnel) {
            alert("Please fill all fields");
            return;
        }

        setModalLoading(true);
        try {
            const scheduledAt = `${scheduleForm.date}T${scheduleForm.time}:00Z`;
            
            // 1. Schedule Pickup (This moves status to SCHEDULED in the backend)
            await scheduleAdminEwastePickupApi({ 
                token, 
                id: selectedItem.id, 
                scheduledAt 
            });

            // 2. Assign Personnel (This keeps the status as SCHEDULED)
            await assignAdminEwastePersonnelApi({ 
                token, 
                id: selectedItem.id, 
                personnelName: scheduleForm.personnel 
            });

            setShowScheduleModal(false);
            await load(pageInfo);
        } catch (e) {
            alert(e?.message || "Failed to update schedule.");
        } finally {
            setModalLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">E-Waste Requests</h1>
                    <p className="text-sm text-slate-500">Manage status, schedule, and assignments.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        >
                            <option value="ALL">All</option>
                            {STATUS.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="button"
                        onClick={() => load(pageInfo)}
                        className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                        <FiRefreshCw size={14} />
                        Refresh
                    </button>
                </div>
            </div>

            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <div className="font-semibold">Action failed</div>
                    <div className="mt-1">{error}</div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs font-semibold text-slate-500 uppercase bg-slate-50/80">
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Device</th>
                                <th className="px-6 py-4">Qty</th>
                                <th className="px-6 py-4">Pickup</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Assigned</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                [...Array(6)].map((_, i) => (
                                    <tr key={i}>
                                        <td className="p-4" colSpan={7}>
                                            <div className="h-6 w-full bg-slate-100 rounded animate-pulse" />
                                        </td>
                                    </tr>
                                ))
                            ) : items.length === 0 ? (
                                <tr>
                                    <td className="p-10 text-center text-slate-500" colSpan={7}>
                                        No requests found for this filter.
                                    </td>
                                </tr>
                            ) : (
                                items.map((r) => (
                                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-700">#{r.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-800">{r.deviceType || "—"}</div>
                                            <div className="text-xs text-slate-500">{[r.brand, r.model].filter(Boolean).join(" / ")}</div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 font-medium">{r.quantity ?? 1}</td>
                                        <td className="px-6 py-4 text-slate-500 text-xs font-medium">{r.pickupDateTime ? new Date(r.pickupDateTime).toLocaleString() : "—"}</td>
                                        <td className="px-6 py-4"><StatusBadge status={r.status} /></td>
                                        <td className="px-6 py-4 text-slate-500 font-medium">{r.assignedPersonnel || "—"}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                {r.status === "PENDING" && (
                                                    <>
                                                        <ActionButton onClick={() => onUpdateStatus(r.id, "APPROVED")} icon={<FiCheck size={12} />} label="Approve" variant="emerald" />
                                                        <ActionButton onClick={() => onUpdateStatus(r.id, "REJECTED")} icon={<FiX size={12} />} label="Reject" />
                                                    </>
                                                )}
                                                {r.status === "APPROVED" && (
                                                    <ActionButton onClick={() => onOpenScheduleModal(r)} icon={<FiCalendar size={12} />} label="Schedule" />
                                                )}
                                                {(r.status === "SCHEDULED" || r.status === "IN_PROGRESS") && (
                                                    <ActionButton onClick={() => onUpdateStatus(r.id, "COMPLETED")} icon={<FiCheck size={12} />} label="Complete" variant="emerald" />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 border-t border-slate-100">
                    <div className="text-sm text-slate-600">
                        Total: <span className="font-bold text-slate-800">{pageInfo.total}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            disabled={pageInfo.page <= 0 || loading}
                            onClick={() => load({ ...pageInfo, page: Math.max(0, pageInfo.page - 1) })}
                            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 disabled:opacity-50 hover:bg-slate-50 transition-colors"
                        >
                            Prev
                        </button>
                        <div className="text-xs text-slate-600">
                            Page <span className="font-bold text-slate-800">{pageInfo.page + 1}</span> / {totalPages}
                        </div>
                        <button
                            type="button"
                            disabled={pageInfo.page >= totalPages - 1 || loading}
                            onClick={() => load({ ...pageInfo, page: Math.min(totalPages - 1, pageInfo.page + 1) })}
                            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 disabled:opacity-50 hover:bg-slate-50 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* SCHEDULE PICKUP MODAL */}
            <AnimatePresence>
                {showScheduleModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowScheduleModal(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[2rem] w-full max-w-lg relative z-10 shadow-2xl overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="bg-slate-900 p-6 text-white flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold">Schedule Pickup</h3>
                                    <p className="text-xs text-slate-400 mt-1">Assign date, time & personnel</p>
                                </div>
                                <button 
                                    onClick={() => setShowScheduleModal(false)}
                                    className="p-1 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <FiX size={20} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <form onSubmit={handleConfirmSchedule} className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
                                        <div className="relative">
                                            <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input 
                                                type="date"
                                                required
                                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:border-emerald-500 transition-all text-sm font-bold outline-none"
                                                value={scheduleForm.date}
                                                onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Time</label>
                                        <div className="relative">
                                            <FiClock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input 
                                                type="time"
                                                required
                                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:border-emerald-500 transition-all text-sm font-bold outline-none"
                                                value={scheduleForm.time}
                                                onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pickup Personnel</label>
                                    <select 
                                        required
                                        className="w-full px-6 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:border-emerald-500 transition-all text-sm font-bold outline-none appearance-none"
                                        value={scheduleForm.personnel}
                                        onChange={(e) => setScheduleForm({ ...scheduleForm, personnel: e.target.value })}
                                    >
                                        <option value="">Select Personnel</option>
                                        {staffMembers.map(p => (
                                            <option key={p} value={p}>{p}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex justify-end gap-4 pt-4">
                                    <button 
                                        type="button"
                                        onClick={() => setShowScheduleModal(false)}
                                        className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-200 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={modalLoading}
                                        className="px-8 py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50"
                                    >
                                        {modalLoading ? "Confirming..." : "Confirm Schedule"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </motion.div>
    );
};

const StatusBadge = ({ status }) => {
    const colors = {
        PENDING: "bg-yellow-100 text-yellow-700",
        APPROVED: "bg-blue-100 text-blue-700",
        REJECTED: "bg-red-100 text-red-700",
        SCHEDULED: "bg-purple-100 text-purple-700",
        IN_PROGRESS: "bg-cyan-100 text-cyan-700",
        COMPLETED: "bg-emerald-100 text-emerald-700",
    };
    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${colors[status] || 'bg-slate-100 text-slate-700'}`}>
            {status.replace('_', ' ')}
        </span>
    );
};

const ActionButton = ({ onClick, icon, label, variant }) => {
    const baseClasses = "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95";
    const variants = {
        default: "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50",
        emerald: "bg-emerald-500 text-white hover:bg-emerald-600",
    };
    return (
        <button onClick={onClick} className={`${baseClasses} ${variants[variant] || variants.default}`}>
            {icon}
            {label}
        </button>
    );
};

export default AdminRequests;


