import React, { useEffect, useState, useRef } from "react";
import { getAuthFromStorage } from "../api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
    FiUser, 
    FiMail, 
    FiPhone, 
    FiMapPin, 
    FiEdit3, 
    FiShield, 
    FiCalendar, 
    FiArrowLeft,
    FiCamera,
    FiMap,
    FiCheck
} from "react-icons/fi";

const UserProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const fileInputRef = useRef(null);
    const auth = getAuthFromStorage();

    useEffect(() => {
        if (!auth || !auth.token) {
            setLoading(false);
            return;
        }

        // Use the auth data directly from storage
        setProfile({
            fullName: auth.fullName,
            email: auth.email,
            phone: auth.phone,
            city: auth.city,
            address: auth.address,
            avatarUrl: auth.avatarUrl,
        });
        setLoading(false);
    }, []);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChangePassword = () => {
        // Clear resetUsername from sessionStorage if it exists to allow new flow
        sessionStorage.removeItem("resetUsername");
        // Redirect to the forgot password page to initiate the reset flow
        navigate("/forgot-password"); 
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="h-12 w-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto pb-10 px-4"
        >
            {/* Hidden File Input */}
            <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/user")}
                        className="h-12 w-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-500 hover:text-emerald-600 hover:border-emerald-100 hover:bg-emerald-50 transition-all shadow-sm group"
                    >
                        <FiArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">My Profile</h1>
                        <p className="text-sm text-slate-500 font-medium mt-1">Manage your personal information and account settings.</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate("/user/edit-profile")}
                    className="flex items-center justify-center gap-3 px-8 py-4 bg-emerald-600 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-emerald-700 hover:-translate-y-1 transition-all shadow-xl shadow-emerald-200"
                >
                    <FiEdit3 size={14} />
                    Edit Profile
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Avatar & Quick Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm text-center relative overflow-hidden group">
                        {/* Decorative background element */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-emerald-500/10 to-teal-400/10 transition-colors duration-500 group-hover:from-emerald-500/20 group-hover:to-teal-400/20" />
                        
                        <div className="relative mt-6">
                            <div className="h-36 w-36 rounded-[2.5rem] bg-emerald-100 mx-auto flex items-center justify-center text-emerald-600 border-4 border-white shadow-xl relative group/avatar overflow-hidden">
                                {avatarPreview || profile?.avatarUrl ? (
                                    <img 
                                        src={avatarPreview || profile.avatarUrl} 
                                        alt="Avatar" 
                                        className="h-full w-full object-cover group-hover/avatar:scale-110 transition-transform duration-500" 
                                    />
                                ) : (
                                    <FiUser size={56} className="group-hover/avatar:scale-110 transition-transform duration-500" />
                                )}
                                
                                <button 
                                    onClick={handleAvatarClick}
                                    className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300"
                                >
                                    <FiCamera size={24} />
                                </button>
                            </div>
                            
                            {avatarFile && (
                                <button className="absolute -bottom-2 right-1/2 translate-x-12 h-8 w-8 rounded-lg bg-emerald-500 text-white shadow-lg flex items-center justify-center hover:bg-emerald-600 transition-colors">
                                    <FiCheck size={16} />
                                </button>
                            )}
                        </div>

                        <div className="mt-8">
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">{profile?.fullName || "Guest User"}</h2>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2 bg-slate-50 inline-block px-3 py-1 rounded-full border border-slate-100">Recycling Contributor</p>
                        </div>
                    </div>

                    <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-emerald-200/50 relative overflow-hidden group">
                        <div className="absolute -right-10 -bottom-10 h-40 w-40 bg-white rounded-full opacity-10 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
                        <h3 className="text-lg font-black mb-4 flex items-center gap-3">
                            <FiShield className="text-emerald-300" />
                            Verified Account
                        </h3>
                        <p className="text-sm text-emerald-50 leading-relaxed font-medium opacity-90">
                            Your account is verified and ready for professional e-waste recycling requests.
                        </p>
                    </div>
                </div>

                {/* Right Column: Detailed Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
                        <h3 className="text-xl font-black text-slate-800 mb-10 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm shadow-emerald-100">
                                <FiUser size={22} />
                            </div>
                            Personal Information
                        </h3>

                        {!profile ? (
                            <div className="p-16 text-center rounded-[2rem] bg-slate-50/50 border-2 border-dashed border-slate-100">
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Profile data not available</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <ProfileItem 
                                    icon={<FiUser />} 
                                    label="Full Name" 
                                    value={profile.fullName} 
                                    color="emerald"
                                />
                                <ProfileItem 
                                    icon={<FiMail />} 
                                    label="Email Address" 
                                    value={profile.email} 
                                    color="blue"
                                />
                                <ProfileItem 
                                    icon={<FiPhone />} 
                                    label="Phone Number" 
                                    value={profile.phone || "Not provided"} 
                                    color="purple"
                                />
                                <ProfileItem 
                                    icon={<FiMapPin />} 
                                    label="City" 
                                    value={profile.city || "Not provided"} 
                                    color="rose"
                                />
                                <div className="md:col-span-2">
                                    <ProfileItem 
                                        icon={<FiMap />} 
                                        label="Full Address" 
                                        value={profile.address || "No address details added yet."} 
                                        color="indigo"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-emerald-50 rounded-[2.5rem] p-8 border border-emerald-100 flex flex-col md:flex-row items-center gap-8 justify-between">
                        <div className="flex items-center gap-5 text-center md:text-left">
                            <div className="h-16 w-16 rounded-[1.5rem] bg-white flex items-center justify-center text-emerald-600 shadow-sm shrink-0 border border-emerald-100">
                                <FiShield size={32} />
                            </div>
                            <div>
                                <h4 className="text-lg font-black text-slate-800 leading-tight">Secure Account</h4>
                                <p className="text-sm text-slate-500 font-medium mt-1">Your data is protected with enterprise-grade security.</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleChangePassword}
                            className="w-full md:w-auto px-8 py-4 bg-white text-slate-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all shadow-sm active:scale-95"
                        >
                            Change Password
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const ProfileItem = ({ icon, label, value, color }) => {
    const colorMap = {
        emerald: "bg-emerald-50 text-emerald-600",
        blue: "bg-blue-50 text-blue-600",
        purple: "bg-purple-50 text-purple-600",
        amber: "bg-amber-50 text-amber-600",
        rose: "bg-rose-50 text-rose-600",
        indigo: "bg-indigo-50 text-indigo-600",
    };

    return (
        <div className="group">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 group-hover:text-emerald-500 transition-colors">
                {label}
            </p>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-transparent group-hover:border-slate-100 group-hover:bg-white group-hover:shadow-md transition-all duration-300">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${colorMap[color] || colorMap.emerald}`}>
                    {React.cloneElement(icon, { size: 18 })}
                </div>
                <p className="text-sm font-bold text-slate-700 truncate">
                    {value || "—"}
                </p>
            </div>
        </div>
    );
};

export default UserProfile;
