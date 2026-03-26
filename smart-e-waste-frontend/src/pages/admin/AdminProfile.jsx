import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAuthFromStorage, saveAuthToStorage } from "../../api";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, MapPin, City, Shield, Edit, ArrowLeft } from "lucide-react";

const AdminProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuthFromStorage();
        if (!auth || !auth.token) return navigate("/login");

        // Use data from storage to avoid GET /api/admin/profile issues
        setProfile({
            fullName: auth.fullName || "Admin",
            email: auth.email || "",
            phone: auth.phone || "",
            city: auth.city || "",
            address: auth.address || "",
        });
        setLoading(false);
    }, [navigate]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (!profile) return (
        <div className="text-center py-20">
            <p className="text-slate-500">Unable to load profile data.</p>
            <button onClick={() => window.location.reload()} className="mt-4 text-indigo-600 font-bold">Retry</button>
        </div>
    );

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
        >
            <button
                onClick={() => navigate("/admin/dashboard")}
                className="group mb-6 flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold transition-colors"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
            </button>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Header/Cover area */}
                <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                
                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-8">
                        <div className="h-24 w-24 rounded-3xl bg-white p-1 shadow-lg">
                            <div className="h-full w-full rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                                <User size={40} />
                            </div>
                        </div>
                        <button
                            onClick={() => navigate("/admin/edit-profile")}
                            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
                        >
                            <Edit size={16} /> Edit Profile
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-2xl font-black text-slate-800">{profile.fullName}</h1>
                                <div className="flex items-center gap-2 mt-1 text-slate-500">
                                    <Shield size={14} className="text-indigo-500" />
                                    <span className="text-xs font-bold uppercase tracking-wider">System Administrator</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <ProfileItem icon={<Mail size={18} />} label="Email Address" value={profile.email} />
                                <ProfileItem icon={<Phone size={18} />} label="Phone Number" value={profile.phone || "Not provided"} />
                            </div>
                        </div>

                        <div className="space-y-4 md:mt-14">
                            <ProfileItem icon={<MapPin size={18} />} label="Full Address" value={profile.address || "Not provided"} />
                            <ProfileItem icon={<City size={18} />} label="City / Region" value={profile.city || "Not provided"} />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const ProfileItem = ({ icon, label, value }) => (
    <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100/50">
        <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm shrink-0">
            {icon}
        </div>
        <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{label}</p>
            <p className="text-sm font-bold text-slate-700">{value}</p>
        </div>
    </div>
);

export default AdminProfile;
