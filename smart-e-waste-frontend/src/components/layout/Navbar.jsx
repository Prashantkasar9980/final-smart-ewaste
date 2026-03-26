// src/components/layout/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getAuthFromStorage, clearAuthFromStorage } from "../../api";

const Navbar = () => {
    const [openMenu, setOpenMenu] = useState(false);
    const [authUser, setAuthUser] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const stored = getAuthFromStorage() || null;
        setAuthUser(stored);
    }, [location.key]);

    const handleLogout = () => {
        clearAuthFromStorage();
        setAuthUser(null);
        setOpenMenu(false);
        navigate("/", { replace: true });
    };

    const handleProfile = () => {
        if (authUser?.role === "ROLE_ADMIN") {
            navigate("/admin/dashboard");
        } else if (authUser?.role === "ROLE_STAFF") {
            navigate("/staff");
        } else {
            navigate("/user");
        }
    };

    const goToSection = (id) => {
        if (location.pathname === "/") {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: "smooth" });
            return;
        }
        navigate("/");
        setTimeout(() => {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 200);
    };

    const userInitial =
        authUser?.fullName?.charAt(0).toUpperCase() ||
        authUser?.loginId?.charAt(0)?.toUpperCase() ||
        "?";

    return (
        <nav className="w-full bg-white border-b border-slate-200 shadow-sm">

            <div className="w-full px-6 h-[64px] flex items-center">

                {/* LOGO - fully left, shrink-0 prevents it from being squeezed */}
                <Link to="/" className="flex items-center gap-2 shrink-0">
                    <div
                        className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-extrabold select-none"
                        aria-label="Smart-Ewaste"
                        title="Smart-Ewaste"
                    >
                        SE
                    </div>
                    <span className="text-xl font-bold text-emerald-600">
            Smart-Ewaste
          </span>
                </Link>

                {/* RIGHT SECTION */}
                <div className="hidden lg:flex items-center gap-8 ml-auto">

                    {/* NAV LINKS */}
                    <div className="flex items-center gap-8 text-[16px] font-semibold text-slate-800">
                        <button onClick={() => goToSection("home")} className="hover:text-emerald-600 transition">
                            Home
                        </button>
                        <button onClick={() => goToSection("services")} className="hover:text-emerald-600 transition">
                            Services
                        </button>
                        <button onClick={() => goToSection("process")} className="hover:text-emerald-600 transition">
                            Process
                        </button>
                        <button onClick={() => goToSection("contact")} className="hover:text-emerald-600 transition">
                            Contact
                        </button>
                    </div>

                    {/* AUTH */}
                    {!authUser?.loginId ? (
                        <div className="flex items-center gap-3">
                            <Link
                                to="/login"
                                className="px-4 py-2 bg-emerald-600 text-white rounded-full text-sm font-medium hover:bg-emerald-700 transition"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium hover:bg-slate-200 transition"
                            >
                                Register
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleProfile}
                                className="px-4 py-2 border border-slate-300 rounded-lg flex items-center gap-2 text-sm hover:bg-slate-100 transition"
                            >
                                <span className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                    {userInitial}
                                </span>
                                {authUser?.role === "ROLE_ADMIN" ? "Admin Dashboard" : authUser?.role === "ROLE_STAFF" ? "Staff Portal" : "User Dashboard"}
                            </button>

                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-emerald-600 text-white rounded-full text-sm hover:bg-emerald-700 transition"
                            >
                                Logout
                            </button>
                        </div>
                    )}

                </div>

                {/* MOBILE BUTTON */}
                <button
                    onClick={() => setOpenMenu(true)}
                    className="lg:hidden ml-auto text-xl"
                >
                    ☰
                </button>

            </div>

            {/* MOBILE MENU */}
            {openMenu && (
                <div
                    className="fixed inset-0 bg-black/30 z-50"
                    onClick={() => setOpenMenu(false)}
                >
                    <div
                        className="absolute top-0 right-0 w-[260px] bg-white h-full shadow-xl p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold">Menu</h2>
                            <button onClick={() => setOpenMenu(false)}>✕</button>
                        </div>

                        <div className="flex flex-col gap-4 text-sm">
                            <button onClick={() => goToSection("home")}>Home</button>
                            <button onClick={() => goToSection("services")}>Services</button>
                            <button onClick={() => goToSection("process")}>Process</button>
                            <button onClick={() => goToSection("contact")}>Contact</button>

                            <hr />

                            {!authUser?.loginId ? (
                                <>
                                    <Link to="/login">Login</Link>
                                    <Link to="/register">Register</Link>
                                </>
                            ) : (
                                <>
                                    <button onClick={handleProfile}>
                                        {authUser?.role === "ROLE_ADMIN" ? "Admin Dashboard" : authUser?.role === "ROLE_STAFF" ? "Staff Portal" : "User Dashboard"}
                                    </button>
                                    <button onClick={handleLogout} className="text-red-600">
                                        Logout
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </nav>
    );
};

export default Navbar;