import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiFilter, FiChevronRight, FiAlertCircle, FiMapPin, FiCalendar, FiImage } from "react-icons/fi";
import { fetchUserEwasteRequestsApi, getAuthFromStorage } from "../api";
import { motion } from "framer-motion";

const STATUS_OPTIONS = [
    { value: "ALL", label: "All" },
    { value: "PENDING", label: "Pending" },
    { value: "APPROVED", label: "Approved" },
    { value: "SCHEDULED", label: "Scheduled" },
    { value: "IN_PROGRESS", label: "In progress" },
    { value: "COMPLETED", label: "Completed" },
    { value: "REJECTED", label: "Rejected" },
];

function formatDate(value) {
    if (!value) return "—";
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString();
}

function StatusBadge({ status }) {
    if (!status) return null;
    const map = {
        PENDING: "bg-amber-100 text-amber-700 border-amber-200",
        APPROVED: "bg-emerald-100 text-emerald-700 border-emerald-200",
        REJECTED: "bg-red-100 text-red-700 border-red-200",
        SCHEDULED: "bg-blue-100 text-blue-700 border-blue-200",
        IN_PROGRESS: "bg-purple-100 text-purple-700 border-purple-200",
        COMPLETED: "bg-green-100 text-green-700 border-green-200",
    };
    const cls = map[status] || "bg-slate-100 text-slate-700 border-slate-200";
    return (
        <span className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${cls}`}>
            {status.replace(/_/g, " ")}
        </span>
    );
}

const MyRequestsPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [requests, setRequests] = useState([]);
    const [filter, setFilter] = useState("ALL");
    const [filterOpen, setFilterOpen] = useState(false);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoading(true);
            setError("");
            try {
                const auth = getAuthFromStorage();
                const token = auth?.token;
                if (!token) throw new Error("You are not logged in.");
                const raw = await fetchUserEwasteRequestsApi({ token, page: 0, size: 100 });
                const page = raw?.data ?? raw;
                const content = Array.isArray(page?.content) ? page.content : [];
                if (!cancelled) setRequests(content);
            } catch (e) {
                if (!cancelled) setError(e?.message || "Failed to load requests.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, []);

    const filtered = useMemo(() => {
        if (filter === "ALL") return requests;
        return requests.filter((r) => r?.status === filter);
    }, [requests, filter]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 pb-10"
        >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-800">My Requests</h1>
                    <p className="mt-1 text-sm text-slate-500 font-medium">
                        Track and manage your e-waste pickups.
                    </p>
                </div>

                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setFilterOpen((o) => !o)}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all duration-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
                    >
                        <FiFilter size={16} />
                        {STATUS_OPTIONS.find((o) => o.value === filter)?.label ?? filter}
                    </button>
                    {filterOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                aria-hidden
                                onClick={() => setFilterOpen(false)}
                            />
                            <div className="absolute right-0 top-full z-20 mt-2 w-56 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl backdrop-blur-xl">
                                {STATUS_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => {
                                            setFilter(opt.value);
                                            setFilterOpen(false);
                                        }}
                                        className={`flex w-full items-center px-4 py-2.5 text-sm rounded-xl transition-all ${
                                            filter === opt.value ? "bg-emerald-500 text-white font-bold" : "text-slate-600 hover:bg-slate-50 font-medium"
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {error && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600 font-medium">
                    <FiAlertCircle className="mt-0.5 shrink-0" size={18} />
                    <div>
                        <div className="font-bold">Error</div>
                        <div className="text-xs opacity-80">{error}</div>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-[400px] rounded-3xl bg-slate-100 animate-pulse border border-slate-200" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="rounded-3xl border border-slate-100 bg-white p-20 text-center shadow-sm">
                    <div className="mx-auto h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-6">
                        <FiImage size={40} />
                    </div>
                    <p className="text-xl font-bold text-slate-800">No requests found</p>
                    <p className="mt-2 text-sm text-slate-500 font-medium">
                        {filter === "ALL" ? "You haven't submitted any pickup requests yet." : "Try adjusting your filter to see more results."}
                    </p>
                    {filter === "ALL" && (
                        <button
                            onClick={() => navigate("/user/submit")}
                            className="mt-8 rounded-2xl bg-emerald-600 px-8 py-3 text-sm font-black text-white hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-95"
                        >
                            Schedule First Pickup
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filtered.map((r) => (
                        <div
                            key={r.id}
                            onClick={() => navigate(`/user/track?id=${r.id}`)}
                            className="group cursor-pointer bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col h-full"
                        >
                            {/* Card Image */}
                            <div className="aspect-[4/3] bg-slate-50 relative overflow-hidden flex items-center justify-center border-b border-slate-50 p-6">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                {r.imageData || r.imageUrl || r.image || r.imageName || r.photo || r.imagePath ? (
                                    <img
                                        src={
                                            r.imageData ? `data:${r.imageType || 'image/jpeg'};base64,${r.imageData}` :
                                            (r.imageUrl || r.image || r.photo || r.imagePath || `http://localhost:8080/api/public/images/${r.imageName}`)
                                        }
                                        alt=""
                                        className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-700"
                                        onError={(e) => {
                                            // If image fails to load, fallback to icon
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <div className={`flex flex-col items-center gap-2 text-slate-300 group-hover:text-emerald-300 transition-colors ${r.imageData || r.imageUrl || r.image || r.imageName || r.photo || r.imagePath ? 'hidden' : 'flex'}`}>
                                    <FiImage size={48} strokeWidth={1} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">No Preview</span>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-8 flex flex-col flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-black text-slate-800 leading-tight truncate">{r.deviceType}</h3>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 truncate">{r.brand || "Unknown Brand"} {r.model || ""}</p>
                                    </div>
                                    <div className="ml-4">
                                        <StatusBadge status={r.status} />
                                    </div>
                                </div>

                                <div className="space-y-2 mt-auto">
                                    <div className="flex items-center gap-3 text-slate-500">
                                        <div className="h-7 w-7 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                                            <FiMapPin size={12} className="text-emerald-500" />
                                        </div>
                                        <p className="text-[11px] font-bold truncate">{r.pickupAddress || "No address provided"}</p>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500">
                                        <div className="h-7 w-7 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                                            <FiCalendar size={12} className="text-blue-500" />
                                        </div>
                                        <p className="text-[11px] font-bold">{formatDate(r.pickupDateTime || r.createdAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default MyRequestsPage;
