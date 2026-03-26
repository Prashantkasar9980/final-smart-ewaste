import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client/dist/sockjs";
import { Stomp } from "stompjs";
import {
    FiActivity,
    FiClock,
    FiCheckCircle,
    FiXCircle,
    FiImage,
    FiChevronDown,
    FiChevronUp,
} from "react-icons/fi";
import {
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
} from "recharts";
import { motion } from "framer-motion";
import { fetchUserEwasteRequestsApi, getAuthFromStorage } from "../api";

let stompClient = null;

export const connectSocket = (callback) => {
    const socket = new SockJS("http://localhost:8080/ws");
    stompClient = Stomp.over(socket);
    stompClient.connect({}, () => {
        stompClient.subscribe("/topic/ewaste", (message) => {
            callback(JSON.parse(message.body));
        });
    });
};

export const disconnectSocket = () => {
    if (stompClient) stompClient.disconnect();
};

const UserDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [requests, setRequests] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [expandedRequestId, setExpandedRequestId] = useState(null);

    const toggleRequest = (id) => {
        setExpandedRequestId((prev) => (prev === id ? null : id));
    };

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoading(true);
            setError("");
            try {
                const auth = getAuthFromStorage();
                const token = auth?.token;
                if (!token) throw new Error("You are not logged in.");

                const raw = await fetchUserEwasteRequestsApi({ token, page: 0, size: 50 });
                const page = raw?.data ?? raw;
                const content = Array.isArray(page?.content) ? page.content : [];
                const total = Number.isFinite(page?.totalElements)
                    ? page.totalElements
                    : content.length;

                if (!cancelled) {
                    setRequests(content);
                    setTotalElements(total);
                }
            } catch (e) {
                if (!cancelled) setError(e?.message || "Failed to load dashboard.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    const counts = useMemo(() => {
        const out = {
            PENDING: 0,
            APPROVED: 0,
            REJECTED: 0,
            SCHEDULED: 0,
            IN_PROGRESS: 0,
            COMPLETED: 0,
        };
        requests.forEach((r) => {
            const key = r?.status;
            if (key && out[key] !== undefined) out[key] += 1;
        });
        return out;
    }, [requests]);

    const recent = useMemo(() => requests.slice(0, 5), [requests]);

    const statusPie = useMemo(
        () => [
            { name: "Completed", value: counts.COMPLETED, color: "#10b981" },
            { name: "In Progress", value: counts.IN_PROGRESS + counts.SCHEDULED, color: "#3b82f6" },
            { name: "Pending", value: counts.PENDING + counts.APPROVED, color: "#f59e0b" },
            { name: "Rejected", value: counts.REJECTED, color: "#ef4444" },
        ],
        [counts]
    );

    const weeklyOverviewData = useMemo(() => [
        { day: "Sun", requests: 3 },
        { day: "Mon", requests: 5 },
        { day: "Tue", requests: 2 },
        { day: "Wed", requests: 4 },
        { day: "Thu", requests: 1 },
        { day: "Fri", requests: 3 },
        { day: "Sat", requests: 2 },
    ], []);

    return (
        <motion.div className="space-y-8 pb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
                <p className="text-sm text-slate-500">Monitor your recycling requests and activities.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Requests" value={totalElements} icon={<FiActivity size={16} />} color="blue" />
                <StatCard label="Pending" value={counts.PENDING} icon={<FiClock size={16} />} color="yellow" />
                <StatCard label="Completed" value={counts.COMPLETED} icon={<FiCheckCircle size={16} />} color="emerald" />
                <StatCard label="Rejected" value={counts.REJECTED} icon={<FiXCircle size={16} />} color="red" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow border">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Weekly Requests Overview</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={weeklyOverviewData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="requests" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow border flex flex-col items-center">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Status Distribution</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={statusPie} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value">
                                {statusPie.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                        <p className="text-2xl font-bold text-slate-800">{totalElements}</p>
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Total</p>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-3xl p-6 shadow border">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Recent Activity</h3>
                {recent.map((r) => (
                    <div key={r.id} className="flex gap-4 border-l-2 border-emerald-500 pl-4 mb-2">
                        <div className="w-12 h-12 flex items-center justify-center overflow-hidden rounded-xl border border-slate-200">
                            {r.imageData || r.imageUrl ? (
                                <img
                                    src={r.imageData ? `data:image/jpeg;base64,${r.imageData}` : r.imageUrl}
                                    className="h-full w-full object-cover"
                                />
                            ) : <FiImage size={20} className="text-slate-400" />}
                        </div>
                        <div>
                            <p className="font-bold text-slate-800">{r.deviceType}</p>
                            <p className="text-xs text-slate-500">{r.status}</p>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

const StatCard = ({ label, value, icon, color }) => {
    const colors = {
        blue: "bg-blue-50 text-blue-600",
        yellow: "bg-amber-50 text-amber-600",
        emerald: "bg-emerald-50 text-emerald-600",
        red: "bg-red-50 text-rose-600",
    };
    return (
        <div className={`p-4 rounded-2xl flex justify-between items-center shadow-sm ${colors[color]}`}>
            <div>
                <p className="text-xs uppercase text-slate-500">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
            <div className="bg-white p-2 rounded-xl">{icon}</div>
        </div>
    );
};

export default UserDashboard;