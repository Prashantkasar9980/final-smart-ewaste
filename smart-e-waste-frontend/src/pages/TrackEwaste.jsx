import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiSearch, FiCheck, FiPackage, FiTruck, FiRefreshCw, FiCheckCircle, FiClock, FiAlertCircle, FiImage, FiMapPin, FiCalendar } from "react-icons/fi";
import { fetchUserEwasteRequestsApi, getAuthFromStorage } from "../api";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_STEPS = [
    { label: "Request submitted", icon: <FiClock />, description: "Your pickup request has been received and is pending review." },
    { label: "Pickup scheduled", icon: <FiCalendar />, description: "A pickup time has been assigned for your e-waste collection." },
    { label: "Item collected", icon: <FiTruck />, description: "Our team has successfully collected the items from your location." },
    { label: "Recycling in progress", icon: <FiRefreshCw />, description: "Your e-waste is being processed at our certified recycling facility." },
    { label: "Recycled successfully", icon: <FiCheckCircle />, description: "Process complete! Thank you for contributing to a greener planet." },
];

const STATUS_MAP = {
    PENDING: 0,
    APPROVED: 0,
    SCHEDULED: 1,
    IN_PROGRESS: 3,
    COMPLETED: 4,
    REJECTED: -1,
};

const TrackEwaste = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [requestId, setRequestId] = useState("");
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                const { token } = getAuthFromStorage();
                if (!token) return;
                const raw = await fetchUserEwasteRequestsApi({ token, page: 0, size: 50 });
                const page = raw?.data ?? raw;
                const content = Array.isArray(page?.content) ? page.content : [];
                if (!cancelled) {
                    setRequests(content);
                    
                    // Check for ID in URL
                    const params = new URLSearchParams(location.search);
                    const idFromUrl = params.get("id");
                    if (idFromUrl) {
                        setRequestId(idFromUrl);
                        const found = content.find(r => String(r.id) === idFromUrl);
                        if (found) setSelectedRequest(found);
                    }
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, [location.search]);

    const handleTrack = () => {
        const id = requestId.trim();
        if (!id) {
            setSelectedRequest(null);
            return;
        }
        setSearchLoading(true);
        const num = parseInt(id, 10);
        const found = requests.find((r) => r.id === num || String(r.id) === id);
        
        // Toggle if same ID, otherwise set new
        if (selectedRequest && selectedRequest.id === found?.id) {
            setSelectedRequest(null);
        } else {
            setSelectedRequest(found || null);
        }
        setSearchLoading(false);
    };

    const statusIndex = selectedRequest != null ? STATUS_MAP[selectedRequest.status] ?? 0 : null;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 pb-10 min-h-[80vh]"
            onClick={() => setSelectedRequest(null)}
        >
            <div onClick={(e) => e.stopPropagation()}>
                <h1 className="text-3xl font-black text-slate-800">Track E-Waste</h1>
                <p className="mt-1 text-sm text-slate-500 font-medium">
                    Monitor the real-time status of your recycling requests.
                </p>
            </div>

            <div 
                className="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex-1 relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <FiSearch size={20} />
                        </div>
                        <input
                            type="text"
                            value={requestId}
                            onChange={(e) => setRequestId(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                            placeholder="Enter Request ID (e.g. 101)"
                            className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 pl-12 pr-4 py-4 text-slate-800 font-bold placeholder-slate-400 transition-all duration-300 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleTrack}
                        disabled={searchLoading}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-8 py-4 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-200 transition-all duration-300 hover:bg-emerald-700 hover:-translate-y-1 active:translate-y-0 disabled:opacity-60"
                    >
                        {searchLoading ? "Searching…" : "Track Now"}
                    </button>
                </div>

                {selectedRequest === null && requestId.trim() && !searchLoading && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-4 flex items-center gap-2 text-sm text-red-500 font-bold"
                    >
                        <FiAlertCircle />
                        No request found with this ID. Please check and try again.
                    </motion.div>
                )}
            </div>

            <AnimatePresence mode="wait">
                {selectedRequest && (
                    <motion.div 
                        key={selectedRequest.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Request Summary Card */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="rounded-[2rem] border border-slate-100 bg-white overflow-hidden shadow-sm">
                                <div className="aspect-video bg-slate-50 relative overflow-hidden flex items-center justify-center border-b border-slate-50">
                                    {selectedRequest.imageData || selectedRequest.imageUrl || selectedRequest.image || selectedRequest.imageName || selectedRequest.photo || selectedRequest.imagePath ? (
                                        <img 
                                            src={
                                                selectedRequest.imageData ? `data:${selectedRequest.imageType || 'image/jpeg'};base64,${selectedRequest.imageData}` : 
                                                (selectedRequest.imageUrl || selectedRequest.image || selectedRequest.photo || selectedRequest.imagePath || `http://localhost:8080/api/public/images/${selectedRequest.imageName}`)
                                            } 
                                            alt="Device" 
                                            className="h-full w-full object-contain p-4" 
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
                                            }}
                                        />
                                    ) : null}
                                    <FiImage size={48} className={`text-slate-200 ${selectedRequest.imageData || selectedRequest.imageUrl || selectedRequest.image || selectedRequest.imageName || selectedRequest.photo || selectedRequest.imagePath ? 'hidden' : 'block'}`} />
                                    <div className="absolute top-4 right-4">
                                        <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border border-slate-100">
                                            ID: #{selectedRequest.id}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <h3 className="text-2xl font-black text-slate-800 mb-1">{selectedRequest.deviceType}</h3>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6">
                                        {selectedRequest.brand || "Unknown Brand"} {selectedRequest.model || ""}
                                    </p>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 text-blue-600">
                                                <FiCalendar size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Requested On</p>
                                                <p className="text-sm font-bold text-slate-700">
                                                    {selectedRequest.createdAt ? new Date(selectedRequest.createdAt).toLocaleDateString() : "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-600">
                                                <FiMapPin size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pickup Location</p>
                                                <p className="text-sm font-bold text-slate-700 truncate max-w-[180px]">
                                                    {selectedRequest.pickupAddress || "No address provided"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timeline Card */}
                        <div className="lg:col-span-2">
                            <div className="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm h-full">
                                <div className="flex items-center justify-between mb-10">
                                    <h2 className="text-xl font-black text-slate-800">Recycling Timeline</h2>
                                    {selectedRequest.status === 'REJECTED' && (
                                        <span className="px-4 py-1.5 bg-red-100 text-red-600 rounded-full text-xs font-black uppercase tracking-widest border border-red-200">
                                            Request Rejected
                                        </span>
                                    )}
                                </div>

                                <div className="relative space-y-0">
                                    {/* Timeline Line */}
                                    <div className="absolute left-[1.65rem] top-2 bottom-2 w-0.5 bg-slate-100" />
                                    
                                    {STATUS_STEPS.map((step, index) => {
                                        const isCompleted = index <= statusIndex;
                                        const isCurrent = index === statusIndex + 1 && selectedRequest.status !== 'COMPLETED' && selectedRequest.status !== 'REJECTED';
                                        const isRejected = selectedRequest.status === 'REJECTED' && index === 0;

                                        return (
                                            <div key={index} className="relative pl-16 pb-10 last:pb-0">
                                                {/* Timeline Dot */}
                                                <div className={`absolute left-0 top-0 h-14 w-14 rounded-2xl flex items-center justify-center z-10 transition-all duration-500 border-4 border-white shadow-sm ${
                                                    isCompleted 
                                                        ? "bg-emerald-500 text-white" 
                                                        : isCurrent 
                                                            ? "bg-blue-500 text-white animate-pulse" 
                                                            : isRejected
                                                                ? "bg-red-500 text-white"
                                                                : "bg-slate-100 text-slate-400"
                                                }`}>
                                                    {isCompleted ? <FiCheck size={24} strokeWidth={3} /> : React.cloneElement(step.icon, { size: 24 })}
                                                </div>

                                                <div className={`transition-all duration-500 ${isCompleted ? 'opacity-100' : 'opacity-60'}`}>
                                                    <h4 className={`text-lg font-black ${isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                                                        {step.label}
                                                    </h4>
                                                    <p className="text-sm text-slate-500 font-medium mt-1 leading-relaxed max-w-md">
                                                        {step.description}
                                                    </p>
                                                    {isCompleted && (
                                                        <motion.div 
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            className="mt-2 inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-md"
                                                        >
                                                            <FiCheckCircle size={10} /> Completed
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Quick Access Grid */}
            {!loading && requests.length > 0 && !selectedRequest && (
                <div className="space-y-6" onClick={(e) => e.stopPropagation()}>
                    <h2 className="text-xl font-black text-slate-800">Your Recent Requests</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {requests.slice(0, 6).map((r) => (
                            <button
                                key={r.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (selectedRequest && selectedRequest.id === r.id) {
                                        setSelectedRequest(null);
                                    } else {
                                        setRequestId(String(r.id));
                                        setSelectedRequest(r);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }
                                }}
                                className="group flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-white text-left transition-all duration-300 hover:shadow-xl hover:border-emerald-200 hover:-translate-y-1"
                            >
                                <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-50 transition-colors">
                                    {r.imageData ? (
                                        <img src={`data:${r.imageType};base64,${r.imageData}`} alt="" className="h-8 w-8 object-contain" />
                                    ) : (
                                        <FiPackage className="text-slate-300 group-hover:text-emerald-400" size={20} />
                                    )}
                                </div>
                                <div className="flex-1 truncate">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">ID #{r.id}</p>
                                    <p className="text-sm font-bold text-slate-800 truncate">{r.deviceType}</p>
                                </div>
                                <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                    <FiCheck size={14} strokeWidth={3} />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default TrackEwaste;
