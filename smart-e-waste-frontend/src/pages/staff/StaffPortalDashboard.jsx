import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    FiLayout, 
    FiLogOut, 
    FiCheckCircle, 
    FiXCircle, 
    FiTruck, 
    FiClock, 
    FiImage, 
    FiMapPin, 
    FiChevronDown, 
    FiChevronUp,
    FiBox,
    FiX,
    FiCalendar,
    FiInfo
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { 
    fetchStaffPickupsApi, 
    updateStaffPickupStatusApi,
    getAuthFromStorage, 
    clearAuthFromStorage 
} from "../../api";

const PickupDetailsModal = ({ item, onClose, onUpdateStatus }) => {
    if (!item) return null;

    const imageUrl = item.imageData 
        ? `data:${item.imageType || 'image/jpeg'};base64,${item.imageData}` 
        : (item.imageUrl || (item.imageName ? `http://localhost:8080/api/public/images/${item.imageName}` : null));

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-[2rem] w-full max-w-xl relative z-10 shadow-2xl overflow-hidden"
            >
                {/* Image Header */}
                <div className="relative h-64 bg-slate-900">
                    {imageUrl ? (
                        <img src={imageUrl} alt="Device" className="w-full h-full object-cover opacity-80" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-600">
                            <FiImage size={64} />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-8 text-white">
                        <h3 className="text-2xl font-black tracking-tight">{item.brand} {item.model}</h3>
                        <p className="text-sm font-bold text-white/70 uppercase tracking-widest mt-1">{item.deviceType}</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="absolute top-6 right-6 h-10 w-10 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Details Grid */}
                <div className="p-8 space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-2xl">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Quantity</p>
                            <p className="text-sm font-black text-slate-800">{item.quantity || 1} Unit(s)</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Condition</p>
                            <p className="text-sm font-black text-slate-800">{item.condition || 'Not Specified'}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pickup Date</p>
                            <p className="text-sm font-black text-slate-800">{item.scheduledAt ? new Date(item.scheduledAt).toLocaleDateString() : 'N/A'}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pickup Time</p>
                            <p className="text-sm font-black text-slate-800">{item.scheduledAt ? new Date(item.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                                <FiMapPin size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pickup Address</p>
                                <p className="text-sm font-bold text-slate-600">{item.pickupAddress}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                                <FiCalendar size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Scheduled Time</p>
                                <p className="text-sm font-bold text-slate-600">{item.scheduledAt ? new Date(item.scheduledAt).toLocaleString() : 'Not Scheduled'}</p>
                            </div>
                        </div>
                    </div>

                    {item.remarks && (
                        <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-2xl">
                            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1 flex items-center gap-2">
                                <FiInfo size={12} /> Remarks
                            </p>
                            <p className="text-sm font-bold text-amber-800/80">{item.remarks}</p>
                        </div>
                    )}

                    <div className="flex gap-4 pt-4">
                        <button 
                            onClick={() => onUpdateStatus(item.id, "REJECTED")}
                            className="flex-1 border-2 border-rose-50 text-rose-500 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
                        >
                            <FiXCircle size={18} /> Reject
                        </button>
                        <button 
                            onClick={() => onUpdateStatus(item.id, "COMPLETED")}
                            className="flex-[1.5] bg-[#059669] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-2"
                        >
                            <FiCheckCircle size={18} /> Mark Collected
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const StaffPortalDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [error, setError] = useState("");
    const auth = getAuthFromStorage();
    const personnelName = auth?.fullName || auth?.loginId;

    const loadRequests = async () => {
        setLoading(true);
        try {
            const token = auth?.token;
            if (!token) throw new Error("No token found");
            
            const res = await fetchStaffPickupsApi({ token, page: 0, size: 100 });
            const page = res?.data ?? res;
            const content = Array.isArray(page?.content) ? page.content : [];
            setRequests(content);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(true);
            setTimeout(() => setLoading(false), 800);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const handleSignOut = () => {
        clearAuthFromStorage();
        navigate("/login");
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await updateStaffPickupStatusApi({ token: auth.token, id, status: newStatus });
            setSelectedItem(null);
            loadRequests();
        } catch (err) {
            alert("Failed to update status: " + err.message);
        }
    };

    const assignedPickups = useMemo(() => 
        requests.filter(r => r.status === "SCHEDULED" || r.status === "IN_PROGRESS" || r.status === "APPROVED"),
    [requests]);

    const completedHistory = useMemo(() => 
        requests.filter(r => r.status === "COMPLETED" || r.status === "REJECTED"),
    [requests]);

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex">
            <AnimatePresence>
                {selectedItem && (
                    <PickupDetailsModal 
                        item={selectedItem} 
                        onClose={() => setSelectedItem(null)} 
                        onUpdateStatus={handleStatusUpdate}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-slate-100 flex flex-col fixed h-full z-20">
                <div className="p-6">
                    <div className="bg-[#059669] rounded-xl p-4 flex items-center gap-3 text-white shadow-lg shadow-emerald-100">
                        <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center font-bold">P</div>
                        <span className="font-bold tracking-tight">Staff Portal</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2">
                    <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Menu</p>
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-sm transition-all border border-emerald-100/50">
                        <FiLayout size={18} />
                        Dashboard
                    </button>
                </nav>

                <div className="p-4 border-t border-slate-50">
                    <button 
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-50 rounded-xl font-bold text-sm transition-all group"
                    >
                        <FiLogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 ml-64 p-8">
                {/* Top Header */}
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Welcome back,</h1>
                        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">{personnelName}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs border-2 border-white ring-1 ring-emerald-50">
                            {personnelName?.charAt(0).toUpperCase()}
                        </div>
                        <FiChevronDown className="text-slate-400" size={14} />
                    </div>
                </div>

                <div className="max-w-6xl mx-auto space-y-16">
                    {/* Assigned Pickups Section */}
                    <section className="space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-sm border border-emerald-100">
                                    <FiBox size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-800 tracking-tight">Assigned Pickups</h2>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{assignedPickups.length} tasks pending</p>
                                </div>
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-80 rounded-[2rem] bg-white border border-slate-100 p-6 space-y-4 animate-pulse">
                                        <div className="h-32 w-full bg-slate-50 rounded-2xl" />
                                        <div className="h-6 w-3/4 bg-slate-50 rounded-lg" />
                                        <div className="h-4 w-1/2 bg-slate-50 rounded-lg" />
                                    </div>
                                ))}
                            </div>
                        ) : assignedPickups.length === 0 ? (
                            <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100 p-20 text-center">
                                <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FiCheckCircle size={32} className="text-slate-200" />
                                </div>
                                <p className="text-slate-400 font-black text-xs uppercase tracking-[0.2em]">No pending pickups assigned. Good job!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {assignedPickups.map(r => {
                                    const cardImageUrl = r.imageData 
                                        ? `data:${r.imageType || 'image/jpeg'};base64,${r.imageData}` 
                                        : (r.imageUrl || (r.imageName ? `http://localhost:8080/api/public/images/${r.imageName}` : null));

                                    return (
                                        <motion.div 
                                            key={r.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-500 flex flex-col"
                                        >
                                            {/* Small Card Header Image */}
                                            <div className="h-40 bg-slate-50 relative overflow-hidden flex items-center justify-center">
                                                {cardImageUrl ? (
                                                    <img src={cardImageUrl} alt="Device" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                ) : (
                                                    <div className="flex flex-col items-center gap-2 text-slate-200">
                                                        <FiImage size={32} />
                                                        <span className="text-[8px] font-black uppercase tracking-widest">No Image</span>
                                                    </div>
                                                )}
                                                <div className="absolute top-4 left-4">
                                                    <span className="px-2 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[8px] font-black uppercase tracking-widest shadow-sm text-emerald-600 border border-slate-100">
                                                        {r.deviceType}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-6 space-y-4 flex-1 flex flex-col">
                                                <div>
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h3 className="text-base font-black text-slate-800 tracking-tight truncate">{r.brand} {r.model}</h3>
                                                        <span className="text-[10px] font-black text-slate-300">#{r.id}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-slate-400">
                                                        <FiMapPin size={12} className="text-emerald-500" />
                                                        <p className="text-[10px] font-bold truncate">{r.pickupAddress}</p>
                                                    </div>
                                                </div>

                                                <button 
                                                    onClick={() => setSelectedItem(r)}
                                                    className="w-full bg-[#059669] text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"
                                                >
                                                    <FiTruck size={14} />
                                                    View Details & Collect
                                                </button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </section>

                    {/* Completed History Section */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shadow-sm">
                                <FiClock size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-800 tracking-tight">Completed History</h2>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{completedHistory.length} total processed</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {completedHistory.map(r => {
                                const historyImageUrl = r.imageData 
                                    ? `data:${r.imageType || 'image/jpeg'};base64,${r.imageData}` 
                                    : (r.imageUrl || (r.imageName ? `http://localhost:8080/api/public/images/${r.imageName}` : null));

                                return (
                                    <div key={r.id} className="bg-white rounded-[1.5rem] p-4 border border-slate-100 flex items-center justify-between group hover:border-emerald-200 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100">
                                                {historyImageUrl ? (
                                                    <img src={historyImageUrl} alt="" className="h-full w-full object-cover" />
                                                ) : (
                                                    <FiBox size={18} className="text-slate-200" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-slate-800 truncate max-w-[150px]">{r.brand} {r.model}</h4>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[9px] text-slate-400 font-bold uppercase">{r.deviceType}</span>
                                                    <span className="h-0.5 w-0.5 rounded-full bg-slate-200" />
                                                    <span className="text-[9px] text-slate-400 font-bold uppercase">{new Date(r.pickupDateTime || r.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center border ${r.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-rose-50 text-rose-500 border-rose-100'}`}>
                                            {r.status === 'COMPLETED' ? <FiCheckCircle size={16} /> : <FiXCircle size={16} />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default StaffPortalDashboard;
