import React, { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiHome, FiPlusCircle, FiList, FiMap, FiUser, FiBookOpen, FiArrowLeft, FiLogOut } from "react-icons/fi";
import { clearAuthFromStorage } from "../../api";

const UserLayout = () => {

    const [collapsed,setCollapsed] = useState(false)
    const location = useLocation();
    const navigate = useNavigate();
    const showBackArrow = location.pathname !== "/user";

    return (

        <div className="min-h-screen flex bg-slate-50 [background-image:radial-gradient(circle_at_15%_15%,rgba(16,185,129,0.10)_0%,transparent_45%),radial-gradient(circle_at_85%_70%,rgba(59,130,246,0.08)_0%,transparent_45%)]">

            {/* Sidebar */}
            <aside className={`bg-white/80 backdrop-blur-xl border-r shadow-lg transition-all ${collapsed ? "w-20":"w-64"} flex flex-col`}>

                <div className="flex items-center justify-between p-4 border-b">

                    {!collapsed && (
                        <h2 className="font-bold text-lg text-emerald-700">
                            User Panel
                        </h2>
                    )}

                    <div className="flex items-center gap-2">
                        {showBackArrow && (
                            <button
                                type="button"
                                onClick={() => navigate("/user")}
                                className="rounded-lg p-2 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition"
                                aria-label="Back to dashboard"
                                title="Back"
                            >
                                <FiArrowLeft />
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => setCollapsed(!collapsed)}
                            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 transition"
                            aria-label="Toggle sidebar"
                            title="Menu"
                        >
                            <FiMenu/>
                        </button>
                    </div>

                </div>

                <nav className="flex-1 p-3 space-y-2 overflow-y-auto custom-scrollbar">

                    <NavItem to="/user" icon={<FiHome/>} label="Dashboard" collapsed={collapsed}/>
                    <NavItem to="/user/submit" icon={<FiPlusCircle/>} label="Schedule Pickup" collapsed={collapsed}/>
                    <NavItem to="/user/requests" icon={<FiList/>} label="My Requests" collapsed={collapsed}/>
                    <NavItem to="/user/track" icon={<FiMap/>} label="Track Ewaste" collapsed={collapsed}/>
                    <NavItem to="/user/profile" icon={<FiUser/>} label="Profile" collapsed={collapsed}/>

                    <div className="pt-2" />

                </nav>

                {/* SIGN OUT BUTTON */}
                <div className="px-3 py-4 border-t border-slate-200 mt-auto flex-shrink-0 bg-white/80">
                    <button
                        type="button"
                        onClick={() => {
                            clearAuthFromStorage();
                            navigate("/", { replace: true });
                        }}
                        className={`w-full flex items-center gap-2 text-sm font-bold transition-all duration-200 ${collapsed ? 'justify-center' : ''} text-black hover:text-red-600 group`}
                    >
                        <span className="h-8 w-8 rounded-lg flex items-center justify-center bg-slate-100 group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                            <FiLogOut size={14} />
                        </span>
                        {!collapsed && <span>Sign out</span>}
                    </button>
                </div>

            </aside>

            <main className="flex-1 p-8 overflow-auto">

                <Outlet/>

            </main>

        </div>
    )
}

export default UserLayout

function NavItem({to,icon,label,collapsed}){

    return (
        <NavLink
            to={to}
            end={to==="/user"}
            className={({isActive}) =>
                `flex items-center gap-3 p-3 rounded-xl transition 
        ${isActive ? "bg-emerald-100 text-emerald-700":"hover:bg-emerald-50"}`
            }
        >
            {icon}
            {!collapsed && <span>{label}</span>}
        </NavLink>
    )
}