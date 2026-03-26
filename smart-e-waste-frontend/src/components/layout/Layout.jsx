// src/components/layout/Layout.jsx
import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />

            {/* Let each page control its own width / padding so
                the homepage can use full desktop width when needed */}
            <main className="flex-grow w-full">
                {children}
            </main>

            <Footer />
        </div>
    );
};

export default Layout;