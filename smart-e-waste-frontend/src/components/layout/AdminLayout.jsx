// src/components/layout/AdminLayout.jsx
import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearAuthFromStorage } from "../../api";
import {
    FiMenu,
    FiHome,
    FiUsers,
    FiUserCheck,
    FiClipboard,
    FiLogOut
} from "react-icons/fi";

const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 [background-image:radial-gradient(circle_at_15%_15%,rgba(16,185,129,0.10)_0%,transparent_45%),radial-gradient(circle_at_85%_70%,rgba(59,130,246,0.08)_0%,transparent_45%)]">
            <div className="flex flex-1">

                {/* SIDEBAR */}
                <aside
                    className={`hidden md:flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ${
                        collapsed ? "w-20" : "w-64"
                    }`}
                >
                    <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200">
                        {!collapsed && (
                            <h1 className="text-lg font-bold text-emerald-600">
                                Admin Panel
                            </h1>
                        )}

                        <button
                            onClick={() => setCollapsed(prev => !prev)}
                            className="text-slate-600 hover:text-emerald-600"
                        >
                            <FiMenu size={20} />
                        </button>
                    </div>

                    <nav className="mt-4 px-2 space-y-1 flex-1 overflow-y-auto custom-scrollbar">
                        <NavItem to="/admin/dashboard" icon={<FiHome />} label="Dashboard" collapsed={collapsed} />
                        <NavItem to="/admin/users" icon={<FiUsers />} label="Users" collapsed={collapsed} />
                        <NavItem to="/admin/requests" icon={<FiClipboard />} label="Requests" collapsed={collapsed} />
                        <NavItem to="/admin/personnel" icon={<FiUserCheck />} label="Personnel" collapsed={collapsed} />
                    </nav>

                    {/* SIGN OUT BUTTON */}
                    <div className="px-3 py-4 border-t border-slate-200 flex-shrink-0 bg-white">
                        <button
                            type="button"
                            onClick={() => {
                                clearAuthFromStorage();
                                navigate("/", { replace: true });
                            }}
                            className={`w-full flex items-center gap-2 text-sm font-bold transition-colors duration-200 ${collapsed ? 'justify-center' : ''} text-slate-600 hover:text-red-500`}
                        >
                            <span className="h-8 w-8 rounded-lg flex items-center justify-center bg-slate-100 group-hover:bg-red-50 group-hover:text-red-500">
                                <FiLogOut size={14} />
                            </span>
                            {!collapsed && <span>Sign out</span>}
                        </button>
                    </div>

                    {/* REMOVED OLD SIGN OUT SECTION */}
                </aside>

                {/* MAIN CONTENT */}
                <div className="flex-1 flex flex-col">

                    {/* HEADER */}
                    <header className="px-8 py-6 bg-white/90 backdrop-blur border-b border-slate-200">
                        <h2 className="text-2xl font-extrabold text-slate-900">
                            Admin Console
                        </h2>
                        <p className="text-sm text-slate-600 mt-1">
                            Users, requests, scheduling, and analytics
                        </p>
                    </header>

                    {/* CONTENT */}
                    <main className="flex-grow">
                        <div className="max-w-7xl mx-auto px-8 py-10">
                            <Outlet />
                        </div>
                    </main>

                </div>
            </div>
        </div>
    );
};

export default AdminLayout;

function NavItem({ to, icon, label, collapsed }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-lg transition ${
                    isActive
                        ? "bg-emerald-100 text-emerald-700 font-semibold"
                        : "text-slate-700 hover:bg-slate-100"
                }`
            }
        >
            {icon}
            {!collapsed && <span>{label}</span>}
        </NavLink>
    );
}