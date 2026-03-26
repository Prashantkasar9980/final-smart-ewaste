// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    approveUserApi,
    fetchAdminDashboardApi,
    fetchAdminEwasteRequestsApi, // <-- Import the new API function
    fetchAdminUsersApi,
    getAuthFromStorage,
} from "../../api";
import {
    Users,
    Clock,
    CheckCircle2,
    XCircle,
    Activity,
    TrendingUp,
    AlertTriangle,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Filter,
    MoreVertical,
    Check,
    X,
    ExternalLink
} from "lucide-react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Legend,
    LineChart, // <-- Add LineChart
    Line,      // <-- Add Line
} from "recharts";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [requests, setRequests] = useState([]); // <-- New state for requests
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const token = getAuthFromStorage()?.token || localStorage.getItem("authToken");

    useEffect(() => {
        loadAll();
    }, []);

    const loadAll = async () => {
        setLoading(true);
        setError("");
        try {
            const [usersRaw, dashRaw, requestsRaw] = await Promise.all([
                fetchAdminUsersApi(token),
                fetchAdminDashboardApi(token),
                fetchAdminEwasteRequestsApi({ token, size: 5 }) // <-- Fetch recent requests
            ]);

            const dash = dashRaw?.data ?? dashRaw;
            setStats(dash || null);
            setUsers(Array.isArray(usersRaw) ? usersRaw : []);
            setRequests(requestsRaw?.data?.content || []); // <-- Set requests state

        } catch (err) {
            console.error("Fetch dashboard failed:", err);
            setError(err?.message || "Failed to load admin dashboard.");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await approveUserApi(id, true, token);
            setUsers((prev) =>
                prev.map((u) => (u.id === id ? { ...u, status: "VERIFIED" } : u))
            );
        } catch (err) {
            loadAll();
        }
    };

    const handleReject = async (id) => {
        try {
            await approveUserApi(id, false, token);
            setUsers((prev) =>
                prev.map((u) => (u.id === id ? { ...u, status: "REJECTED" } : u))
            );
        } catch (err) {
            loadAll();
        }
    };

    const userStats = useMemo(() => {
        const total = users.length;
        const pending = users.filter((u) => u.status === "PENDING").length;
        const verified = users.filter((u) => u.status === "VERIFIED").length;
        const rejected = users.filter((u) => u.status === "REJECTED").length;
        return [
            { name: "Verified", value: verified, color: "#10b981" },
            { name: "Pending", value: pending, color: "#f59e0b" },
            { name: "Rejected", value: rejected, color: "#ef4444" },
        ];
    }, [users]);

    const monthlyTrend = useMemo(() => {
        const rows = Array.isArray(stats?.monthlyStats) ? stats.monthlyStats : [];
        return rows.map((r) => ({
            month: r?.month ?? "",
            requests: Number(r?.count ?? 0),
        }));
    }, [stats]);

    const requestDistribution = useMemo(() => ([
        { name: "Completed", value: Number(stats?.completedRequests ?? 0), color: "#10b981" },
        { name: "In Progress", value: Number(stats?.inProgressRequests ?? 0), color: "#3b82f6" },
        { name: "Pending", value: Number(stats?.pendingRequests ?? 0), color: "#f59e0b" },
        { name: "Rejected", value: Number(stats?.rejectedRequests ?? 0), color: "#ef4444" },
    ]), [stats]);

    const totalRequestsCount = useMemo(() => {
        return requestDistribution.reduce((acc, curr) => acc + curr.value, 0);
    }, [requestDistribution]);

    const filteredUsers = useMemo(() => {
        return users.filter(u => {
            const fullName = u?.fullName || "";
            const email = u?.email || "";
            const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                 email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filter === "all" || u?.status === filter.toUpperCase();
            return matchesSearch && matchesFilter;
        });
    }, [users, searchTerm, filter]);

    const weeklyOverviewData = useMemo(() => {
        // Dummy data for the weekly overview chart
        return [
            { day: "Sun", requests: 3 },
            { day: "Mon", requests: 5 },
            { day: "Tue", requests: 2 },
            { day: "Wed", requests: 4 },
            { day: "Thu", requests: 1 },
            { day: "Fri", requests: 3 },
            { day: "Sat", requests: 2 },
        ];
    }, []);

    const topCollectedItemsData = useMemo(() => {
        // Dummy data for top collected items
        return [
            { name: "Mobile", value: 400 },
            { name: "TV / Monitor", value: 300 },
            { name: "Laptop", value: 200 },
            { name: "Other", value: 100 },
        ];
    }, []);

    if (loading) return <DashboardSkeleton />;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 pb-10"
        >
            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 flex items-center gap-3 text-red-700">
                    <AlertTriangle className="h-5 w-5" />
                    <div>
                        <div className="font-semibold text-sm">Action Required</div>
                        <div className="text-xs">{error}</div>
                    </div>
                </div>
            )}

            {/* ---- STATS CARDS ---- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total Requests" value={stats?.totalRequests ?? 0} icon={<Activity size={20} />} color="blue" trend={`+${stats?.weekRequests ?? 0}`} trendLabel="this week" />
                <StatCard label="Pending" value={stats?.pendingRequests ?? 0} icon={<Clock size={20} />} color="yellow" trend={`${stats?.pendingUsers ?? 0}`} trendLabel="users waiting" />
                <StatCard label="Completed" value={stats?.completedRequests ?? 0} icon={<CheckCircle2 size={20} />} color="emerald" trend={`+${(stats?.completedRequests ?? 0) > 0 ? ((stats.completedRequests / stats.totalRequests) * 100).toFixed(0) : 0}%`} trendLabel="completion rate" />
                <StatCard label="Overdue" value={stats?.overdueRequests ?? 0} icon={<AlertTriangle size={20} />} color="red" trend={`${stats?.overdueRequests ?? 0}`} trendLabel="require attention" />
            </div>

            {/* ---- CHARTS ROW 1 ---- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Dashboard Overview Chart (Left) */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Dashboard Overview</h3>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={weeklyOverviewData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="requests" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Status Distribution (Right) */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center">
                    <div className="w-full mb-4">
                        <h3 className="text-lg font-semibold text-slate-800">Status Distribution</h3>
                    </div>
                    <div className="h-[200px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={requestDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {requestDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <p className="text-2xl font-bold text-slate-800">{totalRequestsCount}</p>
                            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Total</p>
                        </div>
                    </div>
                    {/* Legend */}
                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                        {requestDistribution.map((item) => (
                            <div key={item.name} className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-xs text-slate-600 font-medium">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ---- CHARTS ROW 2 ---- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Collected Items Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-800 mb-6">Top Collected Items</h3>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topCollectedItemsData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} width={100} />
                                <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} />
                                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 10, 10, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Transactions List */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 overflow-hidden">
                    <h3 className="text-lg font-semibold text-slate-800 mb-6">Recent Transactions</h3>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                                    <th className="pb-4">User</th>
                                    <th className="pb-4">Item</th>
                                    <th className="pb-4">Date</th>
                                    <th className="pb-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {requests.map(req => (
                                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs shrink-0">
                                                    {req.user?.fullName?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-800 truncate max-w-[120px]">{req.user?.fullName || 'Unknown User'}</p>
                                                    <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{req.user?.email || 'No email'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <p className="text-xs font-medium text-slate-600">{req.deviceType} <span className="text-slate-400">({req.quantity})</span></p>
                                        </td>
                                        <td className="py-4">
                                            <p className="text-xs text-slate-500 font-medium">
                                                {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'N/A'}
                                            </p>
                                        </td>
                                        <td className="py-4 text-right">
                                            <StatusBadge status={req.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

/* ---- HELPER COMPONENTS ---- */

const StatCard = ({ label, value, icon, color, trend, trendLabel }) => {
    const colors = {
        blue: { bg: "bg-blue-50/20", iconBg: "bg-blue-500", text: "text-blue-600", border: "border-blue-100/50" },
        yellow: { bg: "bg-amber-50/20", iconBg: "bg-amber-500", text: "text-amber-600", border: "border-amber-100/50" },
        emerald: { bg: "bg-emerald-50/20", iconBg: "bg-emerald-500", text: "text-emerald-600", border: "border-emerald-100/50" },
        red: { bg: "bg-rose-50/20", iconBg: "bg-rose-500", text: "text-rose-600", border: "border-rose-100/50" },
    };
    const selectedColor = colors[color] || colors.blue;

    return (
        <div className={`relative overflow-hidden rounded-[1.5rem] p-4 shadow-sm border ${selectedColor.border} transition-all duration-500 hover:shadow-xl hover:-translate-y-1.5 group ${selectedColor.bg} backdrop-blur-sm`}>
            {/* Glossy overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
            
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${selectedColor.iconBg}`}>
                        {React.cloneElement(icon, { size: 18 })}
                    </div>
                    <div className="flex flex-col items-end">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${selectedColor.text}`}>{trend}</span>
                        <span className="text-[8px] text-slate-400 font-bold uppercase">{trendLabel}</span>
                    </div>
                </div>
                <div>
                    <h3 className="text-2xl font-black text-slate-800 leading-none mb-1 group-hover:text-slate-900 transition-colors">{value}</h3>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.15em]">{label}</p>
                </div>
            </div>
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const config = {
        VERIFIED: "bg-emerald-100 text-emerald-700 border-emerald-200",
        PENDING: "bg-amber-100 text-amber-700 border-amber-200",
        REJECTED: "bg-red-100 text-red-700 border-red-200",
        IN_PROGRESS: "bg-blue-100 text-blue-700 border-blue-200",
        COMPLETED: "bg-green-100 text-green-700 border-green-200",
    };
    
    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${config[status] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
            {status?.replace('_', ' ') || "PENDING"}
        </span>
    );
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs">
                <p className="font-bold mb-1">{label}</p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full" style={{backgroundColor: entry.color || entry.fill}} />
                        <span className="opacity-80">{entry.name}:</span>
                        <span className="font-bold">{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const DashboardSkeleton = () => (
    <div className="animate-pulse space-y-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-100 rounded-3xl" />)}
        </div>
        <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 h-80 bg-slate-100 rounded-3xl" />
            <div className="h-80 bg-slate-100 rounded-3xl" />
        </div>
        <div className="h-64 bg-slate-100 rounded-3xl" />
    </div>
);

export default AdminDashboard;
